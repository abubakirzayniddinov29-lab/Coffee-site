import { useEffect, useRef, type ReactNode, type MouseEvent } from 'react';
import { gsap } from 'gsap';
import { scrollToTarget } from '../../lib/scroll';
import { store } from '../../lib/store';

type Props = {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'dark';
  href?: string;
  onClick?: (e: MouseEvent) => void;
  className?: string;
  arrow?: boolean;
  type?: 'button' | 'submit';
  disabled?: boolean;
  cursorLabel?: string;
};

export const Arrow = () => (
  <svg className="arrow h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Button with a fill-sweep hover (CSS) + magnetic pull (GSAP) micro-interaction. */
export function Button({ children, variant = 'primary', href, onClick, className = '', arrow, type = 'button', disabled, cursorLabel }: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || store.reducedMotion || !window.matchMedia('(pointer: fine)').matches) return;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
    };
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, []);

  const cls = `btn btn-${variant} ${disabled ? 'opacity-60 pointer-events-none' : ''} ${className}`;
  const content = (
    <span>
      {children}
      {arrow && <Arrow />}
    </span>
  );

  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        className={cls}
        data-cursor={cursorLabel}
        onClick={(e) => {
          if (href.startsWith('#')) {
            e.preventDefault();
            scrollToTarget(href);
          }
          onClick?.(e);
        }}
      >
        {content}
      </a>
    );
  }
  return (
    <button ref={ref} type={type} className={cls} onClick={onClick} disabled={disabled} data-cursor={cursorLabel}>
      {content}
    </button>
  );
}
