import { useMemo } from 'react';
import * as THREE from 'three';

interface BoxFrameProps {
  box: [number, number, number];
  /** Draw the central wall + door (demon mode). */
  partition?: boolean;
  doorFraction?: number;
}

/** Wireframe box, and — for the demon — a translucent wall split by an open door. */
export function BoxFrame({ box, partition, doorFraction = 0.26 }: BoxFrameProps) {
  const [w, h, d] = box;
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), [w, h, d]);

  const doorHalf = (h / 2) * doorFraction;
  const upperH = h / 2 - doorHalf;
  const lowerH = h / 2 - doorHalf;

  return (
    <group>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#5a6377" transparent opacity={0.55} />
      </lineSegments>

      {/* Soft floor glow so the gas reads as sitting in a vessel. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -h / 2 - 0.001, 0]}>
        <planeGeometry args={[w, d]} />
        <meshBasicMaterial color="#0c1018" transparent opacity={0.5} />
      </mesh>

      {partition && (
        <group>
          {/* Wall above the door */}
          <mesh position={[0, doorHalf + upperH / 2, 0]}>
            <boxGeometry args={[0.05, upperH, d]} />
            <meshStandardMaterial color="#2a3040" transparent opacity={0.45} metalness={0.2} roughness={0.6} />
          </mesh>
          {/* Wall below the door */}
          <mesh position={[0, -doorHalf - lowerH / 2, 0]}>
            <boxGeometry args={[0.05, lowerH, d]} />
            <meshStandardMaterial color="#2a3040" transparent opacity={0.45} metalness={0.2} roughness={0.6} />
          </mesh>
          {/* Door lintels — a faint glow marking the gap the demon guards. */}
          <mesh position={[0, doorHalf, 0]}>
            <boxGeometry args={[0.08, 0.02, d]} />
            <meshBasicMaterial color="#ffd27a" toneMapped={false} />
          </mesh>
          <mesh position={[0, -doorHalf, 0]}>
            <boxGeometry args={[0.08, 0.02, d]} />
            <meshBasicMaterial color="#ffd27a" toneMapped={false} />
          </mesh>
        </group>
      )}
    </group>
  );
}
