/**
 * A small, dependency-free 2.5D/3D hard-sphere gas.
 *
 * The same engine backs two of the chapter's interactives:
 *  - "mix"   : two labelled gases (one hot, one cold) sharing a box with no
 *              partition. Elastic collisions thermalise them and they diffuse
 *              into one another; the mixing-entropy readout climbs from 0 to 1.
 *  - "demon" : one gas, a central wall with a single door, and Maxwell's demon.
 *              When the demon is on it lets fast molecules to the right and slow
 *              ones to the left, opening a temperature gap the second law says
 *              shouldn't appear for free.
 *
 * Positions/velocities live in flat Float32Arrays so an InstancedMesh can read
 * them directly with zero per-frame allocation.
 */

export type SimMode = 'mix' | 'demon';

export interface GasConfig {
  count: number;
  mode: SimMode;
  /** Full box extents [W, H, D], centred on the origin. */
  box: [number, number, number];
  radius: number;
  /** Fraction of the box height the demon's door spans (demon mode). */
  doorFraction: number;
  /** Base thermal speed; hot/cold are scaled from this. */
  baseSpeed: number;
  demonOn: boolean;
  seed: number;
}

export const DEFAULT_CONFIG: GasConfig = {
  count: 220,
  mode: 'mix',
  box: [7, 4.2, 4.2],
  radius: 0.145,
  doorFraction: 0.26,
  baseSpeed: 1.15,
  demonOn: true,
  seed: 1,
};

function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface GasMetrics {
  /** Normalised mixing entropy, 0 (fully separated) → 1 (fully mixed). */
  mixing: number;
  /** Temperature proxy (mean KE) for each chamber, arbitrary units. */
  tempLeft: number;
  tempRight: number;
  /** Separation entropy, 1 (equal temps) → 0 (fully sorted). */
  separation: number;
  /** How many molecules the demon has waved through so far. */
  demonPasses: number;
}

export class GasEngine {
  readonly cfg: GasConfig;
  readonly n: number;
  readonly pos: Float32Array; // 3n
  readonly vel: Float32Array; // 3n
  readonly speed: Float32Array; // n (cached |v|)
  readonly label: Uint8Array; // n (mix: 1 = hot-origin / 0 = cold-origin)
  readonly half: [number, number, number];
  demonOn: boolean;
  demonPasses = 0;
  speedThreshold: number;

  private rng: () => number;
  // Reused grid buffers for the broad-phase collision pass.
  private grid = new Map<number, number[]>();

  constructor(cfg: Partial<GasConfig> = {}) {
    this.cfg = { ...DEFAULT_CONFIG, ...cfg };
    this.n = this.cfg.count;
    this.pos = new Float32Array(this.n * 3);
    this.vel = new Float32Array(this.n * 3);
    this.speed = new Float32Array(this.n);
    this.label = new Uint8Array(this.n);
    this.half = [this.cfg.box[0] / 2, this.cfg.box[1] / 2, this.cfg.box[2] / 2];
    this.demonOn = this.cfg.demonOn;
    this.speedThreshold = this.cfg.baseSpeed;
    this.rng = mulberry32(this.cfg.seed);
    this.reset();
  }

  reset(): void {
    this.rng = mulberry32(this.cfg.seed);
    this.demonPasses = 0;
    const [hx, hy, hz] = this.half;
    const r = this.cfg.radius;
    if (this.cfg.mode === 'mix') {
      for (let i = 0; i < this.n; i++) {
        const hot = i < this.n / 2;
        this.label[i] = hot ? 1 : 0;
        // Hot gas starts packed on the left, cold on the right.
        const x = hot
          ? -hx + r + this.rng() * (hx - 2 * r)
          : r + this.rng() * (hx - 2 * r);
        const y = (this.rng() * 2 - 1) * (hy - r);
        const z = (this.rng() * 2 - 1) * (hz - r);
        const mag = this.cfg.baseSpeed * (hot ? 1.7 : 0.55) * (0.85 + this.rng() * 0.3);
        this.setParticle(i, x, y, z, mag);
      }
      this.speedThreshold = this.cfg.baseSpeed;
    } else {
      let sum = 0;
      for (let i = 0; i < this.n; i++) {
        this.label[i] = 0;
        let x = (this.rng() * 2 - 1) * (hx - r);
        if (Math.abs(x) < r * 1.5) x += x >= 0 ? r * 1.5 : -r * 1.5;
        const y = (this.rng() * 2 - 1) * (hy - r);
        const z = (this.rng() * 2 - 1) * (hz - r);
        // A spread of speeds so there is something to sort.
        const mag = this.cfg.baseSpeed * (0.35 + this.rng() * 1.7);
        this.setParticle(i, x, y, z, mag);
        sum += mag;
      }
      this.speedThreshold = sum / this.n;
    }
  }

