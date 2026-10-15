import { Suspense, lazy, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, PerformanceMonitor } from '@react-three/drei';
import { CoffeeCup, STEAM_ORIGIN_Y } from './CoffeeCup';
import { OrbitBeans, Steam } from './Particles';
import { CherryModel, GrindModel, RoastModel } from './ProcessModels';
import { FallingBeans } from './FallingBeans';
import { computePose, getVariant, type Pose } from './poses';
import { store } from '../../lib/store';
import { COLORS } from '../../config/brand';

const Effects = lazy(() => import('./Effects'));

/** Toggle cinematic depth-of-field (desktop only, auto-disabled on low FPS). */
const ENABLE_DOF = true;

export default function Scene({ onReady }: { onReady: () => void }) {
  const [dpr, setDpr] = useState(1.5);
  const [lowPerf, setLowPerf] = useState(false);
  const isDesktop = useMemo(() => window.matchMedia('(min-width: 1024px)').matches, []);
  const beanCount = store.reducedMotion ? 18 : isDesktop ? 70 : 32;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
      <Canvas
        dpr={[1, dpr]}
        camera={{ position: [0, 0, 6], fov: 35, near: 0.1, far: 40 }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: false, stencil: false }}
      >
        <color attach="background" args={[COLORS.espresso]} />
        <fog attach="fog" args={[COLORS.espresso, 7, 15]} />
        <PerformanceMonitor
          onDecline={() => {
            setDpr(1);
            setLowPerf(true);
          }}
          onIncline={() => setDpr(Math.min(2, window.devicePixelRatio))}
        />

        <Suspense fallback={null}>
          <Backdrop />
          <Lights />
          <CupRig />
          <FallingBeans count={beanCount} />
          <ReadySignal onReady={onReady} />
          {ENABLE_DOF && isDesktop && !lowPerf && !store.reducedMotion && <Effects />}
        </Suspense>
      </Canvas>
    </div>
  );
}

function ReadySignal({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    // wait one frame so shaders are compiled before the loader leaves
    const id = requestAnimationFrame(() => onReady());
    return () => cancelAnimationFrame(id);
  }, [onReady]);
  return null;
}

/* ------------------------------------------------------------------------ */
/* Lighting — studio "HDRI" built from Lightformers (no network download).   */
/* 🔁 To use a real HDRI: <Environment files="/hdri/studio_1k.hdr" />         */
/* ------------------------------------------------------------------------ */
function Lights() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} color="#ffe2bf" />
      <directionalLight position={[-4, 2, -3]} intensity={1.2} color={COLORS.caramel} />
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={2.5} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
        <Lightformer intensity={2} color="#ffd9a8" rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 0.6, 1]} />
        <Lightformer intensity={1.2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 1, 1]} />
        <Lightformer intensity={1.5} color="#fff3e2" position={[0, 0, 8]} scale={[6, 3, 1]} />
        <Lightformer form="ring" color={COLORS.gold} intensity={6} scale={2} position={[5, 3, 4]} target={[0, 0, 0]} />
      </Environment>
    </>
  );
}

