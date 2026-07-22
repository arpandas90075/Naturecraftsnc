/** Illustrated placeholder shown when a product has no image URL yet.
    Hue shifts per product so the grid still feels varied. */
const PALETTES = [
  { a: "#8B9D7A", b: "#3D4A2F", soap: "#F7F1E1" }, // sage
  { a: "#4A4A48", b: "#26301C", soap: "#DAD6CE" }, // charcoal
  { a: "#C98A8A", b: "#7A4444", soap: "#F6E4DC" }, // rose clay
  { a: "#7FA35C", b: "#3E5A28", soap: "#EDF0DC" }, // neem
  { a: "#C9B44B", b: "#7A6A24", soap: "#F7F3DA" }, // lemongrass
  { a: "#B9A98F", b: "#5A3E24", soap: "#FBF7EC" }, // coconut / wood
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function SoapArt({ seed, name }: { seed: string; name: string }) {
  const p = PALETTES[hash(seed) % PALETTES.length];
  const gid = `g-${hash(seed)}`;
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label={name}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.a} />
          <stop offset="100%" stopColor={p.b} />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill={`url(#${gid})`} />
      {/* soft botanical strokes */}
      <g stroke="#FBFAF0" strokeWidth="1.4" opacity="0.28" fill="none" strokeLinecap="round">
        <path d="M40 250c30-60 24-120 8-170M48 220c14-6 24-16 28-32M44 180c-12-4-20-12-24-26" />
        <path d="M360 260c-26-70-20-130-4-186M352 224c-14-6-22-16-26-32M356 184c12-4 20-12 24-26" />
      </g>
      {/* the soap bar */}
      <g>
        <rect x="118" y="102" width="164" height="104" rx="18" fill={p.soap} />
        <rect x="118" y="102" width="164" height="104" rx="18" fill="none" stroke="#161D0F" opacity="0.08" />
        {/* twine wrap */}
        <path d="M196 102v104M206 102v104" stroke="#5A3E24" strokeWidth="3" opacity="0.55" />
        <circle cx="201" cy="128" r="7" fill="none" stroke="#5A3E24" strokeWidth="2.4" opacity="0.6" />
        {/* stamped leaf */}
        <path
          d="M156 154c0-14 8-24 18-30 4 10 4 22-2 32-4 7-10 10-16 10 0-4 0-8 0-12Z"
          fill={p.a}
          opacity="0.5"
        />
        <text
          x="246"
          y="160"
          textAnchor="middle"
          fontFamily="Cinzel, serif"
          fontSize="15"
          letterSpacing="2"
          fill="#5A4A2A"
          opacity="0.75"
        >
          NC
        </text>
      </g>
    </svg>
  );
}
