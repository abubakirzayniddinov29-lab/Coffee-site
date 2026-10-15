import { useRef, type PointerEvent } from 'react';
import { MENU, formatPrice } from '../../config/brand';
import { gsap, trackProgress, useGSAP } from '../../lib/scroll';
import { store } from '../../lib/store';
import { useOrder } from '../../lib/order-context';
import { DrinkArt } from '../ui/DrinkArt';

function tilt(e: PointerEvent<HTMLElement>) {
  if (store.reducedMotion || e.pointerType !== 'mouse') return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5;
  const py = (e.clientY - r.top) / r.height - 0.5;
  gsap.to(el, { rotateY: px * 14, rotateX: -py * 14, y: -14, duration: 0.6, ease: 'power3.out', transformPerspective: 900 });
  el.style.setProperty('--gx', `${(px + 0.5) * 100}%`);
  el.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
}
const untilt = (e: PointerEvent<HTMLElement>) =>
  gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.5)' });

export function Menu() {
  const ref = useRef<HTMLElement>(null);
  const { openOrder } = useOrder();

  useGSAP(
    () => {
      trackProgress('menuIn', { trigger: ref.current, start: 'top bottom', end: 'top center' });
      gsap.from('.menu-head > *', { y: 60, opacity: 0, stagger: 0.1, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: ref.current, start: 'top 70%' } });
      gsap.from('.menu-in', { y: 100, opacity: 0, rotateX: -18, stagger: 0.1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.menu-grid', start: 'top 80%' } });
      if (!store.reducedMotion) {
        gsap.utils.toArray<HTMLElement>('.menu-par').forEach((el, i) => {
          gsap.to(el, { y: [-30, -90, -50][i % 3], ease: 'none', scrollTrigger: { trigger: '.menu-grid', start: 'top bottom', end: 'bottom top', scrub: true } });
        });
      }
    },
    { scope: ref },
  );

  return (
    <section id="menu" ref={ref} className="relative z-10 bg-cream py-28 text-espresso sm:py-36">
      <div className="container-x">
        <div className="menu-head flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow !text-caramel-600">Menyu</p>
            <h2 className="h-display mt-5 text-6xl sm:text-7xl lg:text-8xl">Bugungi <em className="text-caramel">tanlov</em></h2>
          </div>
          <p className="max-w-sm text-espresso/60">Har bir ichimlik yangi qovurilgan donlardan, buyurtma berilganda tayyorlanadi.</p>
        </div>

        <div className="menu-grid mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {MENU.map((m) => (
            <div key={m.id} className="menu-par">
              <div className="menu-in [perspective:900px]">
                <article
                  onPointerMove={tilt}
                  onPointerLeave={untilt}
                  data-cursor="Tanlash"
                  className="group relative overflow-hidden rounded-[28px] bg-white/70 p-6 shadow-soft transition-shadow duration-500 [transform-style:preserve-3d] hover:shadow-lift"
                  style={{ backgroundImage: 'radial-gradient(circle at var(--gx,50%) var(--gy,0%), rgba(212,162,76,0.18), transparent 55%)' }}
                >
                  {m.tag && <span className="absolute right-5 top-5 z-10 rounded-full bg-espresso px-3 py-1 text-[10px] uppercase tracking-widest text-cream">{m.tag}</span>}
                  <div className="relative mx-auto aspect-square max-w-[240px] transition-transform duration-700 ease-expo [transform:translateZ(40px)] group-hover:scale-105">
                    <DrinkArt art={m.art} />
                  </div>
                  <div className="mt-2 flex items-end justify-between gap-4 [transform:translateZ(25px)]">
                    <div>
                      <h3 className="font-serif text-3xl font-semibold">{m.name}</h3>
                      <p className="mt-1 text-sm text-espresso/60">{m.desc}</p>
                    </div>
                    <div className="whitespace-nowrap font-serif text-2xl text-caramel-600">{formatPrice(m.price)}</div>
                  </div>
                  <button
                    onClick={() => openOrder(m.id)}
                    className="mt-6 flex w-full items-center justify-between rounded-full border border-espresso/15 px-5 py-3 text-sm transition-all duration-500 hover:border-espresso hover:bg-espresso hover:text-cream active:scale-[0.97]"
                  >
                    Buyurtma <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </button>
                </article>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
