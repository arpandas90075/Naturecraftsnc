import { Link, useNavigate } from "react-router-dom";
import { ProductImage } from "../components/ProductBits";
import { fmtMoney } from "../lib/api";
import { useStore } from "../store";

export function OrderSummary({
  subtotal,
  delivery,
  discount = 0,
  couponCode = "",
  cta,
}: {
  subtotal: number;
  delivery: number;
  discount?: number;
  couponCode?: string;
  cta?: React.ReactNode;
}) {
  const total = Math.max(0, subtotal + delivery - discount);
  return (
    <div className="card h-fit p-6 sm:p-7">
      <h2 className="font-display text-lg tracking-wide text-moss-900">
        Order Summary
      </h2>
      <dl className="mt-5 space-y-3 font-body text-[15px]">
        <div className="flex justify-between text-moss-800">
          <dt>Subtotal</dt>
          <dd>{fmtMoney(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-moss-800">
          <dt>Delivery</dt>
          <dd>{delivery === 0 ? "Free" : fmtMoney(delivery)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-800">
            <dt>Coupon {couponCode}</dt>
            <dd>−{fmtMoney(discount)}</dd>
          </div>
        )}
        <div className="flex justify-between border-t border-moss-900/10 pt-3 text-base font-semibold text-moss-900">
          <dt>Total</dt>
          <dd className="text-gold-700">{fmtMoney(total)}</dd>
        </div>
      </dl>
      <p className="mt-4 rounded-xl bg-moss-50 px-4 py-3 font-body text-[13px] leading-relaxed text-moss-800">
        Pay on arrival — <strong>UPI or cash</strong>. Nothing is charged
        online.
      </p>
      {cta}
    </div>
  );
}

export default function Cart() {
  const { cart, setQty, removeFromCart, subtotal, settings } = useStore();
  const navigate = useNavigate();
  const delivery = cart.length ? settings.deliveryCharge : 0;

  if (cart.length === 0) {
    return (
      <section className="grain">
        <div className="container-nc flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#A87E2F" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 7h12l-1.3 11.1a2 2 0 0 1-2 1.9H9.3a2 2 0 0 1-2-1.9L6 7Z" />
            <path d="M9 7V6a3 3 0 0 1 6 0v1" />
          </svg>
          <h1 className="mt-5 font-display text-3xl text-moss-900">
            Your cart is empty
          </h1>
          <p className="mt-3 max-w-sm font-body text-[15px] font-light text-moss-800/80">
            The workshop shelf is full, though. Find a bar you&rsquo;ll love.
          </p>
          <Link to="/shop" className="btn-gold mt-7">
            Browse soaps
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="grain min-h-[70vh]">
      <div className="container-nc py-14">
        <h1 className="font-display text-3xl text-moss-900 sm:text-4xl">
          Your Cart
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <ul className="space-y-4">
            {cart.map(({ product, qty }) => (
              <li key={product.id} className="card flex gap-4 p-4 sm:gap-5">
                <div className="h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-moss-100 sm:h-28 sm:w-36">
                  <ProductImage p={product} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate font-serif text-lg font-semibold text-moss-900 sm:text-xl">
                        {product.name}
                      </h3>
                      <p className="font-body text-sm text-moss-800/70">
                        {fmtMoney(product.price)} each
                      </p>
                    </div>
                    <button
                      className="shrink-0 font-body text-[13px] text-moss-800/60 underline-offset-4 hover:text-red-700 hover:underline"
                      onClick={() => removeFromCart(product.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div className="flex items-center rounded-full border border-moss-900/20">
                      <button
                        className="h-9 w-9 text-moss-800 transition hover:text-gold-700"
                        onClick={() => setQty(product.id, qty - 1)}
                        aria-label={`Decrease ${product.name} quantity`}
                      >
                        −
                      </button>
                      <span className="w-7 text-center font-body text-sm font-medium" aria-live="polite">
                        {qty}
                      </span>
                      <button
                        className="h-9 w-9 text-moss-800 transition hover:text-gold-700"
                        onClick={() => setQty(product.id, qty + 1)}
                        aria-label={`Increase ${product.name} quantity`}
                      >
                        +
                      </button>
                    </div>
                    <span className="font-body text-[15px] font-semibold text-gold-700">
                      {fmtMoney(product.price * qty)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <OrderSummary
            subtotal={subtotal}
            delivery={delivery}
            cta={
              <button className="btn-gold mt-5 w-full" onClick={() => navigate("/checkout")}>
                Proceed to checkout →
              </button>
            }
          />
        </div>
      </div>
    </section>
  );
}
