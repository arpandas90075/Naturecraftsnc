export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;    // first/primary image URL, may be ""
  images: string[]; // all image URLs (comma-separated in the sheet), may be empty
  tag: string;   // e.g. "Bestseller", "New", "Charcoal"
  active: boolean;
}

export interface Settings {
  deliveryCharge: number;
  referralDiscount: number;
  firstOrderPct: number;
}

export interface AppliedCoupon {
  code: string;
  label: string;
  discount: number;
}

export interface EligibleCoupon {
  code: string;
  desc: string;
}

export interface MyCoupons {
  ok: boolean;
  coupons: EligibleCoupon[];
  referralCode: string;
  referralDiscount: number;
  canRedeemReferral: boolean;
}

export interface CartItem {
  product: Product;
  qty: number;
}

export interface CheckoutForm {
  fullName: string;
  email: string;
  mobile: string;
  house: string;   // building / house / flat no.
  address: string; // street, area, landmark, city, state
  pincode: string;
}

export type OrderStatus = "Placed" | "In Delivery" | "Delivered";

export interface PlacedOrder {
  orderId: string;
  placedOn: string;        // ISO date
  expectedDelivery: string; // ISO date
  total: number;
}

export interface TrackResult {
  found: boolean;
  orderId?: string;
  status?: OrderStatus;
  placedOn?: string;
  expectedDelivery?: string;
  deliveredOn?: string;
  items?: string;
  total?: number;
  name?: string;
}
