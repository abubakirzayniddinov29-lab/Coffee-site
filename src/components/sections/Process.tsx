import { useRef, useState } from 'react';
import { PROCESS } from '../../config/brand';
import { gsap, trackProgress, useGSAP } from '../../lib/scroll';
import { store } from '../../lib/store';

/** Horizontal pinned scroll — the 3D object swaps per step (see Scene → VariantSlot). */
export function Process() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useGSAP(
    () => {
      const el = ref.current!;
      const track = trackRef.current!;
      trackProgress('processIn', { trigger: el, start: 'top bottom', end: 'top top' });

      const dist = () => track.scrollWidth - window.innerWidth;
      store.progress.processPin = 0;
      const tween = gsap.to(track, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          pin: true,
          start: 'top top',
          end: () => `+=${dist()}`,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (s) => {
            store.progress.processPin = s.progress;
            gsap.set(bar.current, { scaleX: s.progress });
            setStep(Math.round(s.progress * 3));
          },
          onRefresh: (s) => (store.progress.processPin = s.progress),
        },
      });

      gsap.utils.toArray<HTMLElement>('.process-panel').forEach((panel, i) => {
        if (i === 0) return;
        gsap.from(panel.querySelectorAll('.p-anim'), {
          y: 60,
          opacity: 0,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: panel, containerAnimation: tween, start: 'left 75%', end: 'left 35%', scrub: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section id="process" ref={ref} className="relative h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-24 z-10 sm:top-28">
        <div className="container-x"><p className="eyebrow">Jarayon — Bean → Roast → Grind → Brew</p></div>
      </div>

      <div ref={trackRef} className="flex h-full w-max">
        {PROCESS.map((p) => (
          <div key={p.n} className="process-panel flex h-full w-screen items-start md:items-center">
            <div className="container-x pt-40 md:pt-0">
              <div className="max-w-lg">
                <div className="p-anim outline-text font-serif text-[7rem] leading-none text-gold/70 sm:text-[10rem]">{p.n}</div>
                <h3 className="p-anim h-display -mt-4 text-6xl sm:text-7xl">
                  {p.title} <span className="text-3xl italic text-caramel sm:text-4xl">/ {p.en}</span>
                </h3>
                <p className="p-anim mt-6 leading-relaxed text-cream/70">{p.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* progress line */}
      <div className="absolute inset-x-0 bottom-10 z-10">
        <div className="container-x">
          <div className="relative h-px w-full bg-cream/15">
            <div ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-gold" />
          </div>
          <div className="mt-4 grid grid-cols-4 text-[11px] uppercase tracking-widest">
            {PROCESS.map((p, i) => (
              <div key={p.n} className={`flex items-center gap-2 transition-colors duration-500 ${i <= step ? 'text-gold' : 'text-cream/40'}`}>
                <span className={`h-2 w-2 rounded-full border border-current transition-colors ${i <= step ? 'bg-gold' : ''}`} />
                <span className="hidden sm:inline">{p.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
