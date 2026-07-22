import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkCoupon, isDemo, placeOrder } from "../lib/api";
import { useStore } from "../store";
import type { AppliedCoupon, CheckoutForm } from "../types";
import { OrderSummary } from "./Cart";

const EMPTY: CheckoutForm = {
  fullName: "",
  email: "",
  mobile: "",
  house: "",
  address: "",
  pincode: "",
};

type Errors = Partial<Record<keyof CheckoutForm, string>>;

function validate(f: CheckoutForm): Errors {
  const e: Errors = {};
  if (f.fullName.trim().length < 3) e.fullName = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim()))
    e.email = "Enter a valid email — your e-bill is sent here.";
  if (!/^[6-9]\d{9}$/.test(f.mobile.replace(/\D/g, "")))
    e.mobile = "Enter a 10-digit Indian mobile number.";
  if (f.house.trim().length < 1)
    e.house = "Building / house / flat no. is required.";
  if (f.address.trim().length < 10)
    e.address = "Add street, area, city and state so delivery can find you.";
  if (!/^\d{6}$/.test(f.pincode.trim()))
    e.pincode = "Pincode must be 6 digits.";
  else if (!/^110\d{3}$/.test(f.pincode.trim()))
    e.pincode = "We currently deliver only within Delhi (pincodes starting with 110).";
  return e;
}

