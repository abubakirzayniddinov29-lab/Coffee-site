import { useEffect, useRef, useState } from 'react';
import { TESTIMONIALS } from '../../config/brand';
import { gsap, trackProgress, useGSAP } from '../../lib/scroll';
import { store } from '../../lib/store';

export function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const slide = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const t = TESTIMONIALS[i];

  useGSAP(() => {
    trackProgress('testiIn', { trigger: ref.current, start: 'top bottom', end: 'top center' });
    gsap.from('.testi-head > *', { y: 50, opacity: 0, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: ref.current, start: 'top 70%' } });
  }, { scope: ref });

  // slide transition on change
  useEffect(() => {
    if (!slide.current || store.reducedMotion) return;
    gsap.fromTo(slide.current.children, { x: 80 * dir, opacity: 0, filter: 'blur(6px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.06, ease: 'expo.out' });
  }, [i, dir]);

  // autoplay
  useEffect(() => {
    if (paused || store.reducedMotion) return;
    const id = setTimeout(() => go(1), 6000);
    return () => clearTimeout(id);
  });

  const go = (d: number) => {
    setDir(d);
    setI((v) => (v + d + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  return (
    <section id="testimonials" ref={ref} className="relative py-28 sm:py-40" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="container-x">
        <div className="testi-head text-center">
          <p className="eyebrow justify-center">Mijozlarimiz fikri</p>
          <h2 className="h-display mt-5 text-5xl sm:text-7xl">Ular nima <em className="text-gold">deydi</em></h2>
        </div>

        <div className="mx-auto mt-16 max-w-4xl text-center" aria-live="polite">
          <div ref={slide} key={i} className="min-h-[260px] sm:min-h-[220px]">
            <div className="text-xl tracking-[0.3em] text-gold">★★★★★</div>
            <blockquote className="mt-6 font-serif text-3xl italic leading-snug sm:text-5xl">“{t.text}”</blockquote>
            <div className="mt-8 flex items-center justify-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-caramel font-serif text-lg text-espresso">
                {t.name.split(' ').map((w) => w[0]).join('')}
              </span>
              <div className="text-left">
                <div className="font-medium">{t.name}</div>
                <div className="text-sm text-cream/50">{t.role}</div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6">
            <button onClick={() => go(-1)} aria-label="Oldingi" className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/20 transition hover:-translate-x-1 hover:border-gold hover:text-gold active:scale-90">←</button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, k) => (
                <button key={k} onClick={() => { setDir(k > i ? 1 : -1); setI(k); }} aria-label={`${k + 1}-fikr`} className={`h-1.5 rounded-full transition-all duration-500 ${k === i ? 'w-10 bg-gold' : 'w-4 bg-cream/25 hover:bg-cream/50'}`} />
              ))}
            </div>
            <button onClick={() => go(1)} aria-label="Keyingi" className="flex h-12 w-12 items-center justify-center rounded-full border border-cream/20 transition hover:translate-x-1 hover:border-gold hover:text-gold active:scale-90">→</button>
          </div>
        </div>
      </div>
    </section>
  );
}
