import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LeafDivider } from "../components/Leaf";
import { fmtDate, fmtMoney, trackOrder } from "../lib/api";
import { useStore } from "../store";
import type { PlacedOrder, TrackResult } from "../types";

/* ————————————————— ORDER PLACED ————————————————— */

export function OrderPlaced() {
  const { settings } = useStore();
  const { state } = useLocation() as {
    state?: { order: PlacedOrder; email: string; items: string };
  };

  if (!state?.order) {
    return (
      <section className="grain">
        <div className="container-nc flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="font-display text-3xl text-moss-900">No recent order here</h1>
          <Link to="/shop" className="btn-gold mt-7">Browse soaps</Link>
        </div>
      </section>
    );
  }

  const { order, email, items } = state;
  return (
    <section className="grain">
      <div className="container-nc flex min-h-[72vh] items-center justify-center py-14">
        <div className="card w-full max-w-xl p-8 text-center sm:p-10">
          <svg className="mx-auto" width="58" height="58" viewBox="0 0 24 24" fill="none" stroke="#A87E2F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="m8 12.5 2.6 2.6L16 9.5" />
          </svg>
          <h1 className="mt-5 font-display text-3xl text-moss-900">
            Order Placed
          </h1>
          <p className="mt-2 font-serif text-lg italic text-moss-800/85">
            Thank you — your soap is being wrapped.
          </p>
          <LeafDivider />

          <dl className="mt-2 space-y-3 text-left font-body text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-moss-800/70">Order ID</dt>
              <dd className="font-semibold tracking-wide text-moss-900">{order.orderId}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-moss-800/70">Items</dt>
              <dd className="text-right text-moss-900">{items}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-moss-800/70">Total (pay on arrival)</dt>
              <dd className="font-semibold text-gold-700">{fmtMoney(order.total)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-moss-900/10 pt-3">
              <dt className="text-moss-800/70">Expected delivery</dt>
              <dd className="font-semibold text-moss-900">{fmtDate(order.expectedDelivery)}</dd>
            </div>
          </dl>

          <p className="mt-6 rounded-xl bg-moss-50 px-4 py-3 font-body text-[13px] leading-relaxed text-moss-800">
            Your e-bill has been sent to <strong>{email}</strong>. Keep your
            order ID to track delivery — payment is by UPI or cash when it
            arrives.
          </p>

          {settings.referralDiscount > 0 && (
            <p className="mt-4 rounded-xl border border-dashed border-gold-500/60 bg-gold-500/10 px-4 py-3 font-body text-[13px] leading-relaxed text-moss-800">
              🎁 <strong>{order.orderId}</strong> is also your referral code —
              share it and friends get ₹{settings.referralDiscount} off at
              checkout.
            </p>
          )}

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/track" className="btn-gold">Track this order</Link>
            <Link to="/shop" className="btn-outline">Keep shopping</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ————————————————— TRACK ORDER ————————————————— */

const STEPS = ["Placed", "In Delivery", "Delivered"] as const;

export function Track() {
  const [id, setId] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [searched, setSearched] = useState(false);

  const lookUp = async () => {
    if (!id.trim() || busy) return;
    setBusy(true);
    setSearched(true);
    try {
      setResult(await trackOrder(id));
    } catch {
      setResult({ found: false });
    } finally {
      setBusy(false);
    }
  };

  const stepIndex = result?.status ? STEPS.indexOf(result.status) : -1;

  return (
    <section className="grain min-h-[70vh]">
      <div className="container-nc py-14">
        <div className="text-center">
          <p className="eyebrow">Delivery</p>
          <h1 className="mt-3 font-display text-3xl text-moss-900 sm:text-5xl">
            Track Your Order
          </h1>
          <LeafDivider />
        </div>

        <div className="mx-auto mt-6 flex max-w-md gap-3">
          <input
            className="field-input"
            placeholder="Order ID · e.g. NC-4X2K9A"
            value={id}
            onChange={(e) => setId(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && lookUp()}
            aria-label="Order ID"
          />
          <button className="btn-gold shrink-0 !px-6" onClick={lookUp} disabled={busy}>
            {busy ? "…" : "Track"}
          </button>
        </div>

        {searched && !busy && result && !result.found && (
          <div className="mx-auto mt-10 max-w-md rounded-2xl border border-moss-900/10 bg-white p-8 text-center shadow-lift">
            <p className="font-serif text-xl text-moss-900">
              We couldn&rsquo;t find that order
            </p>
            <p className="mt-2 font-body text-sm font-light leading-relaxed text-moss-800/75">
              Check the order ID in your e-bill email and try again — it looks
              like <span className="font-medium">NC-XXXXXX</span>.
            </p>
          </div>
        )}

        {result?.found && (
          <div className="card mx-auto mt-10 max-w-2xl p-7 sm:p-9">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-xl text-moss-900">{result.orderId}</h2>
              <span className="font-body text-sm text-moss-800/70">
                Placed {fmtDate(result.placedOn || "")}
              </span>
            </div>
            {result.items && (
              <p className="mt-2 font-body text-[15px] text-moss-800">
                {result.items}
                {typeof result.total === "number" && result.total > 0 && (
                  <span className="font-semibold text-gold-700"> · {fmtMoney(result.total)}</span>
                )}
              </p>
            )}

            {/* status timeline */}
            <ol className="mt-8 flex items-center" aria-label="Delivery progress">
              {STEPS.map((s, i) => {
                const done = i <= stepIndex;
                return (
                  <li key={s} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 font-body text-sm font-semibold transition ${
                          done
                            ? "border-gold-500 bg-gold-500 text-moss-950"
                            : "border-moss-900/20 bg-white text-moss-900/40"
                        }`}
                      >
                        {done ? "✓" : i + 1}
                      </span>
                      <span
                        className={`mt-2 whitespace-nowrap font-body text-[12px] font-medium uppercase tracking-wider ${
                          done ? "text-moss-900" : "text-moss-900/40"
                        }`}
                      >
                        {s}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <span
                        className={`mx-2 mb-6 h-0.5 flex-1 ${
                          i < stepIndex ? "bg-gold-500" : "bg-moss-900/15"
                        }`}
                      />
                    )}
                  </li>
                );
              })}
            </ol>

            {/* delivery message — changes with status */}
            <div className="mt-8 rounded-xl bg-moss-50 px-5 py-4 text-center">
              {result.status === "Delivered" ? (
                <p className="font-body text-[15px] text-moss-900">
                  <span className="font-semibold text-gold-700">Delivered</span>
                  {result.deliveredOn ? <> on <strong>{fmtDate(result.deliveredOn)}</strong>.</> : "."}{" "}
                  We hope you love it 🌿
                </p>
              ) : result.status === "In Delivery" ? (
                <p className="font-body text-[15px] text-moss-900">
                  Your soap is <span className="font-semibold text-gold-700">out for delivery</span> —
                  expected by <strong>{fmtDate(result.expectedDelivery || "")}</strong>.
                  Keep your UPI or cash ready.
                </p>
              ) : (
                <p className="font-body text-[15px] text-moss-900">
                  Order received and being prepared. Expected delivery by{" "}
                  <strong>{fmtDate(result.expectedDelivery || "")}</strong>.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
