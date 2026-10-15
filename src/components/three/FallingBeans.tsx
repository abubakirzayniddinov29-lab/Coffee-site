import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { createBeanGeometry } from './geometry';
import { store } from '../../lib/store';

const CAM_Z = 6;
const HALF_FOV_TAN = Math.tan(THREE.MathUtils.degToRad(35 / 2));

/**
 * Background beans with simple physics: gravity up to a terminal velocity,
 * air-drag sway, tumbling, mouse repulsion and "wind" from scroll velocity.
 * Uses a single InstancedMesh → one draw call.
 */
export function FallingBeans({ count = 60 }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const geo = useMemo(() => createBeanGeometry(14), []);
  const { size } = useThree();
  const aspect = size.width / size.height;

  const beans = useMemo(
    () =>
      Array.from({ length: count }, () => {
        const z = -1.5 - Math.random() * 6.5;
        const halfH = HALF_FOV_TAN * (CAM_Z - z);
        return {
          x: (Math.random() * 2 - 1) * halfH * aspect,
          y: (Math.random() * 2 - 1) * halfH,
          z,
          vx: 0,
          vy: -Math.random() * 0.3,
          term: 0.18 + Math.random() * 0.35,
          rx: Math.random() * 6,
          ry: Math.random() * 6,
          rz: Math.random() * 6,
          wr: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).multiplyScalar(1.6),
          phase: Math.random() * 100,
          s: 0.07 + Math.random() * 0.07,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count],
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const first = useRef(true);

  useFrame(({ clock }, rawDt) => {
    const still = store.reducedMotion;
    if (still && !first.current) return;
    first.current = false;
    const dt = Math.min(rawDt, 0.05);
    const t = clock.elapsedTime;
    const wind = THREE.MathUtils.clamp(store.scrollVelocity, -60, 60) * 0.035;

    for (let i = 0; i < beans.length; i++) {
      const b = beans[i];
      const halfH = HALF_FOV_TAN * (CAM_Z - b.z);
      const halfW = halfH * aspect;
      const depth = 1 - (-b.z - 1.5) / 6.5; // 1 = near, 0 = far

      if (!still) {
        // gravity + terminal velocity
        b.vy = Math.max(b.vy - 0.35 * dt, -b.term);
        // sway (air drag)
        b.vx += Math.sin(t * 0.6 + b.phase) * 0.08 * dt;
        // mouse repulsion
        const mx = store.mouse.x * halfW;
        const my = store.mouse.y * halfH;
        const dx = b.x - mx;
        const dy = b.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < 1.2) {
          const f = (1.2 - d2) * 0.9 * depth;
          b.vx += dx * f * dt;
          b.vy += dy * f * dt;
        }
        b.vx *= 0.985;
        b.x += b.vx * dt;
        b.y += (b.vy + wind * (0.4 + depth)) * dt;
        b.rx += b.wr.x * dt;
        b.ry += b.wr.y * dt;
        b.rz += b.wr.z * dt;

        // wrap around
        if (b.y < -halfH - 0.4) {
          b.y = halfH + 0.4;
          b.x = (Math.random() * 2 - 1) * halfW;
          b.vy = 0;
          b.vx = 0;
        } else if (b.y > halfH + 0.6) {
          b.y = -halfH - 0.3;
        }
        if (b.x > halfW + 0.5) b.x = -halfW - 0.4;
        if (b.x < -halfW - 0.5) b.x = halfW + 0.4;
      }

      dummy.position.set(b.x, b.y, b.z);
      dummy.rotation.set(b.rx, b.ry, b.rz);
      dummy.scale.setScalar(b.s);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[geo, undefined, count]} frustumCulled={false}>
      <meshStandardMaterial color="#5a3420" roughness={0.4} metalness={0.05} />
    </instancedMesh>
  );
}
