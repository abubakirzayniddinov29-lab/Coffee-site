import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createBeanGeometry, createSoftTexture } from './geometry';
import { store } from '../../lib/store';

/** Rising, fading steam sprites. */
export function Steam({ count = 14, y = 0.3, spread = 0.28, height = 1.3, opacity = 0.16 }) {
  const tex = useMemo(() => createSoftTexture(), []);
  const refs = useRef<THREE.Sprite[]>([]);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        offset: i / count,
        speed: 0.16 + Math.random() * 0.1,
        x: (Math.random() - 0.5) * spread,
        z: (Math.random() - 0.5) * spread,
        wobble: Math.random() * Math.PI * 2,
      })),
    [count, spread],
  );

  useFrame(({ clock }) => {
    const t = store.reducedMotion ? 1.5 : clock.elapsedTime;
    refs.current.forEach((s, i) => {
      if (!s) return;
      const d = seeds[i];
      const life = (t * d.speed + d.offset) % 1;
      s.position.set(
        d.x + Math.sin(t * 1.2 + d.wobble + life * 4) * 0.14 * life,
        y + life * height,
        d.z + Math.cos(t * 0.8 + d.wobble) * 0.06,
      );
      const sc = 0.16 + life * 0.62;
      s.scale.set(sc, sc * 1.3, 1);
      (s.material as THREE.SpriteMaterial).opacity = Math.sin(Math.PI * life) * opacity;
    });
  });

  return (
    <group>
      {seeds.map((_, i) => (
        <sprite key={i} ref={(el) => { if (el) refs.current[i] = el; }}>
          <spriteMaterial map={tex} transparent depthWrite={false} color="#F5EBDD" opacity={0} />
        </sprite>
      ))}
    </group>
  );
}

/** A ring of beans floating around the hero object. */
export function OrbitBeans({ count = 8, radius = 1.15 }) {
  const geo = useMemo(() => createBeanGeometry(20), []);
  const group = useRef<THREE.Group>(null!);
  const refs = useRef<THREE.Mesh[]>([]);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        a: (i / count) * Math.PI * 2,
        r: radius * (0.85 + Math.random() * 0.35),
        y: (Math.random() - 0.5) * 0.9,
        s: 0.07 + Math.random() * 0.04,
        rs: 0.4 + Math.random() * 0.8,
        ph: Math.random() * 10,
      })),
    [count, radius],
  );

  useFrame(({ clock }, dt) => {
    if (store.reducedMotion) return;
    const t = clock.elapsedTime;
    group.current.rotation.y -= dt * 0.15;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const d = seeds[i];
      m.position.set(Math.cos(d.a) * d.r, d.y + Math.sin(t * 0.8 + d.ph) * 0.12, Math.sin(d.a) * d.r);
      m.rotation.x += dt * d.rs;
      m.rotation.z += dt * d.rs * 0.6;
    });
  });

  return (
    <group ref={group}>
      {seeds.map((d, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) refs.current[i] = el; }}
          geometry={geo}
          scale={d.s}
          position={[Math.cos(d.a) * d.r, d.y, Math.sin(d.a) * d.r]}
          rotation={[d.ph, d.ph * 2, 0]}
          castShadow
        >
          <meshPhysicalMaterial color="#4a2a17" roughness={0.35} clearcoat={0.5} clearcoatRoughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}
