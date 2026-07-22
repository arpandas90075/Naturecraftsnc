import { useState } from "react";
import { Link } from "react-router-dom";
import { LeafDivider } from "../components/Leaf";
import { fetchMyCoupons } from "../lib/api";
import { useStore } from "../store";
import type { MyCoupons } from "../types";

export default function Coupons() {
  const { toast, settings } = useStore();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<MyCoupons | null>(null);
  const [error, setError] = useState("");

  const look = async () => {
    const e = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) {
      setError("Enter a valid email address.");
      return;
    }
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const r = await fetchMyCoupons(e);
      if (!r.ok) throw new Error();
      setResult(r);
    } catch {
      setError("Couldn't check right now — please try again in a moment.");
    } finally {
      setBusy(false);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text).then(
      () => toast(`${text} copied`),
      () => toast("Long-press to copy")
    );
  };

  return (
    <section className="grain min-h-[70vh]">
      <div className="container-nc py-14">
        <div className="text-center">
          <p className="eyebrow">Rewards</p>
          <h1 className="mt-3 font-display text-3xl text-moss-900 sm:text-5xl">
            My Coupons
          </h1>
          <LeafDivider />
          <p className="mx-auto max-w-md font-body text-[15px] font-light leading-relaxed text-moss-800/80">
            Coupons are linked to your email. Enter the email you order with to
            see every discount waiting for you.
          </p>
        </div>

        <div className="mx-auto mt-6 flex max-w-md gap-3">
          <input
            className="field-input"
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && look()}
            aria-label="Your email"
          />
          <button className="btn-gold shrink-0 !px-6" onClick={look} disabled={busy}>
            {busy ? "…" : "Show"}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-center font-body text-[13px] text-red-700">{error}</p>
        )}

        {result && (
          <div className="mx-auto mt-10 max-w-2xl space-y-6">
            {result.coupons.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {result.coupons.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => copy(c.code)}
                    className="group rounded-2xl border-2 border-dashed border-gold-500/60 bg-gold-500/10 p-5 text-left transition hover:border-gold-500 hover:bg-gold-500/15"
                  >
                    <p className="font-display text-xl tracking-[0.12em] text-moss-900">
                      {c.code}
                    </p>
                    <p className="mt-1 font-body text-[15px] font-medium text-gold-700">
                      {c.desc}
                    </p>
                    <p className="mt-2 font-body text-[12px] uppercase tracking-wider text-moss-800/60 group-hover:text-moss-800">
                      Tap to copy · use at checkout
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="card p-7 text-center">
                <p className="font-serif text-xl text-moss-900">
                  No unused coupons on this email right now
                </p>
                <p className="mt-2 font-body text-sm font-light text-moss-800/75">
                  Keep an eye on{" "}
                  <a
                    href="https://instagram.com/naturecraftsnc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-700 underline-offset-4 hover:underline"
                  >
                    @naturecraftsnc
                  </a>{" "}
                  — new codes drop there first.
                </p>
              </div>
            )}

            {result.referralDiscount > 0 && (
              <div className="rounded-2xl bg-moss-950 p-7 text-center text-cream-100">
                <p className="eyebrow !text-gold-300">Refer &amp; reward</p>
                {result.referralCode ? (
                  <>
                    <p className="mt-3 font-body text-[15px] font-light text-cream-100/85">
                      Your personal referral code
                    </p>
                    <button
                      onClick={() => copy(result.referralCode)}
                      className="mt-2 rounded-xl border border-gold-500/50 bg-moss-900 px-6 py-3 font-display text-2xl tracking-[0.15em] text-gold-300 transition hover:border-gold-400"
                    >
                      {result.referralCode}
                    </button>
                    <p className="mt-3 font-body text-sm font-light text-cream-100/70">
                      Share it — friends enter it at checkout and get{" "}
                      <span className="font-medium text-gold-300">
                        ₹{result.referralDiscount} off
                      </span>
                      . Tap the code to copy.
                    </p>
                  </>
                ) : (
                  <p className="mt-3 font-body text-[15px] font-light leading-relaxed text-cream-100/85">
                    Place your first order to unlock your personal referral
                    code — friends who use it get{" "}
                    <span className="font-medium text-gold-300">
                      ₹{result.referralDiscount} off
                    </span>
                    .
                  </p>
                )}
                {result.canRedeemReferral && (
                  <p className="mt-4 border-t border-cream-100/10 pt-4 font-body text-sm font-light text-cream-100/70">
                    Got a friend's code? Enter it at checkout — you get ₹
                    {result.referralDiscount} off your order.
                  </p>
                )}
              </div>
            )}

            <div className="text-center">
              <Link to="/shop" className="btn-gold">
                Use a coupon — shop now
              </Link>
            </div>
          </div>
        )}

        {!result && settings.firstOrderPct > 0 && (
          <p className="mx-auto mt-10 max-w-md text-center font-serif text-lg italic text-moss-800/75">
            Psst — every first order gets {settings.firstOrderPct}% off with
            code <span className="not-italic font-semibold text-gold-700">FIRST10</span>.
          </p>
        )}
      </div>
    </section>
  );
}
