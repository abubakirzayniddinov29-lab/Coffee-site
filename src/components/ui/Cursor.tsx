import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { store } from '../../lib/store';

const INTERACTIVE = 'a, button, [data-cursor], input, select, textarea, label, [role="button"]';

/** Dot + trailing ring cursor. Ring grows (and can show a label) over interactive elements. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches && !store.reducedMotion,
  );

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    const html = document.documentElement;
    html.classList.add('has-cursor');
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3' });
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3' });
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' });
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' });
    let visible = false;

    const move = (e: PointerEvent) => {
      if (!visible) {
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });
        visible = true;
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = (e.target as Element)?.closest?.(INTERACTIVE) as HTMLElement | null;
      const text = t?.dataset.cursor ?? '';
      if (label.current) label.current.textContent = text;
      gsap.to(ring.current, {
        scale: t ? (text ? 2.6 : 1.9) : 1,
        backgroundColor: t ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0)',
        duration: 0.45,
        ease: 'expo.out',
      });
      gsap.to(dot.current, { scale: t ? 0 : 1, duration: 0.3 });
    };
    const down = () => gsap.to(ring.current, { scale: '-=0.25', duration: 0.15 });
    const up = (e: PointerEvent) => over(e);
    const leave = () => {
      gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 });
      visible = false;
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      html.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[100] flex h-10 w-10 items-center justify-center rounded-full border border-white/70 mix-blend-difference"
      >
        <span ref={label} className="text-[5px] font-medium uppercase tracking-[0.2em] text-white" />
      </div>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference" />
    </>
  );
}

export function Grain() {
  return <div className="grain" aria-hidden="true" />;
}
