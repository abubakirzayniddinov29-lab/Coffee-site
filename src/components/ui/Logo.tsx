import { BRAND } from '../../config/brand';

/** 🔁 SWAP LOGO: replace this SVG mark (or render an <img src="/logo.svg" />). */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
        <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeOpacity=".35" />
        <g transform="rotate(-25 20 20)">
          <ellipse cx="20" cy="20" rx="8" ry="12" fill="#C68B59" />
          <path d="M17 9.5 C 23 15, 17 25, 23 30.5" stroke="#2B1B12" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      </svg>
      <span className="font-serif text-xl font-semibold tracking-wide">{BRAND.name}</span>
    </span>
  );
}
