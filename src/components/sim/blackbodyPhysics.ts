// Verified constants (SI), CODATA values.
export const H = 6.62607015e-34; // Planck's constant, J·s
export const C_LIGHT = 2.99792458e8; // speed of light, m/s
export const KB = 1.380649e-23; // Boltzmann's constant, J/K
export const WIEN_B = 2.897771955e-3; // Wien displacement constant, m·K

/**
 * Planck's law — spectral radiance B(λ,T), W·sr⁻¹·m⁻³. `hScale` lets the
 * reader dial Planck's constant from 1 (the real universe) down to 0 (a
 * universe where energy is perfectly continuous). As hScale→0 this
 * expression is mathematically forced into the Rayleigh–Jeans law below —
 * expand e^x−1 ≈ x for small x and the h cancels out completely. That
 * convergence is not a UI trick; it is the actual limit the 1900 formula
 * takes when quantization is switched off.
 */
export function planckRadiance(lambda: number, T: number, hScale = 1): number {
  const h = H * hScale;
  if (h <= 0) return rayleighJeans(lambda, T);
  const x = (h * C_LIGHT) / (lambda * KB * T);
  if (x > 700) return 0; // e^700 already dwarfs any representable radiance
  if (x < 1e-8) return rayleighJeans(lambda, T); // avoid 0/0 as x→0
  return (2 * h * C_LIGHT * C_LIGHT) / (Math.pow(lambda, 5) * (Math.exp(x) - 1));
}

/**
 * The classical (pre-1900) prediction: cavity radiation with every mode
 * carrying an equal share kT of energy (equipartition), no restriction on
 * how finely energy can be divided. Matches Planck's law closely at long
 * wavelengths (where hc/λkT ≪ 1) and diverges to infinity as λ→0 — the
 * ultraviolet catastrophe. Independent of h by construction.
 */
export function rayleighJeans(lambda: number, T: number): number {
  return (2 * C_LIGHT * KB * T) / Math.pow(lambda, 4);
}

/** Wien's displacement law — the wavelength at which the true (h=1) Planck curve peaks. */
export function wienPeak(T: number): number {
  return WIEN_B / T;
}

/**
 * How many times larger the classical prediction is than reality at a given
 * wavelength — turns "ultraviolet catastrophe" into a number instead of a
 * shape. Guards the reality=0 case (deep in Wien's-law territory) by
 * reporting Infinity rather than NaN.
 */
export function catastropheRatio(lambda: number, T: number): number {
  const real = planckRadiance(lambda, T, 1);
  const classical = rayleighJeans(lambda, T);
  if (real <= 0) return Infinity;
  return classical / real;
}

// ---------- color: what the object actually looks like ----------

/** Asymmetric Gaussian, the building block of the CIE fit below. */
function gauss(x: number, mu: number, s1: number, s2: number): number {
  const s = x < mu ? s1 : s2;
  const t = (x - mu) / s;
  return Math.exp(-0.5 * t * t);
}

// CIE 1931 2° standard-observer color-matching functions, multi-lobe Gaussian
// fit (Wyman, Sloan & Shirley, "Simple Analytic Approximations to the CIE XYZ
// Color Matching Functions," JCGT 2013) — an analytic stand-in for the
// tabulated CIE data, accurate to within a few percent across the visible
// range, needing no lookup table.
function cieX(nm: number): number {
  return 1.056 * gauss(nm, 599.8, 37.9, 31.0) + 0.362 * gauss(nm, 442.0, 16.0, 26.7) - 0.065 * gauss(nm, 501.1, 20.4, 26.2);
}
function cieY(nm: number): number {
  return 0.821 * gauss(nm, 568.8, 46.9, 40.5) + 0.286 * gauss(nm, 530.9, 16.3, 31.1);
}
function cieZ(nm: number): number {
  return 1.217 * gauss(nm, 437.0, 11.8, 36.0) + 0.681 * gauss(nm, 459.0, 26.0, 13.8);
}

/**
 * The color a real blackbody at temperature T actually appears — computed by
 * integrating the TRUE Planck curve (h at full strength, independent of
 * whatever hScale the reader has dialled for the comparison curve) against
 * the CIE color-matching functions, exactly as a spectrophotometer would.
 * Chromaticity (hue) comes straight from the physics; only the overall
 * brightness is normalized, since a literal blackbody at 1000K radiates a
 * visible-light chromaticity that is real but far too dim to render as
 * anything but black on a screen — we want to show the correct *color*, the
 * way "what does a 1000K stove element look like" actually reads to an eye
 * adapted to the dark, not the physically tiny visible-band power.
 */
export function blackbodyColor(T: number): [number, number, number] {
  let X = 0, Y = 0, Z = 0;
  for (let nm = 380; nm <= 780; nm += 5) {
    const radiance = planckRadiance(nm * 1e-9, T, 1);
    X += radiance * cieX(nm);
    Y += radiance * cieY(nm);
    Z += radiance * cieZ(nm);
  }
  const sum = X + Y + Z;
  if (sum <= 0 || Y <= 0) return [10, 10, 14]; // T so low there's no visible emission at all

  const x = X / sum;
  const y = Y / sum;
  const Yd = 1;
  const Xd = (x / y) * Yd;
  const Zd = ((1 - x - y) / y) * Yd;

  // XYZ → linear sRGB (standard D65 matrix)
  let r = 3.2406 * Xd - 1.5372 * Yd - 0.4986 * Zd;
  let g = -0.9689 * Xd + 1.8758 * Yd + 0.0415 * Zd;
  let b = 0.0557 * Xd - 0.2040 * Yd + 1.0570 * Zd;
  r = Math.max(0, r); g = Math.max(0, g); b = Math.max(0, b);

  // Normalize so the brightest channel reaches full scale — we fixed Yd=1
  // arbitrarily above, so only the ratio between channels (the hue) is
  // physical; this rescaling picks a legible on-screen brightness for it.
  const maxc = Math.max(r, g, b, 1e-6);
  r /= maxc; g /= maxc; b /= maxc;

  const enc = (c: number) => {
    const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
    return Math.round(Math.min(1, Math.max(0, v)) * 255);
  };
  return [enc(r), enc(g), enc(b)];
}

/** Format a wavelength across the ranges this sim actually spans. */
export function fmtWavelength(m: number): string {
  const nm = m * 1e9;
  if (nm >= 1000) return `${(nm / 1000).toPrecision(3)} μm`;
  return `${nm.toPrecision(3)} nm`;
}

/** Scientific notation with a superscript exponent, e.g. "4.30 × 10³". */
const SUPS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
function sup(n: number): string {
  const s = Math.abs(Math.round(n)).toString().split('').map((d) => SUPS[+d]).join('');
  return (n < 0 ? '⁻' : '') + s;
}
export function sci(x: number, digits = 2): string {
  if (!isFinite(x)) return '∞';
  if (x === 0) return '0';
  let exp = Math.floor(Math.log10(x));
  let mant = x / Math.pow(10, exp);
  if (Number(mant.toFixed(digits)) >= 10) { mant /= 10; exp += 1; }
  if (exp >= -1 && exp < 4) return x.toLocaleString(undefined, { maximumSignificantDigits: 3 });
  return `${mant.toFixed(digits)} × 10${sup(exp)}`;
}
