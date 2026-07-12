// Verified constants (SI). Numbers cross-checked against the research facet:
// a 1-solar-mass black hole → r_s ≈ 2953 m, S/k_B ≈ 1.0×10⁷⁷, T_H ≈ 6.2×10⁻⁸ K.
export const G = 6.674e-11; // m³ kg⁻¹ s⁻²
export const C = 2.998e8; // m/s
export const HBAR = 1.055e-34; // J·s
export const KB = 1.381e-23; // J/K
export const LP = 1.616e-35; // Planck length, m
export const MSUN = 1.989e30; // kg
export const AU = 1.496e11; // m
export const LY = 9.461e15; // m
export const YEAR_NOW = 1.38e10; // age of the universe, years
export const T_CMB = 2.725; // K

export const schwarzschild = (M: number) => (2 * G * M) / (C * C); // m
export const horizonArea = (M: number) => {
  const r = schwarzschild(M);
  return 4 * Math.PI * r * r;
};
export const entropyOverKb = (M: number) => horizonArea(M) / (4 * LP * LP); // S / k_B
export const hawkingT = (M: number) => (HBAR * C * C * C) / (8 * Math.PI * G * M * KB); // K
/** Evaporation lifetime (years), calibrated so a solar mass ≈ 2.1×10⁶⁷ yr, ∝ M³. */
export const lifetimeYears = (M: number) => 2.1e67 * Math.pow(M / MSUN, 3);

/** Format a length across cosmic scales. */
export function fmtLength(m: number): string {
  if (m >= 0.1 * LY) return `${(m / LY).toPrecision(3)} ly`;
  if (m >= 0.5 * AU) return `${(m / AU).toPrecision(3)} AU`;
  if (m >= 1000) return `${(m / 1000).toPrecision(3)} km`;
  return `${m.toPrecision(3)} m`;
}

/** Scientific notation with a superscript exponent, e.g. "1.05 × 10⁷⁷". */
export function sci(x: number, digits = 2): string {
  if (x === 0) return '0';
  let exp = Math.floor(Math.log10(x));
  let mant = x / Math.pow(10, exp);
  // Guard the round-up boundary: 9.999 must render "1.00 × 10ⁿ⁺¹", not "10.00 × 10ⁿ".
  if (Number(mant.toFixed(digits)) >= 10) {
    mant /= 10;
    exp += 1;
  }
  if (exp >= -3 && exp < 4) return x.toLocaleString(undefined, { maximumSignificantDigits: 3 });
  return `${mant.toFixed(digits)} × 10${sup(exp)}`;
}

const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
export function sup(n: number): string {
  const s = Math.abs(Math.round(n)).toString().split('').map((d) => SUPS[+d]).join('');
  return (n < 0 ? '⁻' : '') + s;
}
