import { Link } from "react-router-dom";
import { LeafDivider } from "../components/Leaf";
import { CONFIG } from "../config";

export default function About() {
  return (
    <section className="grain min-h-[70vh]">
      <div className="container-nc max-w-3xl py-16">
        <div className="text-center">
          <p className="eyebrow">Our story</p>
          <h1 className="mt-3 font-display text-3xl text-moss-900 sm:text-5xl">
            {CONFIG.BRAND}
          </h1>
          <p className="mt-3 font-serif text-2xl italic text-gold-700">
            {CONFIG.TAGLINE}
          </p>
          <LeafDivider />
        </div>
        <div className="mt-6 space-y-5 font-body text-[16px] font-light leading-relaxed text-moss-800">
          <p>
            NatureCrafts began with a simple frustration: soap had become a
            factory product — hardened detergents in plastic, printed to look
            natural. We wanted the real thing. So we went back to the slow way:
            cold-pressed oils, botanicals from the garden, and patience.
          </p>
          <p>
            Every bar we sell is made in a small batch, cured on wooden racks
            for weeks, then cut, stamped and wrapped by hand in paper and
            twine. No two bars are perfectly identical — that&rsquo;s the
            point.
          </p>
          <p>
            We keep ordering just as honest. Choose your bars, tell us where to
            deliver, and pay only when the parcel is in your hands — by UPI or
            cash. Your e-bill lands in your inbox the moment you order.
          </p>
        </div>
        <div className="mt-10 text-center">
          <Link to="/shop" className="btn-gold">Shop the collection</Link>
        </div>
      </div>
    </section>
  );
}
