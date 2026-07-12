import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DEFAULT_CONFIG, type GasConfig, type GasMetrics } from '@/sim/engine';
import { useAnimationActive } from '@/anim/gate';
import { Particles } from './Particles';
import { BoxFrame } from './BoxFrame';

interface GasCanvasProps {
  config: Partial<GasConfig>;
  running: boolean;
  demonOn: boolean;
  colorBy: 'speed' | 'label';
  resetKey: number;
  onMetrics?: (m: GasMetrics) => void;
}

/** Self-contained R3F scene: lights, vessel, and the live gas. */
export function GasCanvas(props: GasCanvasProps) {
  const box = (props.config.box ?? DEFAULT_CONFIG.box) as [number, number, number];
  const partition = (props.config.mode ?? DEFAULT_CONFIG.mode) === 'demon';
  const doorFraction = props.config.doorFraction ?? DEFAULT_CONFIG.doorFraction;

  // R3F occasionally misses its first size measurement when it mounts inside a
  // sticky + AnimatePresence(absolute) container, leaving the canvas at the
  // 300×150 default (renders blank). Nudge a resize once laid out.
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event('resize'));
    const raf = requestAnimationFrame(fire);
    const t = setTimeout(fire, 150);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, []);

  // `?still` freezes the loop to an on-demand seeded frame (screenshots, and a
  // graceful mode for reduced-motion / low-power contexts).
  const still = typeof location !== 'undefined' && new URLSearchParams(location.search).has('still');
  // Pause the WebGL render loop entirely when the pinned visual is scrolled away.
  const active = useAnimationActive();

  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={still || !active ? 'demand' : 'always'}
      camera={{ position: [0, 2.2, 10.5], fov: 40 }}
      // preserveDrawingBuffer keeps the frame readable for screenshots/exports.
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#080a0f']} />
      <ambientLight intensity={0.45} />
      <pointLight position={[-6, 4, 6]} intensity={60} color="#5aa8ff" distance={40} />
      <pointLight position={[6, -3, 6]} intensity={60} color="#ff7a4d" distance={40} />
      <directionalLight position={[0, 8, 4]} intensity={0.6} />

      <BoxFrame box={box} partition={partition} doorFraction={doorFraction} />
      <Particles
        config={props.config}
        running={props.running}
        demonOn={props.demonOn}
        colorBy={props.colorBy}
        resetKey={props.resetKey}
        onMetrics={props.onMetrics}
      />

      {/* Orbit only with a mouse. On touch devices OrbitControls would capture
          the drag gesture and trap page scrolling on the pinned canvas, so we
          drop it there and let vertical drags scroll the page normally. */}
      {!coarsePointer && (
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={6}
          maxDistance={16}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.82}
        />
      )}
    </Canvas>
  );
}

const coarsePointer = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;
