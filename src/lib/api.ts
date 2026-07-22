import { CONFIG } from "../config";
import type {
  AppliedCoupon,
  CartItem,
  MyCoupons,
  CheckoutForm,
  PlacedOrder,
  Product,
  Settings,
  TrackResult,
} from "../types";

export const isDemo = !CONFIG.SCRIPT_URL;

/* ────────────────────────── demo catalogue ──────────────────────────
   Shown only while SCRIPT_URL is empty, so the site is previewable
   before the Google Sheet backend is connected.                       */
const DEMO_PRODUCTS: Product[] = [
  {
    id: "NC-01",
    name: "Wild Honey & Oat",
    price: 149,
    description:
      "Raw honey and colloidal oats, slow-cured for 4 weeks. A gentle everyday bar that calms dry, tired skin.",
    image: "",
    images: [],
    tag: "Bestseller",
    active: true,
  },
  {
    id: "NC-02",
    name: "Charcoal & Cedar",
    price: 179,
    description:
      "Activated bamboo charcoal with cold-pressed cedarwood oil. Deep-cleansing, made for oily and combination skin.",
    image: "",
    images: [],
    tag: "Detox",
    active: true,
  },
  {
    id: "NC-03",
    name: "Rose Clay Bloom",
    price: 169,
    description:
      "French rose clay, damask rose petals and a whisper of geranium. Soft lather, softer skin.",
    image: "",
    images: [],
    tag: "New",
    active: true,
  },
  {
    id: "NC-04",
    name: "Neem & Tulsi",
    price: 139,
    description:
      "The classic Indian garden bar — neem, tulsi and turmeric, blended the way grandmothers intended.",
    image: "",
    images: [],
    tag: "Ayurvedic",
    active: true,
  },
  {
    id: "NC-05",
    name: "Lemongrass Morning",
    price: 149,
    description:
      "Bright lemongrass and kaffir lime in a shea butter base. Wakes you up better than the alarm does.",
    image: "",
    images: [],
    tag: "Citrus",
    active: true,
  },
  {
    id: "NC-06",
    name: "Coconut Milk Cloud",
    price: 159,
    description:
      "Fresh coconut milk and virgin coconut oil whipped into an ultra-creamy, fragrance-light bar for sensitive skin.",
    image: "",
    images: [],
    tag: "Gentle",
    active: true,
  },
];

const DEMO_SETTINGS: Settings = { deliveryCharge: 0, referralDiscount: 30, firstOrderPct: 10 };

/* ────────────────────────── helpers ────────────────────────── */

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function fmtDate(iso: string | Date): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function fmtMoney(n: number): string {
  return `${CONFIG.CURRENCY}${n.toLocaleString("en-IN")}`;
}

async function getJSON(url: string): Promise<any> {
  const res = await fetch(url, { method: "GET", redirect: "follow" });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
}

/* ────────────────────────── catalogue ────────────────────────── */

export async function fetchCatalogue(): Promise<{
  products: Product[];
  settings: Settings;
}> {
  if (isDemo) {
    await new Promise((r) => setTimeout(r, 350)); // tiny delay so the loading state is visible
    return { products: DEMO_PRODUCTS, settings: DEMO_SETTINGS };
  }
  const data = await getJSON(`${CONFIG.SCRIPT_URL}?action=products`);
  const products: Product[] = (data.products || [])
    .map((p: any) => {
      const images = String(p.image ?? "")
        .split(",")
        .map((u: string) => u.trim())
        .filter((u: string) => u.length > 0);
      return {
        id: String(p.id ?? ""),
        name: String(p.name ?? ""),
        price: Number(p.price) || 0,
        description: String(p.description ?? ""),
        image: images[0] || "",
        images,
        tag: String(p.tag ?? ""),
        active: p.active !== false && String(p.active).toLowerCase() !== "no",
      };
    })
    .filter((p: Product) => p.id && p.name && p.active);
  const settings: Settings = {
    deliveryCharge: Number(data.settings?.deliveryCharge) || 0,
    referralDiscount: Number(data.settings?.referralDiscount) || 0,
    firstOrderPct: Number(data.settings?.firstOrderPct) || 0,
  };
  return { products, settings };
}

/* ────────────────────────── ordering ────────────────────────── */