/* Warm radial glow behind the object; follows the cup horizontally. */
function Backdrop() {
  const mat = useRef<THREE.ShaderMaterial>(null!);
  const uniforms = useMemo(
    () => ({
      uBase: { value: new THREE.Color(COLORS.espresso) },
      uGlow: { value: new THREE.Color(COLORS.caramel) },
      uPos: { value: new THREE.Vector2(0, 0) },
      uStrength: { value: 0.32 },
    }),
    [],
  );
  const tmp = useMemo(() => new THREE.Vector2(), []);
  useFrame(() => {
    // glow follows the hero object's position (written by CupRig)
    tmp.set(rigPosition.x * 1.6, rigPosition.y * 1.4);
    mat.current.uniforms.uPos.value.lerp(tmp, 0.05);
  });
  return (
    <mesh position={[0, 0, -9]} renderOrder={-1}>
      <planeGeometry args={[60, 34]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        depthWrite={false}
        toneMapped={false}
        vertexShader={/* glsl */ `
          varying vec2 vPos;
          void main() {
            vPos = position.xy;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`}
        fragmentShader={/* glsl */ `
          uniform vec3 uBase; uniform vec3 uGlow; uniform vec2 uPos; uniform float uStrength;
          varying vec2 vPos;
          void main() {
            float d = distance(vPos, uPos);
            float g = smoothstep(9.0, 0.0, d);
            vec3 col = mix(uBase, uGlow, g * g * uStrength);
            gl_FragColor = vec4(col, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`}
      />
    </mesh>
  );
}

const rigPosition = new THREE.Vector3();

/* ------------------------------------------------------------------------ */
/* The pinned hero object: scroll pose + mouse parallax + model swapping.    */
/* ------------------------------------------------------------------------ */
function CupRig() {
  const outer = useRef<THREE.Group>(null!);
  const inner = useRef<THREE.Group>(null!);
  const { size } = useThree();
  const target = useMemo<Pose>(() => ({ x: 0, y: 0, z: 0, rx: 0, ry: 0, scale: 1 }), []);
  const state = useRef({ ry: 0, rx: 0, scale: 0, spin: 0, tiltX: 0, tiltY: 0, init: false });

  useFrame(({ clock }, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const s = state.current;
    computePose(size.width / size.height, target);
    const k = 1 - Math.exp(-dt * 5);
    const g = outer.current;

    // snap when jumping between off-screen positions (e.g. menu → signature)
    if (!s.init || Math.abs(target.y - g.position.y) > 4.5) {
      g.position.set(target.x, target.y, target.z);
      s.init = true;
    } else {
      g.position.x += (target.x - g.position.x) * k;
      g.position.y += (target.y - g.position.y) * k;
      g.position.z += (target.z - g.position.z) * k;
    }
    rigPosition.copy(g.position);

    s.ry += (target.ry - s.ry) * k;
    s.rx += (target.rx - s.rx) * k;
    const intro = THREE.MathUtils.smootherstep(store.intro, 0, 1);
    const targetScale = target.scale * intro;
    s.scale += (targetScale - s.scale) * k;

    if (!store.reducedMotion) {
      s.spin += dt * 0.25; // slow idle rotation
      s.tiltX += (store.mouse.x - s.tiltX) * k;
      s.tiltY += (store.mouse.y - s.tiltY) * k;
    }
    const float = store.reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.9) * 0.05;

    g.scale.setScalar(Math.max(s.scale, 0.0001));
    g.visible = s.scale > 0.002;
    inner.current.position.y = float;
    inner.current.rotation.set(s.rx - s.tiltY * 0.25, s.ry + s.spin + s.tiltX * 0.45, s.tiltX * -0.06);
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        <VariantSlot index={3}>
          <CoffeeCup />
          <OrbitBeans />
        </VariantSlot>
        <VariantSlot index={0}>
          <CherryModel />
        </VariantSlot>
        <VariantSlot index={1}>
          <RoastModel />
        </VariantSlot>
        <VariantSlot index={2}>
          <GrindModel />
        </VariantSlot>
      </group>
      {/* steam stays upright (not affected by tilt/spin) */}
      <VariantSlot index={3} spinIn={false}>
        <Steam y={STEAM_ORIGIN_Y} />
      </VariantSlot>
      <ContactShadows position={[0, -0.5, 0]} opacity={0.55} scale={4} blur={2.6} far={1.6} resolution={256} color="#000000" />
    </group>
  );
}

/** Scales a model in/out depending on the active process step. */
function VariantSlot({ index, children, spinIn = true }: { index: number; children: ReactNode; spinIn?: boolean }) {
  const ref = useRef<THREE.Group>(null!);
  const s = useRef(index === 3 ? 1 : 0);
  useFrame((_, dt) => {
    const active = getVariant() === index;
    s.current += ((active ? 1 : 0) - s.current) * (1 - Math.exp(-Math.min(dt, 0.05) * 7));
    const v = s.current;
    ref.current.visible = v > 0.01;
    ref.current.scale.setScalar(Math.max(THREE.MathUtils.smoothstep(v, 0, 1), 0.0001));
    if (spinIn) ref.current.rotation.y = (1 - v) * -2.5;
  });
  return <group ref={ref}>{children}</group>;
}
