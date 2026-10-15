import { useRef } from 'react';
import { HERO } from '../../config/brand';
import { gsap, useGSAP } from '../../lib/scroll';
import { store } from '../../lib/store';
import { useOrder } from '../../lib/order-context';
import { Button } from '../ui/Button';

function SplitChars({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden whitespace-nowrap pb-[0.12em] -mb-[0.12em] align-bottom" aria-hidden="true">
          {[...w].map((c, j) => (
            <span key={j} className="hero-char">{c}</span>
          ))}
          {i < words.length - 1 && <span className="hero-char">&nbsp;</span>}
        </span>
      ))}
    </>
  );
}

export function Hero({ ready, fallback }: { ready: boolean; fallback: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { openOrder } = useOrder();

  useGSAP(
    () => {
      if (!ready) return;
      if (store.reducedMotion) {
        gsap.set('.hero-char, .hero-fade', { opacity: 1 });
        store.intro = 1;
        return;
      }
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.to(store, { intro: 1, duration: 2.4, ease: 'power3.out' }, 0)
        .fromTo('.hero-char', { yPercent: 115, opacity: 0, rotate: 8 }, { yPercent: 0, opacity: 1, rotate: 0, duration: 1.2, stagger: 0.035 }, 0.15)
        .fromTo('.hero-fade', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.12 }, 0.8);

      gsap.to('.hero-content', {
        yPercent: -25,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      });
    },
    { scope: ref, dependencies: [ready] },
  );

  return (
    <section id="home" ref={ref} className="relative flex min-h-[100svh] flex-col overflow-hidden">
      <div className="hero-content container-x flex flex-1 flex-col justify-between pb-10 pt-32 sm:pt-36">
        <div className="text-center">
          <p className="hero-fade eyebrow justify-center">{HERO.eyebrow}</p>
          <h1 className="h-display mt-6 text-[13vw] sm:text-[9vw] lg:text-[8.2rem]" aria-label={`${HERO.line1} ${HERO.line2}`}>
            <span className="block"><SplitChars text={HERO.line1} /></span>
            <span className="block italic text-gold"><SplitChars text={HERO.line2} /></span>
          </h1>
        </div>

        {fallback && (
          <img src="/fallback-cup.svg" alt="Qahva finjoni" width={600} height={600} className="mx-auto my-4 h-[34vh] w-auto" />
        )}

        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-end">
          <p className="hero-fade max-w-sm text-center text-sm leading-relaxed text-cream/70 md:text-left">{HERO.subtitle}</p>
          <div className="hero-fade flex flex-wrap justify-center gap-3">
            <Button onClick={() => openOrder()} arrow cursorLabel="Buyurtma">{HERO.ctaPrimary}</Button>
            <Button variant="ghost" href="#menu">{HERO.ctaSecondary}</Button>
          </div>
        </div>
      </div>
      <div className="hero-fade pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-widest2 text-cream/40 lg:flex">
        Pastga
        <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}