export default function Checkout() {
  const { cart, subtotal, settings, clearCart, toast } = useStore();
  const navigate = useNavigate();

  const [form, setForm] = useState<CheckoutForm>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CheckoutForm, boolean>>>({});
  const [placing, setPlacing] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [website, setWebsite] = useState(""); // honeypot — humans never see it
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [couponBusy, setCouponBusy] = useState(false);
  const [couponMsg, setCouponMsg] = useState("");

  const delivery = settings.deliveryCharge;
  const discount = coupon?.discount ?? 0;
  const total = Math.max(0, subtotal + delivery - discount);

  const applyCoupon = async () => {
    if (!couponInput.trim() || couponBusy) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      setCouponMsg("Fill in your email above first — coupons are linked to your email.");
      return;
    }
    setCouponBusy(true);
    setCouponMsg("");
    try {
      const applied = await checkCoupon(couponInput, form.email, subtotal);
      setCoupon(applied);
      setCouponInput("");
      toast(`Coupon ${applied.code} applied`);
    } catch (err: any) {
      setCoupon(null);
      setCouponMsg(err?.message || "This coupon can't be applied.");
    } finally {
      setCouponBusy(false);
    }
  };

  const itemsLabel = useMemo(
    () => cart.map((i) => `${i.product.name} × ${i.qty}`).join(", "),
    [cart]
  );

  if (cart.length === 0) {
    return (
      <section className="grain">
        <div className="container-nc flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="font-display text-3xl text-moss-900">Nothing to checkout</h1>
          <p className="mt-3 font-body text-[15px] font-light text-moss-800/80">
            Add a few bars to your cart first.
          </p>
          <Link to="/shop" className="btn-gold mt-7">Browse soaps</Link>
        </div>
      </section>
    );
  }

  const set = (k: keyof CheckoutForm) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...form, [k]: ev.target.value };
    setForm(next);
    if (touched[k]) setErrors(validate(next));
  };

  const blur = (k: keyof CheckoutForm) => () => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(form));
  };

  const submit = async () => {
    const e = validate(form);
    setErrors(e);
    setTouched({ fullName: true, email: true, mobile: true, house: true, address: true, pincode: true });
    if (Object.keys(e).length) {
      toast("Please fix the highlighted fields");
      return;
    }
    setPlacing(true);
    setSubmitError("");
    try {
      const order = await placeOrder({
        form: {
          ...form,
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          mobile: form.mobile.replace(/\D/g, ""),
          house: form.house.trim(),
          address: form.address.trim(),
          pincode: form.pincode.trim(),
        },
        items: cart,
        subtotal,
        delivery,
        coupon: coupon?.code ?? "",
        discount,
        total,
        website,
      });
      clearCart();
      navigate("/order-placed", {
        state: { order, email: form.email.trim(), items: itemsLabel },
        replace: true,
      });
    } catch (err: any) {
      setSubmitError(
        err?.message ||
          "The order could not be placed. Please check your connection and try again."
      );
    } finally {
      setPlacing(false);
    }
  };

  const field = (
    k: keyof CheckoutForm,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {}
  ) => (
    <div>
      <label htmlFor={k} className="field-label">{label}</label>
      <input
        id={k}
        className={`field-input ${touched[k] && errors[k] ? "!border-red-500/70 !ring-red-500/20" : ""}`}
        value={form[k]}
        onChange={set(k)}
        onBlur={blur(k)}
        {...props}
      />
      {touched[k] && errors[k] && (
        <p className="mt-1.5 font-body text-[13px] text-red-700">{errors[k]}</p>
      )}
    </div>
  );

  return (
    <section className="grain min-h-[70vh]">
      <div className="container-nc py-14">
        <h1 className="font-display text-3xl text-moss-900 sm:text-4xl">Checkout</h1>
        <p className="mt-2 font-body text-[15px] font-light text-moss-800/80">
          Delivery details for <span className="font-medium">{itemsLabel}</span>
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-lg tracking-wide text-moss-900">
              Delivery Details
            </h2>
            <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-moss-50 px-4 py-1.5 font-body text-[13px] text-moss-800">
              🚚 Currently delivering within <strong>Delhi</strong> only
            </p>
            {/* honeypot: invisible to people, irresistible to bots */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", height: 0, width: 0, opacity: 0 }}
            />
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {field("fullName", "Full name", { placeholder: "Ananya Sharma", autoComplete: "name" })}
              {field("email", "Email (e-bill is sent here)", { placeholder: "you@example.com", type: "email", autoComplete: "email", inputMode: "email" })}
              {field("mobile", "Mobile number", { placeholder: "10-digit number", autoComplete: "tel", inputMode: "numeric", maxLength: 10 })}
              {field("pincode", "Pincode", { placeholder: "110001", inputMode: "numeric", maxLength: 6, autoComplete: "postal-code" })}
              {field("house", "Building / house / flat no.", { placeholder: "Flat 3B, Green View Apartments" })}
              <div className="sm:col-span-2">
                <label htmlFor="address" className="field-label">
                  Full address — street, area, landmark, city, state
                </label>
                <textarea
                  id="address"
                  rows={3}
                  className={`field-input resize-none ${touched.address && errors.address ? "!border-red-500/70 !ring-red-500/20" : ""}`}
                  placeholder="12 Lake Road, near City Park, New Delhi, Delhi"
                  value={form.address}
                  onChange={set("address")}
                  onBlur={blur("address")}
                  autoComplete="street-address"
                />
                {touched.address && errors.address && (
                  <p className="mt-1.5 font-body text-[13px] text-red-700">{errors.address}</p>
                )}
              </div>
            </div>

            {/* coupon / referral code */}
            <div className="mt-7">
              <p className="field-label">Coupon or referral code (optional)</p>
              {coupon ? (
                <div className="flex items-center justify-between rounded-xl border border-green-700/30 bg-green-50 px-4 py-3">
                  <p className="font-body text-[14px] text-green-900">
                    <span className="font-semibold">{coupon.code}</span> applied — {coupon.label}{" "}
                    <span className="font-semibold">(−₹{coupon.discount})</span>
                  </p>
                  <button
                    className="font-body text-[13px] text-green-900/70 underline-offset-4 hover:underline"
                    onClick={() => setCoupon(null)}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2.5">
                  <input
                    className="field-input uppercase placeholder:normal-case"
                    placeholder="e.g. FIRST10 or a friend's order ID"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    aria-label="Coupon code"
                  />
                  <button className="btn-outline shrink-0 !px-6" onClick={applyCoupon} disabled={couponBusy}>
                    {couponBusy ? "…" : "Apply"}
                  </button>
                </div>
              )}
              {couponMsg && (
                <p className="mt-1.5 font-body text-[13px] text-red-700">{couponMsg}</p>
              )}
              {!coupon && settings.firstOrderPct > 0 && (
                <p className="mt-1.5 font-body text-[13px] text-moss-800/70">
                  First order? Use <span className="font-semibold text-gold-700">FIRST10</span> for{" "}
                  {settings.firstOrderPct}% off. See all your coupons on the{" "}
                  <Link to="/coupons" className="text-gold-700 underline-offset-4 hover:underline">My Coupons</Link> page.
                </p>
              )}
            </div>

            {/* payment — fixed to pay-on-arrival, exactly as the store works */}
            <div className="mt-7 rounded-xl border border-gold-500/35 bg-gold-500/10 px-5 py-4">
              <p className="font-body text-sm font-medium text-moss-900">
                Payment method
              </p>
              <p className="mt-1 font-body text-[15px] text-moss-800">
                <span className="font-semibold text-gold-700">UPI or cash on arrival</span>{" "}
                — set automatically. You pay when the order reaches you.
              </p>
            </div>

            {submitError && (
              <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 font-body text-sm text-red-800" role="alert">
                {submitError}
              </p>
            )}
            {isDemo && (
              <p className="mt-5 rounded-xl bg-moss-50 px-4 py-3 font-body text-[13px] text-moss-800">
                Preview mode: the order will be simulated locally. Connect your
                Google Sheet (see README) to receive real orders and emails.
              </p>
            )}
          </div>

          <OrderSummary
            subtotal={subtotal}
            delivery={delivery}
            discount={discount}
            couponCode={coupon?.code ?? ""}
            cta={
              <button className="btn-gold mt-5 w-full" onClick={submit} disabled={placing}>
                {placing ? "Placing your order…" : "Place order"}
              </button>
            }
          />
        </div>
      </div>
    </section>
  );
}
