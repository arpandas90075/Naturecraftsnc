/** Gold leaf-sprig divider — echoes the leaf motif in the brand video */
export function LeafDivider({ light = false }: { light?: boolean }) {
  const stroke = light ? "#E4C588" : "#A87E2F";
  return (
    <div className="flex items-center justify-center gap-3 py-1" aria-hidden="true">
      <span className="h-px w-14 sm:w-24" style={{ background: `linear-gradient(to left, ${stroke}, transparent)` }} />
      <svg width="46" height="20" viewBox="0 0 46 20" fill="none">
        <path d="M2 10h42" stroke={stroke} strokeWidth="0.8" opacity="0.5" />
        <path
          d="M23 16c-4-1.5-6-4-6-8 0-2 .8-4 2.4-5.6C21 4 22 6.6 22 9.4c0 2.8-.4 5-1 6.6M23 16c4-1.5 6-4 6-8 0-2-.8-4-2.4-5.6C25 4 24 6.6 24 9.4c0 2.8.4 5 1 6.6"
          stroke={stroke}
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="23" cy="17" r="1.2" fill={stroke} />
      </svg>
      <span className="h-px w-14 sm:w-24" style={{ background: `linear-gradient(to right, ${stroke}, transparent)` }} />
    </div>
  );
}
