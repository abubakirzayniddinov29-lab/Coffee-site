import { useRef } from 'react';
import { SIGNATURE } from '../../config/brand';
import { gsap, trackProgress, useGSAP } from '../../lib/scroll';
import { store } from '../../lib/store';
import { useOrder } from '../../lib/order-context';
import { Button } from '../ui/Button';

const POS = [
  'left-5 top-[24%] sm:left-[8%] sm:top-[26%]',
  'right-5 top-[24%] text-right sm:right-[8%] sm:top-[30%]',
  'left-5 bottom-[22%] sm:left-[10%] sm:bottom-[26%]',
  'right-5 bottom-[22%] text-right sm:right-[10%] sm:bottom-[24%]',
];

/** Full-screen pinned scene: product zooms in (poses.ts → sigPin), callouts appear along the scroll. */
export function Signature() {
  const ref = useRef<HTMLElement>(null);
  const { openOrder } = useOrder();

  useGSAP(
    () => {
      trackProgress('sigIn', { trigger: ref.current, start: 'top bottom', end: 'top top' });
      store.progress.sigPin = 0;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          pin: true,
          start: 'top top',
          end: '+=220%',
          scrub: 1,
          onUpdate: (s) => (store.progress.sigPin = s.progress),
          onRefresh: (s) => (store.progress.sigPin = s.progress),
        },
      });
      tl.from('.sig-title > *', { y: 60, opacity: 0, stagger: 0.1, duration: 1 })
        .to('.sig-title', { opacity: 0.15, scale: 0.9, duration: 1 }, '+=0.3');
      gsap.utils.toArray<HTMLElement>('.sig-callout').forEach((c, i) => {
        tl.from(c, { opacity: 0, y: 30, duration: 0.8 }, i === 0 ? '-=0.6' : '-=0.3')
          .from(c.querySelector('.sig-line'), { scaleX: 0, duration: 0.6 }, '<0.1');
      });
      tl.from('.sig-cta', { opacity: 0, y: 30, duration: 0.8 }).to({}, { duration: 0.6 });
    },
    { scope: ref },
  );

  return (
    <section id="signature" ref={ref} className="relative h-screen overflow-hidden">
      <div className="sig-title pointer-events-none absolute inset-x-0 top-24 text-center sm:top-28">
        <p className="eyebrow justify-center">{SIGNATURE.eyebrow}</p>
        <h2 className="h-display mt-4 text-6xl sm:text-8xl lg:text-9xl">{SIGNATURE.title}</h2>
        <p className="mt-3 font-serif text-xl italic text-caramel">{SIGNATURE.subtitle}</p>
      </div>

      {SIGNATURE.callouts.map((c, i) => (
        <div key={c.k} className={`sig-callout absolute max-w-[42%] sm:max-w-xs ${POS[i]}`}>
          <div className={`sig-line mb-3 h-px w-16 bg-gold ${i % 2 ? 'ml-auto origin-right' : 'origin-left'}`} />
          <div className="text-[10px] uppercase tracking-widest2 text-gold">{c.k}</div>
          <div className="mt-1 font-serif text-xl sm:text-3xl">{c.v}</div>
        </div>
      ))}

      <div className="sig-cta absolute inset-x-0 bottom-10 flex justify-center">
        <Button onClick={() => openOrder('reserve')} arrow>{SIGNATURE.cta}</Button>
      </div>
    </section>
  );
}
