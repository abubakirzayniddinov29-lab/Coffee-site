import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { BRAND } from '../../config/brand';

type Props = {
  /** true when fonts + 3D scene are ready */
  done: boolean;
  /** fired when the curtain starts lifting → start hero intro */
  onReveal: () => void;
  /** fired when the loader is fully gone → unmount */
  onFinish: () => void;
};

/** Full-screen loader: a cup filling with coffee + percentage, then a curtain reveal. */
export function Loader({ done, onReveal, onFinish }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const doneRef = useRef(done);
  doneRef.current = done;

  useEffect(() => {
    let raf = 0;
    let val = 0;
    let exiting = false;
    const start = performance.now();
    const safety = setTimeout(() => (doneRef.current = true), 9000); // never block forever

    const exit = () => {
      exiting = true;
      const tl = gsap.timeline({ onComplete: onFinish });
      tl.to('.loader-inner', { y: -30, opacity: 0, duration: 0.6, ease: 'power3.in' })
        .add(onReveal, '-=0.1')
        .to(root.current, { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, '-=0.15');
    };

    const tick = () => {
      const elapsed = performance.now() - start;
      const target = doneRef.current && elapsed > 900 ? 100 : Math.min(90, elapsed / 22);
      val += (target - val) * 0.07 + (target > val ? 0.12 : 0);
      val = Math.min(val, 100);
      setPct(Math.floor(val));
      if (val >= 99.6 && !exiting) return exit();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fillY = 70 - (pct / 100) * 44; // cup interior spans y=26..70

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-espresso-900"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-label="Yuklanmoqda"
    >
      <div className="loader-inner flex flex-col items-center gap-8">
        <svg viewBox="0 0 120 100" className="h-32 w-40" aria-hidden="true">
          <defs>
            <clipPath id="cup-clip">
              <path d="M24 26 h60 l-6 40 a8 8 0 0 1 -8 6 h-32 a8 8 0 0 1 -8 -6 z" />
            </clipPath>
          </defs>
          <g fill="none" stroke="#F5EBDD" strokeWidth="1.5" strokeLinecap="round" opacity=".55">
            <path className="steam-line" d="M44 20 q-5 -6 0 -12" style={{ animationDelay: '0s' }} />
            <path className="steam-line" d="M54 20 q-5 -6 0 -12" style={{ animationDelay: '.6s' }} />
            <path className="steam-line" d="M64 20 q-5 -6 0 -12" style={{ animationDelay: '1.2s' }} />
          </g>
          <g clipPath="url(#cup-clip)">
            <rect x="0" y={fillY} width="120" height="100" fill="#C68B59" />
            <rect x="0" y={fillY} width="120" height="3" fill="#D4A24C" />
          </g>
          <path
            d="M24 26 h60 l-6 40 a8 8 0 0 1 -8 6 h-32 a8 8 0 0 1 -8 -6 z M84 34 h6 a8 8 0 0 1 0 16 h-8"
            fill="none"
            stroke="#F5EBDD"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M14 80 h80" stroke="#F5EBDD" strokeOpacity=".4" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div className="text-center">
          <div className="font-serif text-6xl font-medium tabular-nums text-cream">
            {pct}
            <span className="text-gold">%</span>
          </div>
          <div className="mt-3 text-[11px] uppercase tracking-widest2 text-cream/50">{BRAND.name}</div>
        </div>
      </div>
    </div>
  );
}
