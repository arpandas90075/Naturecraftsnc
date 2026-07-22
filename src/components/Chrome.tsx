import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { CONFIG } from "../config";
import { useStore } from "../store";
import { LeafDivider } from "./Leaf";

function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="#212B18" />
      <path
        d="M16 6C11 10 8.5 14 8.5 18a7.5 7.5 0 0 0 15 0C23.5 14 21 10 16 6Zm0 17.5c-3 0-5-2-5-5"
        fill="none"
        stroke="#C99A4B"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <LogoMark />
      <span
        className={`font-display text-lg tracking-[0.18em] ${
          light ? "text-cream-50" : "text-moss-900"
        }`}
      >
        NATURE<span className="text-gold-500">CRAFTS</span>
      </span>
    </Link>
  );
}

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/track", label: "Track Order" },
  { to: "/coupons", label: "Coupons" },
  { to: "/about", label: "Our Story" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const { cartCount } = useStore();
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`${
        onHome
          ? "absolute inset-x-0 top-0 z-40 bg-gradient-to-b from-moss-950/70 to-transparent"
          : "sticky top-0 z-40 border-b border-moss-900/10 bg-cream-50/90 backdrop-blur"
      }`}
    >
      <div className="container-nc flex h-16 items-center justify-between sm:h-[72px]">
        <Logo light={onHome} />

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `font-body text-[13px] font-medium uppercase tracking-[0.14em] transition ${
                  onHome
                    ? isActive
                      ? "text-gold-300"
                      : "text-cream-50/85 hover:text-gold-300"
                    : isActive
                    ? "text-gold-700"
                    : "text-moss-800 hover:text-gold-700"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium tracking-wide transition ${
              onHome
                ? "border border-cream-50/35 text-cream-50 hover:border-gold-400 hover:text-gold-300"
                : "border border-moss-900/20 text-moss-900 hover:border-gold-600 hover:text-gold-700"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 7h12l-1.3 11.1a2 2 0 0 1-2 1.9H9.3a2 2 0 0 1-2-1.9L6 7Z" />
              <path d="M9 7V6a3 3 0 0 1 6 0v1" />
            </svg>
            Cart
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[11px] font-semibold text-moss-950">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden ${
              onHome ? "text-cream-50" : "text-moss-900"
            }`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" aria-hidden="true">
              {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          className={`md:hidden ${
            onHome ? "bg-moss-950/95" : "border-t border-moss-900/10 bg-cream-50"
          }`}
          aria-label="Mobile"
        >
          <div className="container-nc flex flex-col py-2">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-3 font-body text-sm font-medium uppercase tracking-[0.14em] ${
                    onHome
                      ? isActive
                        ? "text-gold-300"
                        : "text-cream-50/85"
                      : isActive
                      ? "text-gold-700"
                      : "text-moss-800"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 bg-moss-950 text-cream-100">
      <div className="container-nc py-14">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo light />
          <p className="font-serif text-lg italic text-gold-300">
            {CONFIG.TAGLINE}
          </p>
          <LeafDivider light />
          <p className="max-w-md font-body text-sm font-light leading-relaxed text-cream-100/70">
            Small-batch handmade soaps, poured and cured with botanical
            ingredients. Every bar is cut, stamped and wrapped by hand.
          </p>
          <p className="font-body text-sm text-cream-100/70">
            Orders &amp; queries ·{" "}
            <a
              href={`mailto:${CONFIG.ORDER_EMAIL}`}
              className="text-gold-300 underline-offset-4 hover:underline"
            >
              {CONFIG.ORDER_EMAIL}
            </a>
          </p>
          <a
            href="https://instagram.com/naturecraftsnc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-sm text-gold-300 underline-offset-4 hover:underline"
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
              <circle cx="12" cy="12" r="4.4" />
              <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" stroke="none" />
            </svg>
            @naturecraftsnc
          </a>
          <p className="pt-4 font-body text-xs tracking-wide text-cream-100/40">
            © {new Date().getFullYear()} {CONFIG.BRAND} · Delivering across Delhi · Payment on delivery —
            UPI or cash
          </p>
        </div>
      </div>
    </footer>
  );
}

export function ToastHost() {
  const { toasts } = useStore();
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="anim-toast rounded-full bg-moss-950/95 px-5 py-2.5 font-body text-sm text-cream-50 shadow-soap"
          role="status"
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
