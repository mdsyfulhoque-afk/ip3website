/**
 * Deterministic terrain used by the WebGL landscape and by the static contour poster.
 * Pure functions, no DOM or three.js imports, so scripts can run it under tsx.
 */

export const TERRAIN_SIZE = 44;

/** The plateau where institutions and services are placed in the Practice scene. */
export const SITE = { cx: 2.6, cz: 1.2, rx: 5.2, rz: 4.2, y: 0.22 } as const;

function hash(ix: number, iy: number, seed: number): number {
  let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(seed + 1, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

export const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function valueNoise(x: number, y: number, seed: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const a = hash(ix, iy, seed);
  const b = hash(ix + 1, iy, seed);
  const c = hash(ix, iy + 1, seed);
  const d = hash(ix + 1, iy + 1, seed);
  const u = smooth(fx);
  const v = smooth(fy);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

export function fbm(x: number, y: number, seed: number, octaves = 5): number {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise(x * freq, y * freq, seed + i * 17);
    norm += amp;
    amp *= 0.5;
    freq *= 2.03;
  }
  return sum / norm;
}

export function ridged(x: number, y: number, seed: number, octaves = 5): number {
  let amp = 0.55;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    const n = 1 - Math.abs(2 * valueNoise(x * freq, y * freq, seed + i * 31) - 1);
    sum += amp * n * n;
    norm += amp;
    amp *= 0.5;
    freq *= 2.1;
  }
  return sum / norm;
}

/** 0 in the implementation plateau, 1 far from it. */
export function siteMask(x: number, z: number): number {
  const d = Math.hypot((x - SITE.cx) / SITE.rx, (z - SITE.cz) / SITE.rz);
  return smoothstep(0.75, 1.35, d);
}

/** Lowers the middle of the scene so layers and sheets float above a basin framed by ridges. */
function basinMask(x: number, z: number): number {
  const d = Math.hypot(x * 0.085, z * 0.14);
  return lerp(0.22, 1, smoothstep(0.35, 1.05, d));
}

function edgeMask(x: number, z: number): number {
  return 1 - smoothstep(17, 22, Math.hypot(x, z));
}

/** Turbulent, ridged ground: the world before it is understood. */
export function roughHeight(x: number, z: number): number {
  const nx = x * 0.11;
  const nz = z * 0.11;
  const r = ridged(nx + 3.1, nz - 1.7, 7, 4);
  const base = Math.max(0, r - 0.27) * 5.2 + fbm(nx * 2.4, nz * 2.4, 3, 3) * 0.35;
  const h = base * edgeMask(x, z) * basinMask(x, z);
  return lerp(SITE.y, h, siteMask(x, z));
}

function terrace(v: number, steps: number, sharp: number): number {
  const f = v * steps;
  const i = Math.floor(f);
  const t = f - i;
  const k = smoothstep(0.5 - sharp / 2, 0.5 + sharp / 2, t);
  return (i + k) / steps;
}

/** The same ground after it has been surveyed and ordered into terraces. */
export function calmHeight(x: number, z: number): number {
  const nx = x * 0.11;
  const nz = z * 0.11;
  const r = ridged(nx + 3.1, nz - 1.7, 7, 3);
  const v = Math.min(1, Math.max(0, (r - 0.22) * 1.35));
  const h = terrace(v, 7, 0.45) * 3.1;
  const out = h * edgeMask(x, z) * basinMask(x, z);
  return lerp(SITE.y, out, siteMask(x, z));
}

export function terrainHeight(x: number, z: number, order: number): number {
  return lerp(roughHeight(x, z), calmHeight(x, z), order);
}

/** Small seeded PRNG so random layouts are stable between renders and builds. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
