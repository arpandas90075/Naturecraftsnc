import { useEffect, useState } from "react";
import { fmtMoney } from "../lib/api";
import { useStore } from "../store";
import type { Product } from "../types";
import { SoapArt } from "./SoapArt";

export function ProductImage({ p, className = "" }: { p: Product; className?: string }) {
  const [broken, setBroken] = useState(false);
  if (p.image && !broken) {
    return (
      <img
        src={p.image}
        alt={p.name}
        loading="lazy"
        onError={() => setBroken(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  return <SoapArt seed={p.id + p.name} name={p.name} />;
}

export function ProductCard({ p, onOpen }: { p: Product; onOpen: (p: Product) => void }) {
  const { cart, addToCart, setQty } = useStore();
  const inCart = cart.find((i) => i.product.id === p.id)?.qty ?? 0;
  return (
    <article className="card group overflow-hidden">
      <button
        onClick={() => onOpen(p)}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-moss-100 text-left"
        aria-label={`View ${p.name}`}
      >
        <div className="h-full w-full transition duration-500 group-hover:scale-[1.04]">
          <ProductImage p={p} />
        </div>
        {p.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-cream-50/95 px-3 py-1 font-body text-[11px] font-medium uppercase tracking-[0.16em] text-moss-800">
            {p.tag}
          </span>
        )}
        {inCart > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-gold-500 px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-moss-950">
            {inCart} in cart
          </span>
        )}
      </button>
      <div className="flex flex-col gap-2.5 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-xl font-semibold leading-snug text-moss-900">
            {p.name}
          </h3>
          <span className="whitespace-nowrap font-body text-[15px] font-semibold text-gold-700">
            {fmtMoney(p.price)}
          </span>
        </div>
        <p className="line-clamp-2 font-body text-sm font-light leading-relaxed text-moss-800/80">
          {p.description}
        </p>
        <div className="mt-1.5 flex items-center gap-2.5">
          {inCart === 0 ? (
            <button className="btn-gold flex-1 !py-2.5" onClick={() => addToCart(p)}>
              Add to cart
            </button>
          ) : (
            <div className="flex flex-1 items-center justify-between rounded-full bg-gold-500 px-2 py-1">
              <button
                className="flex h-8 w-9 items-center justify-center rounded-full text-lg font-medium text-moss-950 transition hover:bg-gold-400"
                onClick={() => setQty(p.id, inCart - 1)}
                aria-label={`Remove one ${p.name}`}
              >
                −
              </button>
              <span className="font-body text-sm font-semibold text-moss-950" aria-live="polite">
                {inCart} in cart
              </span>
              <button
                className="flex h-8 w-9 items-center justify-center rounded-full text-lg font-medium text-moss-950 transition hover:bg-gold-400"
                onClick={() => setQty(p.id, inCart + 1)}
                aria-label={`Add one more ${p.name}`}
              >
                +
              </button>
            </div>
          )}
          <button
            className="btn-outline !px-5 !py-2.5"
            onClick={() => onOpen(p)}
            aria-label={`Details of ${p.name}`}
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { addToCart } = useStore();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    setQty(1);
    setImgIdx(0);
    if (!product) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  if (!product) return null;

  const gallery = product.images.length > 0 ? product.images : [""];
  const current = gallery[Math.min(imgIdx, gallery.length - 1)];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-moss-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div
        className="anim-rise w-full max-w-2xl overflow-hidden rounded-t-3xl bg-cream-50 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid sm:grid-cols-2">
          <div className="flex flex-col">
            <div className="relative aspect-[4/3] flex-1 bg-moss-100 sm:min-h-[300px]">
              <ProductImage
                key={current || product.id}
                p={{ ...product, image: current }}
              />
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto bg-moss-100/60 p-2.5">
                {gallery.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    aria-label={`Photo ${i + 1} of ${product.name}`}
                    className={`h-14 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      i === imgIdx
                        ? "border-gold-500"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <ProductImage p={{ ...product, image: url }} />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-3 p-6 sm:p-7">
            {product.tag && <span className="eyebrow">{product.tag}</span>}
            <h2 className="font-serif text-3xl font-semibold text-moss-900">
              {product.name}
            </h2>
            <p className="font-body text-[15px] font-light leading-relaxed text-moss-800/85">
              {product.description}
            </p>
            <p className="font-body text-2xl font-semibold text-gold-700">
              {fmtMoney(product.price)}
            </p>

            <div className="mt-1 flex items-center gap-3">
              <div className="flex items-center rounded-full border border-moss-900/20">
                <button
                  className="h-10 w-10 text-lg text-moss-800 transition hover:text-gold-700"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center font-body text-[15px] font-medium" aria-live="polite">
                  {qty}
                </span>
                <button
                  className="h-10 w-10 text-lg text-moss-800 transition hover:text-gold-700"
                  onClick={() => setQty((q) => Math.min(99, q + 1))}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                className="btn-gold flex-1"
                onClick={() => {
                  addToCart(product, qty);
                  onClose();
                }}
              >
                Add {qty > 1 ? `${qty} ` : ""}to cart · {fmtMoney(product.price * qty)}
              </button>
            </div>

            <button
              className="mt-1 self-start font-body text-sm text-moss-800/70 underline-offset-4 hover:underline"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
