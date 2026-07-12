import * as THREE from 'three';

// Three-stop thermal ramp: glacier-blue (cold) → pale (lukewarm) → ember (hot).
const COLD = new THREE.Color('#3aa0ff');
const MID = new THREE.Color('#d7dae6');
const HOT = new THREE.Color('#ff5330');

// Distinct hues for the two labelled gases in the mixing sim.
const LABEL_HOT = new THREE.Color('#ff6a43');
const LABEL_COLD = new THREE.Color('#42a6ff');

/** Write the temperature colour for a normalised speed t∈[0,1] into `out`. */
export function speedColorInto(out: THREE.Color, t: number): THREE.Color {
  const c = Math.min(1, Math.max(0, t));
  if (c < 0.5) out.copy(COLD).lerp(MID, c * 2);
  else out.copy(MID).lerp(HOT, (c - 0.5) * 2);
  return out;
}

/** Colour a molecule by which gas it started in, brightened a touch when fast. */
export function labelColorInto(out: THREE.Color, label: number, brightness: number): THREE.Color {
  out.copy(label ? LABEL_HOT : LABEL_COLD);
  out.multiplyScalar(0.8 + 0.35 * Math.min(1, Math.max(0, brightness)));
  return out;
}
