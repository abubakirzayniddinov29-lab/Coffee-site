import { useRef } from 'react';
import { STORY } from '../../config/brand';
import { gsap, trackProgress, useGSAP } from '../../lib/scroll';

/** Cup rotates 180° and slides left (poses.ts → "story"); text enters from the right. */
export function Story() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      trackProgress('story', { trigger: ref.current, start: 'top bottom', end: 'center center' });
      gsap.from('.story-item', {
        x: 120,
        opacity: 0,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%', end: 'center 55%', scrub: 1 },
      });
    },
    { scope: ref },
  );

  return (
    <section id="about" ref={ref} className="relative flex min-h-screen items-end py-24 md:items-center md:py-32">
      <div className="container-x grid gap-10 md:grid-cols-2">
        <div className="hidden md:block" />
        <div className="pt-[42vh] md:pt-0">
          <p className="story-item eyebrow">{STORY.eyebrow}</p>
          <h2 className="story-item h-display mt-6 text-5xl sm:text-6xl lg:text-7xl">{STORY.title}</h2>
          {STORY.paragraphs.map((p, i) => (
            <p key={i} className="story-item mt-6 max-w-lg leading-relaxed text-cream/70">{p}</p>
          ))}
          <div className="story-item mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-cream/15 pt-8">
            {STORY.stats.map((s) => (
              <div key={s.label}>
                <div className="font-serif text-5xl text-gold">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-cream/50">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
