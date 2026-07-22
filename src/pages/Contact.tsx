import { LeafDivider } from "../components/Leaf";
import { CONFIG } from "../config";

const INSTA_HANDLE = "naturecraftsnc";

function InstagramIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.4" />
      <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

function MailIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  );
}

export default function Contact() {
  return (
    <section className="grain min-h-[70vh]">
      <div className="container-nc max-w-3xl py-16">
        <div className="text-center">
          <p className="eyebrow">Say hello</p>
          <h1 className="mt-3 font-display text-3xl text-moss-900 sm:text-5xl">
            Contact Us
          </h1>
          <LeafDivider />
          <p className="mx-auto max-w-md font-body text-[15px] font-light leading-relaxed text-moss-800/80">
            A question about an order, a custom batch, or just soap talk — we
            read everything and reply as soon as our hands are dry.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {/* Email */}
          <a
            href={`mailto:${CONFIG.ORDER_EMAIL}`}
            className="card group flex flex-col items-center gap-4 p-8 text-center transition hover:-translate-y-1 hover:shadow-soap"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-moss-950 text-gold-400 transition group-hover:bg-moss-900">
              <MailIcon />
            </span>
            <div>
              <h2 className="font-display text-lg tracking-wide text-moss-900">
                Email
              </h2>
              <p className="mt-1.5 break-all font-body text-[15px] text-gold-700 underline-offset-4 group-hover:underline">
                {CONFIG.ORDER_EMAIL}
              </p>
              <p className="mt-2 font-body text-[13px] font-light text-moss-800/70">
                Orders, e-bills and delivery queries
              </p>
            </div>
          </a>

          {/* Instagram */}
          <a
            href={`https://instagram.com/${INSTA_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card group flex flex-col items-center gap-4 p-8 text-center transition hover:-translate-y-1 hover:shadow-soap"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-moss-950 text-gold-400 transition group-hover:bg-moss-900">
              <InstagramIcon />
            </span>
            <div>
              <h2 className="font-display text-lg tracking-wide text-moss-900">
                Instagram
              </h2>
              <p className="mt-1.5 font-body text-[15px] text-gold-700 underline-offset-4 group-hover:underline">
                @{INSTA_HANDLE}
              </p>
              <p className="mt-2 font-body text-[13px] font-light text-moss-800/70">
                New batches, behind the scenes, restock alerts
              </p>
            </div>
          </a>
        </div>

        <p className="mt-10 text-center font-serif text-lg italic text-moss-800/75">
          {CONFIG.TAGLINE} — and devoted to replying, too.
        </p>
      </div>
    </section>
  );
}
