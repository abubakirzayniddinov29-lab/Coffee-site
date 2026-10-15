import { useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { createCremaTexture } from './geometry';

/* ============================================================================
 * 🔁 SWAP 3D MODEL
 * ----------------------------------------------------------------------------
 * Drop a Draco-compressed .glb into /public/models and set the path below.
 *   export const CUP_MODEL_URL: string | null = '/models/coffee-cup.glb';
 * The model is auto-centered and scaled to ~1.25 units tall.
 * Leave `null` to use the built-in procedural ceramic cup (zero downloads).
 * ========================================================================== */
export const CUP_MODEL_URL: string | null = null;

/** Height (in the cup's local space) where steam starts. Adjust for custom models. */
export const STEAM_ORIGIN_Y = 0.3;

export function CoffeeCup() {
  return CUP_MODEL_URL ? <GLBCup url={CUP_MODEL_URL} /> : <ProceduralCup />;
}

function GLBCup({ url }: { url: string }) {
  // `true` → enables Draco decoding (decoder fetched from Google's CDN by drei).
  // To self-host: copy three/examples/jsm/libs/draco/ to /public/draco and pass '/draco/'.
  const { scene } = useGLTF(url, true);
  const { object, scale, offset } = useMemo(() => {
    const obj = scene.clone(true);
    obj.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
      }
    });
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = 1.25 / Math.max(size.y, 0.0001);
    return { object: obj, scale: s, offset: center.multiplyScalar(-s) };
  }, [scene]);

  return (
    <group position={offset}>
      <primitive object={object} scale={scale} />
    </group>
  );
}

/* ---------------------------- Procedural cup ---------------------------- */

const CUP_PROFILE = [
  [0, 0], [0.34, 0], [0.4, 0.03], [0.44, 0.12], [0.5, 0.36], [0.55, 0.6], [0.575, 0.78],
  [0.58, 0.8], [0.555, 0.805], [0.535, 0.62], [0.48, 0.38], [0.42, 0.16], [0.34, 0.08], [0, 0.08],
].map(([x, y]) => new THREE.Vector2(x, y));

const SAUCER_PROFILE = [
  [0, -0.03], [0.5, -0.03], [0.62, -0.01], [0.82, 0.05], [0.88, 0.085], [0.86, 0.095],
  [0.78, 0.07], [0.6, 0.025], [0.44, 0.02], [0.4, 0.035], [0, 0.035],
].map(([x, y]) => new THREE.Vector2(x, y));

function ProceduralCup() {
  const cupGeo = useMemo(() => new THREE.LatheGeometry(CUP_PROFILE, 96), []);
  const saucerGeo = useMemo(() => new THREE.LatheGeometry(SAUCER_PROFILE, 96), []);
  const crema = useMemo(() => createCremaTexture(), []);

  // 🎨 SWAP COLORS: ceramic / gold trim / coffee surface
  const ceramic = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#F3E8D8',
        roughness: 0.28,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        sheen: 0.3,
        side: THREE.DoubleSide,
      }),
    [],
  );
  const gold = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#D4A24C', metalness: 1, roughness: 0.22 }),
    [],
  );

  // Visual center of the cup+saucer roughly at origin
  return (
    <group position={[0, -0.42, 0]}>
      <mesh geometry={saucerGeo} material={ceramic} castShadow receiveShadow />
      <mesh position={[0, 0.087, 0]} rotation={[Math.PI / 2, 0, 0]} material={gold}>
        <torusGeometry args={[0.865, 0.008, 8, 128]} />
      </mesh>

      <group position={[0, 0.035, 0]}>
        <mesh geometry={cupGeo} material={ceramic} castShadow receiveShadow />
        {/* gold rim */}
        <mesh position={[0, 0.802, 0]} rotation={[Math.PI / 2, 0, 0]} material={gold}>
          <torusGeometry args={[0.568, 0.011, 12, 128]} />
        </mesh>
        {/* coffee surface */}
        <mesh position={[0, 0.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.548, 64]} />
          <meshPhysicalMaterial map={crema} roughness={0.18} clearcoat={0.6} clearcoatRoughness={0.2} />
        </mesh>
        {/* handle */}
        <mesh position={[0.52, 0.44, 0]} rotation={[0, 0, -Math.PI / 2]} material={ceramic} castShadow>
          <torusGeometry args={[0.19, 0.045, 20, 48, Math.PI * 1.05]} />
        </mesh>
      </group>
    </group>
  );
}

// Preload only when a GLB is configured
if (CUP_MODEL_URL) useGLTF.preload(CUP_MODEL_URL, true);