export interface OrderPayload {
  form: CheckoutForm;
  items: CartItem[];
  subtotal: number;
  delivery: number;
  coupon: string;   // applied coupon code, "" if none
  website?: string; // honeypot — must stay empty
  discount: number; // recomputed server-side; sent for the demo mode + display
  total: number;
}

/* ────────────────────────── coupons ────────────────────────── */

export async function checkCoupon(
  code: string,
  email: string,
  subtotal: number
): Promise<AppliedCoupon> {
  const c = code.trim().toUpperCase();
  if (isDemo) {
    await new Promise((r) => setTimeout(r, 400));
    if (c === "FIRST10")
      return { code: c, label: "10% off your first order", discount: Math.round(subtotal * 0.1) };
    if (c === "SAVE50") return { code: c, label: "₹50 off", discount: Math.min(50, subtotal) };
    if (c.startsWith("NC-"))
      return { code: c, label: "Referral reward — ₹30 off", discount: Math.min(30, subtotal) };
    throw new Error("Coupon code not found.");
  }
  const data = await getJSON(
    `${CONFIG.SCRIPT_URL}?action=coupon&code=${encodeURIComponent(c)}&email=${encodeURIComponent(
      email.trim()
    )}&subtotal=${subtotal}`
  );
  if (!data.valid) throw new Error(data.error || "This coupon can't be applied.");
  return { code: data.code, label: data.label, discount: Number(data.discount) || 0 };
}

export async function fetchMyCoupons(email: string): Promise<MyCoupons> {
  if (isDemo) {
    await new Promise((r) => setTimeout(r, 400));
    return {
      ok: true,
      coupons: [
        { code: "FIRST10", desc: "10% off your first order" },
        { code: "SAVE50", desc: "₹50 off" },
      ],
      referralCode: "",
      referralDiscount: 30,
      canRedeemReferral: true,
    };
  }
  return getJSON(
    `${CONFIG.SCRIPT_URL}?action=coupons&email=${encodeURIComponent(email.trim())}`
  );
}

export async function placeOrder(payload: OrderPayload): Promise<PlacedOrder> {
  const placedOn = new Date();
  const expected = addDays(placedOn, CONFIG.DELIVERY_DAYS);

  if (isDemo) {
    await new Promise((r) => setTimeout(r, 900));
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let orderId = "NC-";
    for (let i = 0; i < 6; i++)
      orderId += chars[Math.floor(Math.random() * chars.length)];
    const order: PlacedOrder = {
      orderId,
      placedOn: placedOn.toISOString(),
      expectedDelivery: expected.toISOString(),
      total: payload.total,
    };
    // remember demo orders locally so Track Order works in the preview
    const demoOrders = JSON.parse(localStorage.getItem("nc_demo_orders") || "{}");
    demoOrders[orderId] = {
      found: true,
      orderId,
      status: "Placed",
      placedOn: order.placedOn,
      expectedDelivery: order.expectedDelivery,
      items: payload.items.map((i) => `${i.product.name} × ${i.qty}`).join(", "),
      total: payload.total,
      name: payload.form.fullName,
    };
    localStorage.setItem("nc_demo_orders", JSON.stringify(demoOrders));
    return order;
  }

  // POST as text/plain: keeps the request "simple" so Apps Script accepts it cross-origin
  const res = await fetch(CONFIG.SCRIPT_URL, {
    method: "POST",
    redirect: "follow",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "order", ...payload }),
  });
  if (!res.ok) throw new Error("Could not reach the order server.");
  const data = await res.json();
  if (!data.ok) throw new Error(data.error || "Order could not be placed.");
  return {
    orderId: data.orderId,
    placedOn: data.placedOn,
    expectedDelivery: data.expectedDelivery,
    total: payload.total,
  };
}

/* ────────────────────────── tracking ────────────────────────── */

export async function trackOrder(orderId: string): Promise<TrackResult> {
  const id = orderId.trim().toUpperCase();
  if (!id) return { found: false };

  if (isDemo) {
    await new Promise((r) => setTimeout(r, 500));
    const demoOrders = JSON.parse(localStorage.getItem("nc_demo_orders") || "{}");
    return demoOrders[id] || { found: false };
  }

  return getJSON(
    `${CONFIG.SCRIPT_URL}?action=track&id=${encodeURIComponent(id)}`
  );
}
