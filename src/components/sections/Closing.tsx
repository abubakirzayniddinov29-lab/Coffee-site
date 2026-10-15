import { useRef } from 'react';
import { BRAND, CONTACT, CTA, NAV } from '../../config/brand';
import { gsap, scrollToTarget, trackProgress, useGSAP } from '../../lib/scroll';
import { useOrder } from '../../lib/order-context';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    gsap.from('.c-anim', { y: 50, opacity: 0, stagger: 0.08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: ref.current, start: 'top 70%' } });
  }, { scope: ref });

  const items = [
    { k: 'Manzil', v: CONTACT.address },
    { k: 'Telefon', v: CONTACT.phone, href: CONTACT.phoneHref },
    { k: 'Instagram', v: CONTACT.instagram, href: CONTACT.instagramHref },
    { k: 'Telegram', v: CONTACT.telegram, href: CONTACT.telegramHref },
    { k: 'Ish vaqti', v: CONTACT.hours },
  ];

  return (
    <section id="contact" ref={ref} className="relative z-10 bg-cream py-28 text-espresso sm:py-36">
      <div className="container-x grid gap-14 lg:grid-cols-2">
        <div>
          <p className="c-anim eyebrow !text-caramel-600">Aloqa</p>
          <h2 className="c-anim h-display mt-5 text-6xl sm:text-7xl">Bizga <em className="text-caramel">tashrif</em> buyuring</h2>
          <dl className="mt-12 divide-y divide-espresso/10 border-y border-espresso/10">
            {items.map((it) => (
              <div key={it.k} className="c-anim flex items-center justify-between gap-6 py-5">
                <dt className="text-xs uppercase tracking-widest text-espresso/50">{it.k}</dt>
                <dd className="text-right font-serif text-xl sm:text-2xl">
                  {it.href ? <a href={it.href} target={it.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="link-underline hover:text-caramel-600">{it.v}</a> : it.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 🗺️ MAP PLACEHOLDER — replace with:
            <iframe loading="lazy" src="https://www.google.com/maps/embed?pb=..." className="h-full w-full" /> */}
        <div className="c-anim relative min-h-[380px] overflow-hidden rounded-[32px] bg-espresso shadow-lift">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(#C68B59 1px, transparent 1px), linear-gradient(90deg, #C68B59 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
          <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 400 400" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 260 C 120 220, 180 320, 400 240" stroke="#D4A24C" strokeWidth="6" fill="none" />
            <path d="M140 0 C 160 140, 260 200, 240 400" stroke="#F5EBDD" strokeWidth="3" fill="none" />
          </svg>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
            <span className="absolute left-1/2 top-full h-16 w-16 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-gold/30" />
            <div className="relative rounded-full bg-gold px-4 py-2 text-sm font-medium text-espresso shadow-lg">{BRAND.name}</div>
          </div>
          <div className="absolute bottom-5 left-5 rounded-full bg-cream/90 px-4 py-2 text-xs text-espresso">Xarita joyi (Google Maps embed)</div>
        </div>
      </div>
    </section>
  );
}

/** Final CTA: the cup returns to center with steam (poses.ts → "cta"). */
export function CallToAction() {
  const ref = useRef<HTMLElement>(null);
  const { openOrder } = useOrder();
  useGSAP(() => {
    trackProgress('ctaIn', { trigger: ref.current, start: 'top bottom', end: 'center center' });
    gsap.from('.cta-anim', { y: 80, opacity: 0, stagger: 0.12, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: ref.current, start: 'top 60%' } });
  }, { scope: ref });

  return (
    <section id="order" ref={ref} className="relative flex min-h-screen flex-col items-center justify-between py-28 text-center">
      <div>
        <p className="cta-anim eyebrow justify-center">{CTA.eyebrow}</p>
        <h2 className="cta-anim h-display mt-5 text-[15vw] sm:text-[10vw] lg:text-[9rem]">{CTA.title}</h2>
      </div>
      <div className="cta-anim">
        <Button onClick={() => openOrder()} arrow className="!px-12 !py-6 !text-base" cursorLabel="Buyurtma">{CTA.button}</Button>
      </div>
    </section>
  );
}

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    trackProgress('footerIn', { trigger: ref.current, start: 'top bottom', end: 'bottom bottom' });
  }, { scope: ref });

  return (
    <footer ref={ref} className="relative z-10 border-t border-cream/10 bg-espresso-900 pb-10 pt-20">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-sm text-sm text-cream/50">{BRAND.tagline}. Har bir qultumda — san'at.</p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-gold">Sahifalar</div>
            <ul className="mt-5 space-y-3 text-sm text-cream/70">
              {NAV.map((n) => (
                <li key={n.href}><a href={n.href} onClick={(e) => { e.preventDefault(); scrollToTarget(n.href); }} className="link-underline hover:text-cream">{n.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-gold">Ijtimoiy tarmoqlar</div>
            <ul className="mt-5 space-y-3 text-sm text-cream/70">
              <li><a href={CONTACT.instagramHref} target="_blank" rel="noreferrer" className="link-underline hover:text-cream">Instagram</a></li>
              <li><a href={CONTACT.telegramHref} target="_blank" rel="noreferrer" className="link-underline hover:text-cream">Telegram</a></li>
              <li><a href={CONTACT.phoneHref} className="link-underline hover:text-cream">{CONTACT.phone}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-8 text-xs text-cream/40 sm:flex-row">
          <span>© {new Date().getFullYear()} {BRAND.name}. Barcha huquqlar himoyalangan.</span>
          <button onClick={() => scrollToTarget(0)} className="link-underline hover:text-cream">Yuqoriga ↑</button>
        </div>
      </div>
    </footer>
  );
}
