import { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { GasEngine, type GasConfig, type GasMetrics } from '@/sim/engine';
import { speedColorInto, labelColorInto } from '@/sim/colors';

interface ParticlesProps {
  config: Partial<GasConfig>;
  running: boolean;
  demonOn: boolean;
  colorBy: 'speed' | 'label';
  /** Change this value to reseed/reset the gas. */
  resetKey: number;
  onMetrics?: (m: GasMetrics) => void;
}

const dummy = new THREE.Object3D();
const scratch = new THREE.Color();

/**
 * Owns a GasEngine and renders its molecules as a single InstancedMesh,
 * stepping the physics and refreshing per-instance transforms/colours each
 * frame. Metrics are sampled at ~8 Hz so the React HUD doesn't rerender wildly.
 */
export function Particles({ config, running, demonOn, colorBy, resetKey, onMetrics }: ParticlesProps) {
  const engine = useMemo(() => new GasEngine(config), [config]);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const metricClock = useRef(0);
  const colorRef = useMemo(() => config.baseSpeed ?? 1.15, [config.baseSpeed]);
  const invalidate = useThree((s) => s.invalidate);

  // Reseed on demand.
  useEffect(() => {
    engine.reset();
    metricClock.current = 0;
  }, [engine, resetKey]);

  // Seed transforms/colours as soon as the mesh mounts, and request a draw so a
  // correct frame appears even when the loop is paused / on-demand.
  useEffect(() => {
    if (meshRef.current) {
      paint(meshRef.current, engine, colorBy, colorRef);
      if (onMetrics) onMetrics(engine.metrics());
      invalidate();
    }
  }, [engine, colorBy, colorRef, resetKey, invalidate, onMetrics]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    engine.demonOn = demonOn;
    if (running) engine.step(delta);
    paint(mesh, engine, colorBy, colorRef);

    if (onMetrics) {
      metricClock.current += delta;
      if (metricClock.current >= 0.12) {
        metricClock.current = 0;
        onMetrics(engine.metrics());
      }
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, engine.n]}>
      <sphereGeometry args={[engine.cfg.radius, 16, 16]} />
      {/* Unlit + toneMapped off so each molecule's hot/cold instance colour
          stays vivid against the near-black vessel. NB: no `vertexColors` — for
          an InstancedMesh, setColorAt drives colour via `instanceColor`
          (USE_INSTANCING_COLOR). Turning on vertexColors would also flip on
          USE_COLOR, whose missing per-vertex `color` attribute zeroes the
          colour to black. instanceColor is seeded in the mount effect above. */}
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

function paint(
  mesh: THREE.InstancedMesh,
  engine: GasEngine,
  colorBy: 'speed' | 'label',
  base: number,
) {
  const { pos, speed, label, n } = engine;
  const sMax = base * 2.3;
  for (let i = 0; i < n; i++) {
    dummy.position.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
    const t = speed[i] / sMax;
    if (colorBy === 'label') labelColorInto(scratch, label[i], t);
    else speedColorInto(scratch, t);
    mesh.setColorAt(i, scratch);
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
}
