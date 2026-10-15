import { useEffect, useState } from 'react';
import { NAV } from '../../config/brand';
import { scrollToTarget } from '../../lib/scroll';
import { useOrder } from '../../lib/order-context';
import { Logo } from './Logo';
import { Button } from './Button';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('#home');
  const { openOrder } = useOrder();

  // blur bg after scrolling, hide on scroll-down / show on scroll-up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > last && y > 400);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // highlight the section in view
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: '-50% 0px -50% 0px' },
    );
    NAV.forEach((n) => {
      const el = document.querySelector(n.href);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  const go = (href: string) => {
    setMenuOpen(false);
    scrollToTarget(href);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-expo ${
          hidden && !menuOpen ? '-translate-y-full' : 'translate-y-0'
        } ${scrolled ? 'bg-espresso/60 py-3 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl' : 'py-6'}`}
      >
        <nav className="container-x flex items-center justify-between" aria-label="Asosiy navigatsiya">
          <a href="#home" onClick={(e) => { e.preventDefault(); go('#home'); }} aria-label="Bosh sahifa">
            <Logo />
          </a>

          <ul className="hidden items-center gap-9 lg:flex">
            {NAV.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  aria-current={active === n.href}
                  onClick={(e) => { e.preventDefault(); go(n.href); }}
                  className={`link-underline text-sm tracking-wide transition-colors ${
                    active === n.href ? 'text-gold' : 'text-cream/80 hover:text-cream'
                  }`}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Button className="hidden !px-6 !py-3 sm:inline-flex" onClick={() => openOrder()}>
              Buyurtma
            </Button>
            <button
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 lg:hidden"
              aria-label={menuOpen ? 'Menyuni yopish' : 'Menyuni ochish'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className={`absolute h-px w-5 bg-cream transition-transform duration-500 ${menuOpen ? 'rotate-45' : '-translate-y-1'}`} />
              <span className={`absolute h-px w-5 bg-cream transition-transform duration-500 ${menuOpen ? '-rotate-45' : 'translate-y-1'}`} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-espresso-900/95 backdrop-blur-xl transition-[clip-path] duration-700 ease-expo lg:hidden ${
          menuOpen ? '[clip-path:circle(150%_at_100%_0)]' : 'pointer-events-none [clip-path:circle(0%_at_100%_0)]'
        }`}
      >
        <ul className="container-x space-y-4">
          {NAV.map((n, i) => (
            <li
              key={n.href}
              className={`transition-all duration-700 ease-expo ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
              style={{ transitionDelay: menuOpen ? `${150 + i * 60}ms` : '0ms' }}
            >
              <a
                href={n.href}
                onClick={(e) => { e.preventDefault(); go(n.href); }}
                className="font-serif text-5xl text-cream hover:text-gold"
              >
                {n.label}
              </a>
            </li>
          ))}
          <li className="pt-6">
            <Button onClick={() => { setMenuOpen(false); openOrder(); }} arrow>
              Buyurtma berish
            </Button>
          </li>
        </ul>
      </div>
    </>
  );
}
