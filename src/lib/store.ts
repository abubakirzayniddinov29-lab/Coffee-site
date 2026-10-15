/**
 * Tiny mutable store shared between the DOM (GSAP/ScrollTrigger) and the
 * WebGL scene (useFrame). Mutating plain objects avoids React re-renders at
 * 60fps — the 3D loop simply reads these values every frame.
 */
export const store = {
  /** normalized pointer position, -1..1 */
  mouse: { x: 0, y: 0 },
  /** 0 → 1 intro tween (cup scale/fade-in after the loader) */
  intro: 0,
  /** ScrollTrigger progress per scroll segment (see three/poses.ts) */
  progress: {} as Record<string, number>,
  /** Lenis scroll velocity (px/frame) — drives bean "wind" */
  scrollVelocity: 0,
  reducedMotion:
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      store.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      store.mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true },
  );
}