  private setParticle(i: number, x: number, y: number, z: number, mag: number): void {
    // Random direction on the unit sphere.
    let ux = this.rng() * 2 - 1;
    let uy = this.rng() * 2 - 1;
    let uz = this.rng() * 2 - 1;
    const len = Math.hypot(ux, uy, uz) || 1;
    ux /= len;
    uy /= len;
    uz /= len;
    this.pos[i * 3] = x;
    this.pos[i * 3 + 1] = y;
    this.pos[i * 3 + 2] = z;
    this.vel[i * 3] = ux * mag;
    this.vel[i * 3 + 1] = uy * mag;
    this.vel[i * 3 + 2] = uz * mag;
    this.speed[i] = mag;
  }

  /** Advance the simulation. dt is clamped and sub-stepped to avoid tunnelling. */
  step(dt: number): void {
    const maxV = this.maxSpeed();
    const maxStep = maxV > 0 ? this.cfg.radius / maxV : 1 / 60;
    const clamped = Math.min(dt, 1 / 30);
    const sub = Math.max(1, Math.min(6, Math.ceil(clamped / maxStep)));
    const h = clamped / sub;
    for (let s = 0; s < sub; s++) this.integrate(h);
  }

  private integrate(dt: number): void {
    const [hx, hy, hz] = this.half;
    const r = this.cfg.radius;
    const doorHalf = (hy * this.cfg.doorFraction);
    const partition = this.cfg.mode === 'demon';
    const p = this.pos;
    const v = this.vel;

    for (let i = 0; i < this.n; i++) {
      const ix = i * 3;
      const prevX = p[ix];
      p[ix] += v[ix] * dt;
      p[ix + 1] += v[ix + 1] * dt;
      p[ix + 2] += v[ix + 2] * dt;

      // Outer walls.
      if (p[ix] < -hx + r) { p[ix] = -hx + r; v[ix] = Math.abs(v[ix]); }
      else if (p[ix] > hx - r) { p[ix] = hx - r; v[ix] = -Math.abs(v[ix]); }
      if (p[ix + 1] < -hy + r) { p[ix + 1] = -hy + r; v[ix + 1] = Math.abs(v[ix + 1]); }
      else if (p[ix + 1] > hy - r) { p[ix + 1] = hy - r; v[ix + 1] = -Math.abs(v[ix + 1]); }
      if (p[ix + 2] < -hz + r) { p[ix + 2] = -hz + r; v[ix + 2] = Math.abs(v[ix + 2]); }
      else if (p[ix + 2] > hz - r) { p[ix + 2] = hz - r; v[ix + 2] = -Math.abs(v[ix + 2]); }

      // Central wall + door (demon mode only).
      if (partition && Math.sign(prevX) !== Math.sign(p[ix]) && prevX !== 0) {
        const inDoor = Math.abs(p[ix + 1]) < doorHalf;
        let allow: boolean;
        if (!inDoor) {
          allow = false;
        } else if (!this.demonOn) {
          allow = true; // door hangs open
        } else {
          const movingRight = v[ix] > 0;
          const fast = this.speed[i] > this.speedThreshold;
          // Fast molecules earn a pass to the right, slow ones to the left.
          allow = movingRight ? fast : !fast;
          if (allow) this.demonPasses++;
        }
        if (!allow) {
          const side = prevX >= 0 ? 1 : -1;
          p[ix] = side * (r + 0.03); // seat it back on its own side of the wall
          v[ix] = -v[ix];
        }
      }
    }

    this.collide(r);
    this.recomputeSpeeds();
  }

