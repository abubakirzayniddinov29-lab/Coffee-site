import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { store } from './store';

gsap.registerPlugin(ScrollTrigger, useGSAP);

let lenis: Lenis | null = null;

/** Lenis smooth scroll wired into GSAP's ticker so ScrollTrigger stays in sync. */
export function initSmoothScroll() {
  if (store.reducedMotion) return () => {};

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', (l: Lenis) => {
    store.scrollVelocity = l.velocity;
    ScrollTrigger.update();
  });

  const raf = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(raf);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToTarget(target: string | number) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.8 });
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: store.reducedMotion ? 'auto' : 'smooth' });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: store.reducedMotion ? 'auto' : 'smooth' });
  }
}

export const stopScroll = () => {
  lenis?.stop();
  document.documentElement.style.overflow = 'hidden';
};
export const startScroll = () => {
  lenis?.start();
  document.documentElement.style.overflow = '';
};

/**
 * Creates a ScrollTrigger whose progress is written into store.progress[key].
 * The 3D rig reads those values to interpolate the cup between poses.
 */
export function trackProgress(key: string, vars: ScrollTrigger.Vars) {
  store.progress[key] = 0;
  return ScrollTrigger.create({
    ...vars,
    onUpdate: (self) => {
      store.progress[key] = self.progress;
      vars.onUpdate?.(self);
    },
    onRefresh: (self) => {
      store.progress[key] = self.progress;
      vars.onRefresh?.(self);
    },
  });
}

export { gsap, ScrollTrigger, useGSAP };
