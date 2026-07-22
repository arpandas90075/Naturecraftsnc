import { useState } from "react";
import { Link } from "react-router-dom";
import { LeafDivider } from "../components/Leaf";
import { ProductCard, ProductModal } from "../components/ProductBits";
import { CONFIG } from "../config";
import { useStore } from "../store";
import type { Product } from "../types";

// Brand video lives in /public and is deliberately kept OUT of the public
// GitHub repo (.gitignore). If the files are absent (e.g. someone cloned the
// repo), the hero gracefully shows the deep moss background instead.
const heroVideo = import.meta.env.BASE_URL + "hero.mp4";
const heroPoster = import.meta.env.BASE_URL + "hero-poster.jpg";

const CRAFT = [
  {
    title: "Poured by hand",
    text: "Every batch begins with cold-pressed oils and botanicals, blended in small pots — never on a production line.",
  },
  {
    title: "Cured for weeks",
    text: "Bars rest and harden naturally for 3–4 weeks, so they lather richly and last far longer in your bath.",
  },
  {
    title: "Wrapped in nature",
    text: "Paper, twine and a stamped leaf. No plastic touches your soap between our hands and yours.",
  },
];

export default function Home() {
  const { products, loading } = useStore();
  const [open, setOpen] = useState<Product | null>(null);
  const featured = products.slice(0, 3);

  return (
    <>
      {/* ————— HERO: the brand film runs full-bleed and dissolves into the page ————— */}
      <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-moss-950">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={heroVideo}
          poster={heroPoster}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        {/* moss veil + fade so the film feels native to the page */}
        <div className="absolute inset-0 bg-moss-950/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-moss-950/60 via-transparent to-moss-950" />

        <div className="container-nc relative z-10 pb-20 pt-40 sm:pb-24">
          <p className="anim-rise eyebrow !text-gold-300">
            Handmade soap · small batches
          </p>
          <h1 className="anim-rise anim-rise-1 mt-4 max-w-3xl font-display text-4xl leading-tight text-cream-50 sm:text-6xl">
            Soap the way the forest would make it
          </h1>
          <p className="anim-rise anim-rise-2 mt-5 max-w-xl font-serif text-xl italic text-cream-100/90 sm:text-2xl">
            {CONFIG.TAGLINE} — botanical bars poured, cured and wrapped by hand.
          </p>
          <div className="anim-rise anim-rise-3 mt-9 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-gold">
              Shop the collection
            </Link>
            <Link to="/track" className="btn-outline-light">
              Track your order
            </Link>
          </div>
        </div>
      </section>

      {/* ————— FEATURED ————— */}
      <section className="grain">
        <div className="container-nc py-20">
          <div className="text-center">
            <p className="eyebrow">From the workshop</p>
            <h2 className="mt-3 font-display text-3xl text-moss-900 sm:text-4xl">
              This Week&rsquo;s Batch
            </h2>
            <LeafDivider />
          </div>

          {loading ? (
            <GridSkeleton />
          ) : (
            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p) => (
                <ProductCard key={p.id} p={p} onOpen={setOpen} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/shop" className="btn-outline">
              See every bar →
            </Link>
          </div>
        </div>
      </section>

      {/* ————— CRAFT STRIP ————— */}
      <section className="bg-moss-950 text-cream-100">
        <div className="container-nc py-20">
          <div className="text-center">
            <p className="eyebrow !text-gold-300">Why handmade</p>
            <h2 className="mt-3 font-display text-3xl text-cream-50 sm:text-4xl">
              Slow Soap, On Purpose
            </h2>
            <LeafDivider light />
          </div>
          <div className="mt-12 grid gap-10 sm:grid-cols-3">
            {CRAFT.map((c) => (
              <div key={c.title} className="text-center">
                <h3 className="font-serif text-2xl font-semibold text-gold-300">
                  {c.title}
                </h3>
                <p className="mt-3 font-body text-[15px] font-light leading-relaxed text-cream-100/75">
                  {c.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-gold-500/25 bg-moss-900/60 p-7 text-center sm:p-9">
            <p className="font-serif text-xl italic text-cream-100/90 sm:text-2xl">
              Pay only when your soap reaches your door —{" "}
              <span className="text-gold-300">UPI or cash on arrival.</span>
            </p>
            <p className="mt-2 font-body text-sm font-light text-cream-100/60">
              Every order is confirmed by email with your e-bill and expected
              delivery date.
            </p>
          </div>
        </div>
      </section>

      <ProductModal product={open} onClose={() => setOpen(null)} />
    </>
  );
}

export function GridSkeleton({ n = 3 }: { n?: number }) {
  return (
    <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="aspect-[4/3] animate-pulse bg-moss-100" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-2/3 animate-pulse rounded bg-moss-100" />
            <div className="h-4 w-full animate-pulse rounded bg-moss-100/70" />
            <div className="h-10 w-full animate-pulse rounded-full bg-moss-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
