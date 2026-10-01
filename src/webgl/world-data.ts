import { CatmullRomCurve3, QuadraticBezierCurve3, Vector3 } from 'three';
import { evidenceLayers, systemLinks, systems, type SystemId } from '../content/journey';
import { mulberry32, SITE, terrainHeight } from '../lib/terrain';

/* ------------------------------------------------------------------ systems (Complexity) */

export const PANE = { w: 9, h: 5.4, y: 3.3 } as const;

/** Panes stand upright, receding in depth, so lateral camera movement reveals the layering. */
export const paneLayout = systems.map((s, i) => ({
  id: s.id,
  x: i % 2 === 0 ? -0.55 : 0.55,
  y: PANE.y,
  z: 3.0 - i * 1.85,
  rotY: i % 2 === 0 ? 0.05 : -0.05,
}));

/** A different pattern on each plane so systems are told apart without relying on colour. */
export const SYSTEM_PATTERN: Record<SystemId, number> = {
  economy: 0, // grid
  climate: 4, // waves
  education: 1, // dots
  cities: 5, // cells
  energy: 2, // hatch
  institutions: 3, // rings
};

const NODE_LOCAL: Record<SystemId, [number, number]> = {
  economy: [-2.4, 1.4],
  climate: [1.9, 1.0],
  education: [-1.2, -0.9],
  cities: [2.7, -1.2],
  energy: [0.2, 1.7],
  institutions: [-2.7, -0.3],
};

export function nodeWorld(i: number): Vector3 {
  const p = paneLayout[i]!;
  const [lx, ly] = NODE_LOCAL[p.id];
  return new Vector3(p.x + lx * Math.cos(p.rotY), p.y + ly, p.z - lx * Math.sin(p.rotY));
}

export const nodes = systems.map((_, i) => nodeWorld(i));

/** Each relationship is an arc between two panes. */
export const linkArcs: { a: number; b: number; points: Vector3[] }[] = systemLinks.map(([ida, idb]) => {
  const a = systems.findIndex((s) => s.id === ida);
  const b = systems.findIndex((s) => s.id === idb);
  const pa = nodes[a]!;
  const pb = nodes[b]!;
  const mid = pa.clone().add(pb).multiplyScalar(0.5);
  mid.y += 0.55 + pa.distanceTo(pb) * 0.08;
  const curve = new QuadraticBezierCurve3(pa, mid, pb);
  return { a, b, points: curve.getPoints(20) };
});

/* ------------------------------------------------------------------ evidence strata */

export const STRATA = { w: 8.6, d: 5.2, topY: 5.0, step: 0.95 } as const;
/** Where the stack sits in the world. */
export const STRATA_POS = { x: -0.6, z: 0.2, rotY: -0.18 } as const;
export const STRATA_PATTERN = [5, 1, 0, 3, 2]; // field, survey, administrative, maps, methods

export const strataLayout = evidenceLayers.map((l, i) => ({
  id: l.id,
  name: l.name,
  y: STRATA.topY - i * STRATA.step,
  type: STRATA_PATTERN[i]!,
}));

/* ------------------------------------------------------------------ flow of policy toward the site */

export const flowCurve = new CatmullRomCurve3(
  [
    new Vector3(-1.4, 7.4, 3.0),
    new Vector3(0.2, 5.4, 2.7),
    new Vector3(1.4, 3.4, 2.3),
    new Vector3(2.1, 1.7, 1.9),
    new Vector3(2.5, 0.6, 1.4),
  ],
  false,
  'catmullrom',
  0.5,
);

/* ------------------------------------------------------------------ institutions and services (Practice) */

export interface Building {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  delay: number;
}

export interface SiteCluster {
  name: string;
  x: number;
  z: number;
  top: number;
}

const clusterDefs = [
  { name: 'Ministry or agency', x: 0.4, z: -1.2, main: [1.5, 1.1, 1.6] as const, annex: 3 },
  { name: 'School', x: 3.0, z: 1.9, main: [1.7, 0.9, 0.75] as const, annex: 2 },
  { name: 'Clinic', x: 4.7, z: -0.7, main: [1.0, 1.0, 0.95] as const, annex: 2 },
  { name: 'Municipal market', x: 1.2, z: 3.1, main: [1.4, 0.9, 0.55] as const, annex: 3 },
];

