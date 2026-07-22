import { useState } from "react";
import { LeafDivider } from "../components/Leaf";
import { ProductCard, ProductModal } from "../components/ProductBits";
import { useStore } from "../store";
import type { Product } from "../types";
import { GridSkeleton } from "./Home";

export default function Shop() {
  const { products, loading, loadError, reload } = useStore();
  const [open, setOpen] = useState<Product | null>(null);

  return (
    <section className="grain min-h-[70vh]">
      <div className="container-nc py-14 sm:py-16">
        <div className="text-center">
          <p className="eyebrow">The collection</p>
          <h1 className="mt-3 font-display text-3xl text-moss-900 sm:text-5xl">
            Every Bar We Make
          </h1>
          <LeafDivider />
          <p className="mx-auto max-w-xl font-body text-[15px] font-light text-moss-800/80">
            Cold-processed, cured for weeks, wrapped by hand. Pay by UPI or
            cash when your order arrives.
          </p>
        </div>

        {loading && <GridSkeleton n={6} />}

        {!loading && loadError && (
          <div className="mx-auto mt-12 max-w-md rounded-2xl border border-moss-900/10 bg-white p-8 text-center shadow-lift">
            <p className="font-body text-[15px] text-moss-800">{loadError}</p>
            <button className="btn-gold mt-5" onClick={reload}>
              Try again
            </button>
          </div>
        )}

        {!loading && !loadError && products.length === 0 && (
          <div className="mx-auto mt-12 max-w-md rounded-2xl border border-moss-900/10 bg-white p-8 text-center shadow-lift">
            <p className="font-serif text-xl text-moss-900">
              The shelf is empty right now
            </p>
            <p className="mt-2 font-body text-sm font-light text-moss-800/75">
              New batches are curing. Check back soon.
            </p>
          </div>
        )}

        {!loading && !loadError && products.length > 0 && (
          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} onOpen={setOpen} />
            ))}
          </div>
        )}
      </div>
      <ProductModal product={open} onClose={() => setOpen(null)} />
    </section>
  );
}
