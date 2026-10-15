import { store } from '../../lib/store';

/**
 * 🎬 SCROLL CHOREOGRAPHY for the pinned 3D object.
 * Each segment maps a ScrollTrigger (registered in the matching section via
 * trackProgress(key, …)) to a from → to pose. Tweak numbers here to change
 * how the cup moves between sections.
 *
 * Units: world units. At the default camera the viewport is ≈3.8 units tall.
 * `my` = optional y override on portrait/mobile screens (x is mostly collapsed).
 */
export type Pose = { x: number; y: number; z: number; rx: number; ry: number; scale: number; my?: number };

const P = (p: Partial<Pose>): Pose => ({ x: 0, y: 0, z: 0, rx: 0.15, ry: 0, scale: 1, ...p });
const PI = Math.PI;

export const POSES = {
  hero: P({ y: -0.5, scale: 1.15, my: -0.35 }),
  story: P({ x: -1.6, y: -0.1, ry: PI, scale: 1.05, my: 0.85 }),
  process: P({ x: 1.6, y: -0.15, ry: PI * 2, scale: 1.0, my: -0.95 }),
  processEnd: P({ x: 1.6, y: -0.15, ry: PI * 3, scale: 1.0, my: -0.95 }),
  menuOut: P({ x: 1.6, y: 3.6, ry: PI * 3.5, scale: 0.9, my: 3.6 }),
  sigStart: P({ y: -3.6, ry: PI * 3.5, scale: 0.9, my: -3.6 }),
  sigCenter: P({ y: -0.2, ry: PI * 4, scale: 1.15 }),
  sigZoom: P({ y: -0.4, rx: 0.42, ry: PI * 5, scale: 2.1, my: -0.2 }),
  testiOut: P({ y: 4, rx: 0.42, ry: PI * 5.5, scale: 1.6, my: 4 }),
  ctaStart: P({ y: -3.8, ry: PI * 5.5, scale: 1, my: -3.8 }),
  cta: P({ y: -0.2, rx: 0.2, ry: PI * 6, scale: 1.2, my: -0.1 }),
  footer: P({ y: 1.8, rx: 0.2, ry: PI * 6.5, scale: 1.0, my: 1.8 }),
};

export const SEGMENTS: { key: string; from: Pose; to: Pose }[] = [
  { key: 'story', from: POSES.hero, to: POSES.story },
  { key: 'processIn', from: POSES.story, to: POSES.process },
  { key: 'processPin', from: POSES.process, to: POSES.processEnd },
  { key: 'menuIn', from: POSES.processEnd, to: POSES.menuOut },
  { key: 'sigIn', from: POSES.sigStart, to: POSES.sigCenter },
  { key: 'sigPin', from: POSES.sigCenter, to: POSES.sigZoom },
  { key: 'testiIn', from: POSES.sigZoom, to: POSES.testiOut },
  { key: 'ctaIn', from: POSES.ctaStart, to: POSES.cta },
  { key: 'footerIn', from: POSES.cta, to: POSES.footer },
];

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Returns the target pose for the current scroll position, adapted to aspect ratio. */
export function computePose(aspect: number, out: Pose): Pose {
  let from = POSES.hero;
  let to = POSES.hero;
  let t = 0;
  for (const s of SEGMENTS) {
    const p = store.progress[s.key] ?? 0;
    if (p > 0) {
      from = s.from;
      to = s.to;
      t = ease(p);
    }
  }
  const mobile = aspect < 0.8;
  const tablet = aspect >= 0.8 && aspect < 1.25;
  const xf = mobile ? 0.12 : tablet ? 0.55 : 1;
  const sf = mobile ? 0.72 : tablet ? 0.85 : 1;
  const fy = mobile && from.my !== undefined ? from.my : from.y;
  const ty = mobile && to.my !== undefined ? to.my : to.y;

  out.x = lerp(from.x, to.x, t) * xf;
  out.y = lerp(fy, ty, t);
  out.z = lerp(from.z, to.z, t);
  out.rx = lerp(from.rx, to.rx, t);
  out.ry = lerp(from.ry, to.ry, t);
  out.scale = lerp(from.scale, to.scale, t) * sf;
  return out;
}

/**
 * Which model is shown: 0 Bean, 1 Roast, 2 Grind, 3 Cup.
 * During the pinned Process section the step follows the horizontal panels.
 */
export function getVariant(): number {
  const p = store.progress.processPin ?? 0;
  if (p > 0.001 && p < 0.999) return Math.round(p * 3);
  return 3;
}
