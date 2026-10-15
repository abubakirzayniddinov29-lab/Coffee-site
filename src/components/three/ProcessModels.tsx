import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createBeanGeometry } from './geometry';
import { store } from '../../lib/store';

/* Models shown during the pinned "Process" section (Bean → Roast → Grind).
 * Step 4 (Brew) reuses the coffee cup. 🔁 Swap any of these for GLBs if desired. */

/** 01 — Coffee cherries + a raw green bean */
export function CherryModel() {
  const bean = useMemo(() => createBeanGeometry(32), []);
  const cherries = useMemo(
    () => [
      [-0.42, -0.25, 0.1, 0.3],
      [0.05, -0.35, 0.35, 0.26],
      [0.4, -0.15, -0.1, 0.28],
    ] as const,
    [],
  );
  return (
    <group>
      <mesh geometry={bean} scale={0.42} position={[0, 0.25, 0]} rotation={[0.4, 0.6, 0.3]} castShadow>
        <meshPhysicalMaterial color="#A9AE84" roughness={0.55} sheen={0.4} sheenColor="#e0e6c0" />
      </mesh>
      {cherries.map(([x, y, z, s], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh scale={s} castShadow>
            <sphereGeometry args={[1, 48, 32]} />
            <meshPhysicalMaterial color="#9E1B1B" roughness={0.18} clearcoat={1} clearcoatRoughness={0.05} />
          </mesh>
          <mesh position={[0, s * 0.98, 0]} scale={[0.02, 0.06, 0.02]}>
            <cylinderGeometry args={[1, 1, 1, 8]} />
            <meshStandardMaterial color="#3d4a1f" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** 02 — Glossy roasted bean with orbiting beans and a warm ember light */
export function RoastModel() {
  const bean = useMemo(() => createBeanGeometry(40), []);
  const light = useRef<THREE.PointLight>(null!);
  const ring = useRef<THREE.Group>(null!);
  useFrame(({ clock }, dt) => {
    if (store.reducedMotion) return;
    light.current.intensity = 6 + Math.sin(clock.elapsedTime * 7) * 1.2 + Math.sin(clock.elapsedTime * 13) * 0.6;
    ring.current.rotation.y += dt * 0.6;
  });
  return (
    <group>
      <mesh geometry={bean} scale={0.6} rotation={[0.3, -0.5, 0.2]} castShadow>
        <meshPhysicalMaterial color="#3b2010" roughness={0.25} clearcoat={1} clearcoatRoughness={0.15} />
      </mesh>
      <group ref={ring}>
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <mesh
              key={i}
              geometry={bean}
              scale={0.1}
              position={[Math.cos(a) * 0.95, Math.sin(a * 2) * 0.15, Math.sin(a) * 0.95]}
              rotation={[a, a * 1.5, 0]}
            >
              <meshPhysicalMaterial color="#2e180b" roughness={0.3} clearcoat={0.8} />
            </mesh>
          );
        })}
      </group>
      <pointLight ref={light} color="#ff8a3d" intensity={6} distance={4} position={[0, -0.9, 0.6]} />
    </group>
  );
}

/** 03 — A cone-shaped pile of ground coffee (instanced fragments) */
export function GrindModel({ count = 700 }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const geo = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);
  const group = useRef<THREE.Group>(null!);

  // matrices are written once when the instanced mesh mounts
  const setup = (m: THREE.InstancedMesh | null) => {
    if (!m || m.userData.ready) return;
    mesh.current = m;
    const d = new THREE.Object3D();
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = Math.sqrt(Math.random()) * 0.85;
      const a = Math.random() * Math.PI * 2;
      const hMax = 0.75 * (1 - r / 0.85);
      d.position.set(Math.cos(a) * r, -0.45 + Math.random() * hMax, Math.sin(a) * r);
      d.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      d.scale.setScalar(0.018 + Math.random() * 0.03);
      d.updateMatrix();
      m.setMatrixAt(i, d.matrix);
      color.setHSL(0.07, 0.55, 0.12 + Math.random() * 0.1);
      m.setColorAt(i, color);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
    m.userData.ready = true;
  };

  useFrame((_, dt) => {
    if (!store.reducedMotion) group.current.rotation.y += dt * 0.25;
  });

  return (
    <group ref={group}>
      <instancedMesh ref={setup} args={[geo, undefined, count]} castShadow>
        <meshStandardMaterial roughness={0.85} />
      </instancedMesh>
      {/* a few whole beans resting on top */}
      <BeanCluster />
    </group>
  );
}

function BeanCluster() {
  const bean = useMemo(() => createBeanGeometry(20), []);
  return (
    <>
      {[
        [0.0, 0.33, 0.0],
        [0.18, 0.18, 0.12],
        [-0.2, 0.15, -0.05],
      ].map((p, i) => (
        <mesh key={i} geometry={bean} scale={0.12} position={p as [number, number, number]} rotation={[i, i * 2, 0.5]}>
          <meshPhysicalMaterial color="#3b2010" roughness={0.3} clearcoat={0.8} />
        </mesh>
      ))}
    </>
  );
}