export function generateSite(): { buildings: Building[]; clusters: SiteCluster[] } {
  const rnd = mulberry32(2025);
  const buildings: Building[] = [];
  const clusters: SiteCluster[] = [];
  clusterDefs.forEach((c, ci) => {
    const [w, d, h] = c.main;
    buildings.push({ x: c.x, z: c.z, w, d, h, delay: ci * 0.12 });
    clusters.push({ name: c.name, x: c.x, z: c.z, top: SITE.y + h });
    for (let k = 0; k < c.annex; k++) {
      const ang = (k / c.annex) * Math.PI * 2 + rnd() * 0.8;
      const rad = 1.15 + rnd() * 0.5;
      buildings.push({
        x: c.x + Math.cos(ang) * rad,
        z: c.z + Math.sin(ang) * rad,
        w: 0.45 + rnd() * 0.4,
        d: 0.4 + rnd() * 0.4,
        h: 0.22 + rnd() * 0.32,
        delay: ci * 0.12 + 0.1 + rnd() * 0.25,
      });
    }
  });
  // Houses between the institutions: the households the services exist for.
  for (let i = 0; i < 16; i++) {
    const x = SITE.cx + (rnd() - 0.5) * 7.4;
    const z = SITE.cz + (rnd() - 0.5) * 6.0;
    const tooClose = buildings.some((b) => Math.hypot(b.x - x, b.z - z) < 0.95);
    if (tooClose) continue;
    buildings.push({ x, z, w: 0.3 + rnd() * 0.2, d: 0.3 + rnd() * 0.2, h: 0.14 + rnd() * 0.12, delay: 0.45 + rnd() * 0.45 });
  }
  return { buildings, clusters };
}

/* ------------------------------------------------------------------ signals */

export interface SignalData {
  count: number;
  scatter: Float32Array;
  link: Float32Array;
  strata: Float32Array;
  pattern: Float32Array;
  flow: Float32Array;
  serve: Float32Array;
  rand: Float32Array;
  amber: Float32Array;
}

/**
 * Every signal has one resting position per story state. The vertex shader moves each one
 * between them as the scene coordinate advances, so there is no per-frame CPU work.
 */
