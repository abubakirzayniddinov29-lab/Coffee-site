import type { DrinkArt as Art } from '../../config/brand';

/** Lightweight SVG drink illustrations (swap for WebP photos if you have them). */
export function DrinkArt({ art }: { art: Art }) {
  const cream = '#F5EBDD';
  const coffee = '#5a3420';
  const caramel = '#C68B59';
  const gold = '#D4A24C';
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <ellipse cx="100" cy="172" rx="62" ry="9" fill="#2B1B12" opacity=".18" />
      {art === 'espresso' && (
        <g>
          <ellipse cx="100" cy="160" rx="58" ry="10" fill={cream} />
          <path d="M66 110 L72 150 Q100 162 128 150 L134 110 Z" fill={cream} />
          <path d="M134 120 q22 0 18 16 q-4 10 -20 10" fill="none" stroke={cream} strokeWidth="7" />
          <ellipse cx="100" cy="110" rx="34" ry="7" fill={gold} />
          <ellipse cx="100" cy="111" rx="31" ry="5.5" fill={caramel} />
        </g>
      )}
      {art === 'latte' && (
        <g>
          <path d="M70 60 L78 162 Q100 170 122 162 L130 60 Z" fill="#fff" opacity=".35" />
          <path d="M73 100 L78 162 Q100 170 122 162 L127 100 Z" fill={caramel} />
          <path d="M71 78 L73 100 L127 100 L129 78 Z" fill={cream} />
          <ellipse cx="100" cy="64" rx="30" ry="5" fill="#fff" opacity=".5" />
        </g>
      )}
      {art === 'cappuccino' && (
        <g>
          <ellipse cx="100" cy="162" rx="66" ry="11" fill={cream} />
          <path d="M56 96 L66 146 Q100 162 134 146 L144 96 Z" fill={cream} />
          <path d="M144 106 q26 0 22 20 q-4 14 -26 14" fill="none" stroke={cream} strokeWidth="8" />
          <ellipse cx="100" cy="96" rx="44" ry="9" fill={caramel} />
          <ellipse cx="100" cy="94" rx="34" ry="6" fill={cream} />
          <circle cx="92" cy="93" r="2" fill={caramel} /><circle cx="106" cy="95" r="1.6" fill={caramel} />
        </g>
      )}
      {art === 'flatwhite' && (
        <g>
          <ellipse cx="100" cy="162" rx="64" ry="11" fill={cream} />
          <path d="M60 100 L68 148 Q100 162 132 148 L140 100 Z" fill={cream} />
          <ellipse cx="100" cy="100" rx="40" ry="9" fill={gold} />
          <ellipse cx="100" cy="101" rx="37" ry="7.5" fill={coffee} />
          <path d="M100 106 c-14 -8 -12 -14 0 -8 c12 -6 14 0 0 8z" fill={cream} />
        </g>
      )}
      {art === 'coldbrew' && (
        <g>
          <path d="M68 50 L76 164 Q100 170 124 164 L132 50 Z" fill="#fff" opacity=".3" />
          <path d="M70 76 L76 164 Q100 170 124 164 L130 76 Z" fill={coffee} />
          <rect x="82" y="84" width="16" height="16" rx="3" fill="#fff" opacity=".45" transform="rotate(12 90 92)" />
          <rect x="102" y="96" width="15" height="15" rx="3" fill="#fff" opacity=".35" transform="rotate(-10 110 104)" />
          <rect x="108" y="30" width="5" height="90" rx="2" fill={gold} transform="rotate(10 110 75)" />
        </g>
      )}
      {art === 'dessert' && (
        <g>
          <ellipse cx="100" cy="162" rx="70" ry="10" fill={cream} />
          <path d="M50 150 L150 150 L150 100 L50 120 Z" fill={cream} />
          <path d="M50 120 L150 100 L150 112 L50 132 Z" fill={caramel} />
          <path d="M50 136 L150 118 L150 128 L50 146 Z" fill={coffee} opacity=".8" />
          <path d="M50 120 L150 100 L140 94 L46 116 Z" fill={coffee} />
        </g>
      )}
    </svg>
  );
}
