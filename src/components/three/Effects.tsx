import { DepthOfField, EffectComposer, Vignette } from '@react-three/postprocessing';

/**
 * Subtle cinematic post-processing (desktop only, lazy-loaded).
 * Focus is locked on the hero object plane (camera z=6 → object z=0),
 * so background beans get a soft bokeh blur.
 */
export default function Effects() {
  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      <DepthOfField worldFocusDistance={6} worldFocusRange={3.2} bokehScale={3} height={540} />
      <Vignette offset={0.25} darkness={0.55} eskil={false} />
    </EffectComposer>
  );
}