  /** Uniform-grid broad phase + equal-mass elastic resolution. */
  private collide(r: number): void {
    const cell = 2 * r;
    const inv = 1 / cell;
    const [hx, hy, hz] = this.half;
    const p = this.pos;
    const v = this.vel;
    const partition = this.cfg.mode === 'demon'; // molecules on opposite sides can't collide through the wall
    const grid = this.grid;
    grid.clear();
    // Cell counts stay well under 1024 per axis for the boxes we use, so a
    // simple positional hash (offset by 1 to admit the -1 neighbour) is unique.
    const key = (cx: number, cy: number, cz: number) =>
      (cx + 1) + (cy + 1) * 1024 + (cz + 1) * 1048576;

    for (let i = 0; i < this.n; i++) {
      const cx = Math.floor((p[i * 3] + hx) * inv);
      const cy = Math.floor((p[i * 3 + 1] + hy) * inv);
      const cz = Math.floor((p[i * 3 + 2] + hz) * inv);
      const k = key(cx, cy, cz);
      let bucket = grid.get(k);
      if (!bucket) { bucket = []; grid.set(k, bucket); }
      bucket.push(i);
    }

    const d2max = (2 * r) * (2 * r);
    for (let i = 0; i < this.n; i++) {
      const ix = i * 3;
      const cx = Math.floor((p[ix] + hx) * inv);
      const cy = Math.floor((p[ix + 1] + hy) * inv);
      const cz = Math.floor((p[ix + 2] + hz) * inv);
      for (let ox = -1; ox <= 1; ox++)
        for (let oy = -1; oy <= 1; oy++)
          for (let oz = -1; oz <= 1; oz++) {
            const bucket = grid.get(key(cx + ox, cy + oy, cz + oz));
            if (!bucket) continue;
            for (const j of bucket) {
              if (j <= i) continue;
              const jx = j * 3;
              if (partition && p[ix] * p[jx] < 0) continue; // opposite sides of the wall
              const dx = p[ix] - p[jx];
              const dy = p[ix + 1] - p[jx + 1];
              const dz = p[ix + 2] - p[jx + 2];
              const d2 = dx * dx + dy * dy + dz * dz;
              if (d2 >= d2max || d2 === 0) continue;
              const dist = Math.sqrt(d2);
              const nxn = dx / dist, nyn = dy / dist, nzn = dz / dist;
              const dvx = v[ix] - v[jx];
              const dvy = v[ix + 1] - v[jx + 1];
              const dvz = v[ix + 2] - v[jx + 2];
              const vn = dvx * nxn + dvy * nyn + dvz * nzn;
              if (vn < 0) {
                // Equal masses: swap the velocity components along the normal.
                v[ix] -= vn * nxn; v[ix + 1] -= vn * nyn; v[ix + 2] -= vn * nzn;
                v[jx] += vn * nxn; v[jx + 1] += vn * nyn; v[jx + 2] += vn * nzn;
              }
              // Separate so they don't stick together.
              const push = (2 * r - dist) * 0.5;
              p[ix] += nxn * push; p[ix + 1] += nyn * push; p[ix + 2] += nzn * push;
              p[jx] -= nxn * push; p[jx + 1] -= nyn * push; p[jx + 2] -= nzn * push;
            }
          }
    }
  }

  private recomputeSpeeds(): void {
    const v = this.vel;
    for (let i = 0; i < this.n; i++) {
      this.speed[i] = Math.hypot(v[i * 3], v[i * 3 + 1], v[i * 3 + 2]);
    }
  }

  private maxSpeed(): number {
    let m = 0;
    for (let i = 0; i < this.n; i++) if (this.speed[i] > m) m = this.speed[i];
    return m;
  }

  metrics(): GasMetrics {
    return {
      mixing: this.mixingEntropy(),
      ...this.chamberTemps(),
      demonPasses: this.demonPasses,
    };
  }

  /** Coarse-grained mixing entropy of the two labels, S = k·log W, normalised. */
  private mixingEntropy(): number {
    const gx = 4, gy = 2, gz = 2; // ~14 particles/cell at count=220 → meaningful mixing statistics
    const [hx, hy, hz] = this.half;
    const cells = gx * gy * gz;
    const a = new Uint16Array(cells);
    const b = new Uint16Array(cells);
    for (let i = 0; i < this.n; i++) {
      const cx = Math.min(gx - 1, Math.floor(((this.pos[i * 3] + hx) / (2 * hx)) * gx));
      const cy = Math.min(gy - 1, Math.floor(((this.pos[i * 3 + 1] + hy) / (2 * hy)) * gy));
      const cz = Math.min(gz - 1, Math.floor(((this.pos[i * 3 + 2] + hz) / (2 * hz)) * gz));
      const c = (cx * gy + cy) * gz + cz;
      if (this.label[i]) a[c]++; else b[c]++;
    }
    let weighted = 0;
    let total = 0;
    for (let c = 0; c < cells; c++) {
      const occ = a[c] + b[c];
      if (occ === 0) continue;
      const pa = a[c] / occ;
      let h = 0;
      if (pa > 0 && pa < 1) h = -pa * Math.log2(pa) - (1 - pa) * Math.log2(1 - pa);
      weighted += h * occ;
      total += occ;
    }
    return total > 0 ? weighted / total : 0;
  }

  private chamberTemps(): { tempLeft: number; tempRight: number; separation: number } {
    let keL = 0, keR = 0, nL = 0, nR = 0;
    for (let i = 0; i < this.n; i++) {
      const ke = this.speed[i] * this.speed[i];
      if (this.pos[i * 3] < 0) { keL += ke; nL++; } else { keR += ke; nR++; }
    }
    const tempLeft = nL ? keL / nL : 0;
    const tempRight = nR ? keR / nR : 0;
    const denom = tempLeft + tempRight;
    const separation = denom > 0 ? 1 - Math.abs(tempLeft - tempRight) / denom : 1;
    return { tempLeft, tempRight, separation };
  }
}