export function generateSignals(count: number): SignalData {
  const rnd = mulberry32(7331);
  const gauss = () => (rnd() + rnd() + rnd() - 1.5) * 1.15;
  const mk = () => new Float32Array(count * 3);
  const d: SignalData = {
    count,
    scatter: mk(),
    link: mk(),
    strata: mk(),
    pattern: mk(),
    flow: mk(),
    serve: mk(),
    rand: new Float32Array(count),
    amber: new Float32Array(count),
  };

  const settlements = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2 + rnd() * 0.5;
    const r = 8.5 + rnd() * 6.5;
    return { x: Math.cos(a) * r + 1, z: Math.sin(a) * r * 0.8 + 0.5 };
  });

  for (let i = 0; i < count; i++) {
    const o = i * 3;
    d.rand[i] = rnd();
    d.amber[i] = rnd() < 0.3 ? 1 : 0;

    // scatter: a loose volume above the landscape
    d.scatter[o] = (rnd() - 0.5) * 20;
    d.scatter[o + 1] = 0.5 + rnd() * 7.5;
    d.scatter[o + 2] = -9 + rnd() * 15;

    // links: along an arc between two related panes
    const arc = linkArcs[i % linkArcs.length]!;
    const t = rnd() * (arc.points.length - 1);
    const i0 = Math.floor(t);
    const p0 = arc.points[i0]!;
    const p1 = arc.points[Math.min(i0 + 1, arc.points.length - 1)]!;
    const f = t - i0;
    d.link[o] = p0.x + (p1.x - p0.x) * f + gauss() * 0.06;
    d.link[o + 1] = p0.y + (p1.y - p0.y) * f + gauss() * 0.06;
    d.link[o + 2] = p0.z + (p1.z - p0.z) * f + gauss() * 0.06;

    // strata: points lying within one of the five evidence slabs, each with its own texture of arrangement
    const si = i % strataLayout.length;
    const layer = strataLayout[si]!;
    let sx: number;
    let sz: number;
    switch (si) {
      case 0: // field: loose clusters
        sx = (Math.floor(rnd() * 3) - 1) * 2.4 + gauss() * 0.7;
        sz = (Math.floor(rnd() * 2) - 0.5) * 2 + gauss() * 0.6;
        break;
      case 1: // survey: a jittered lattice
        sx = (Math.floor(rnd() * 14) / 13 - 0.5) * (STRATA.w - 1) + gauss() * 0.05;
        sz = (Math.floor(rnd() * 7) / 6 - 0.5) * (STRATA.d - 1) + gauss() * 0.05;
        break;
      case 2: // administrative: rows
        sx = (rnd() - 0.5) * (STRATA.w - 1);
        sz = (Math.floor(rnd() * 8) / 7 - 0.5) * (STRATA.d - 1);
        break;
      case 3: {
        // maps: concentric rings
        const ring = 0.7 + Math.floor(rnd() * 4) * 0.62;
        const ang = rnd() * Math.PI * 2;
        sx = Math.cos(ang) * ring * 1.5;
        sz = Math.sin(ang) * ring;
        break;
      }
      default: {
        // methods: paired bands
        const band = rnd() < 0.5 ? -0.55 : 0.55;
        sx = (rnd() - 0.5) * (STRATA.w - 1.2);
        sz = sx * 0.28 + band + gauss() * 0.06;
      }
    }
    d.strata[o] = sx;
    d.strata[o + 1] = layer.y + 0.04;
    d.strata[o + 2] = sz;

    // pattern: two diverging bands (the "did it work" shape), plus a marker where the programme starts
    const marker = rnd() < 0.06;
    if (marker) {
      d.pattern[o] = 0;
      d.pattern[o + 1] = 1.2 + rnd() * 4.2;
      d.pattern[o + 2] = (rnd() - 0.5) * 1.6;
    } else {
      const x = (rnd() - 0.5) * 8.8;
      const supported = rnd() < 0.5;
      const base = 2.5 + 0.24 * x;
      const lift = supported ? Math.max(0, x) * 0.5 : 0.65 + Math.max(0, x) * 0.05;
      d.pattern[o] = x;
      d.pattern[o + 1] = base + lift - (supported ? 0.55 : 0) + gauss() * 0.1;
      d.pattern[o + 2] = (rnd() - 0.5) * 1.8;
    }

    // flow: a tube along the path policy travels toward the institutions
    const tf = Math.pow(rnd(), 0.8);
    const pf = flowCurve.getPoint(tf);
    d.flow[o] = pf.x + gauss() * 0.28;
    d.flow[o + 1] = pf.y + gauss() * 0.22;
    d.flow[o + 2] = pf.z + gauss() * 0.28;

    // serve: amber signals sit where people are served; the rest stay as faint ground signals
    if (d.amber[i] === 1) {
      let x: number;
      let z: number;
      if (rnd() < 0.34) {
        x = SITE.cx + (rnd() - 0.5) * 7.4;
        z = SITE.cz + (rnd() - 0.5) * 6.0;
      } else {
        const s = settlements[Math.floor(rnd() * settlements.length)]!;
        x = s.x + gauss() * 0.9;
        z = s.z + gauss() * 0.9;
      }
      d.serve[o] = x;
      d.serve[o + 1] = terrainHeight(x, z, 1) + 0.22 + rnd() * 0.12;
      d.serve[o + 2] = z;
    } else {
      d.serve[o] = d.scatter[o]!;
      d.serve[o + 1] = d.scatter[o + 1]!;
      d.serve[o + 2] = d.scatter[o + 2]!;
    }
  }
  return d;
}

/* ------------------------------------------------------------------ camera */

export interface CameraKey {
  pos: [number, number, number];
  look: [number, number, number];
}

/** One key per scene coordinate. The rig blends smoothly between neighbours. */
export const CAMERA_KEYS: CameraKey[] = [
  { pos: [1.2, 6.4, 17.5], look: [0.6, 1.9, 0.0] }, // 0 hero
  { pos: [5.0, 4.4, 15.4], look: [0.0, 3.1, -1.0] }, // 1 complexity
  { pos: [-3.2, 7.4, 14.2], look: [0.4, 2.7, 0.0] }, // 2 evidence
  { pos: [0.0, 3.6, 19.5], look: [-2.2, 0.9, 0.0] }, // 3 insight
  { pos: [-2.4, 5.6, 12.6], look: [0.4, 2.6, 0.8] }, // 4 policy
  { pos: [-1.0, 7.0, 10.8], look: [2.4, 0.4, 0.9] }, // 5 practice
  { pos: [3.0, 11.5, 13.5], look: [2.6, 0.0, 0.6] }, // 6 impact
];
