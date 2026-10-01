import { smoothstep } from '../lib/terrain';

/** Scene coordinate u: 0 hero, 1 complexity, 2 evidence, 3 insight, 4 policy, 5 practice, 6 impact. */
const win = (u: number, a: number, b: number, c: number, d: number) => smoothstep(a, b, u) * (1 - smoothstep(c, d, u));

export interface Weights {
  /** Systems panes visibility (also the faint ghost behind the hero). */
  systems: number;
  links: number;
  strata: number;
  docs: number;
  /** Buildings fade-in, then rise. */
  buildings: number;
  rise: number;
  /** 0 rough ground, 1 ordered terraces. */
  order: number;
  /** Amber warmth in the contour lines near the end. */
  warm: number;
  /** Labels of institutions in the Practice scene. */
  siteLabels: number;
  /** Radiating reach pulse in the Impact scene. */
  pulse: number;
  /** Hero ghost amount: 1 at the very top of the page, 0 after a short scroll. */
  hero: number;
}

export function weightsFor(u: number): Weights {
  const hero = 1 - smoothstep(0.0, 0.8, u);
  return {
    systems: Math.max(0.3 * hero, win(u, 0.35, 0.95, 1.55, 2.0)),
    links: smoothstep(0.55, 1.0, u) * (1 - smoothstep(1.5, 1.95, u)),
    strata: win(u, 1.45, 1.95, 2.5, 2.92),
    docs: Math.max(0.22 * hero, win(u, 3.3, 3.85, 4.5, 5.1)),
    buildings: smoothstep(4.0, 4.6, u) * (1 - 0.5 * smoothstep(5.4, 6.0, u)),
    rise: smoothstep(4.2, 5.3, u),
    order: smoothstep(1.9, 3.1, u),
    warm: smoothstep(4.8, 6.0, u),
    siteLabels: win(u, 4.6, 5.0, 5.6, 5.95),
    pulse: smoothstep(5.2, 5.9, u),
    hero,
  };
}

/** Shared per-frame state. Every WebGL component calls update() first; it only does work once per frame. */
export class SceneDriver {
  u = 0;
  w: Weights = weightsFor(0);
  private lastT = -1;

  constructor(private target: { current: number }) {}

  update(elapsed: number, delta: number) {
    if (elapsed === this.lastT) return;
    this.lastT = elapsed;
    // Critically damped approach: follows the scroll closely but never snaps.
    const k = 1 - Math.exp(-Math.min(delta, 0.2) * 5.5);
    this.u += (this.target.current - this.u) * k;
    if (Math.abs(this.target.current - this.u) < 0.0004) this.u = this.target.current;
    this.w = weightsFor(this.u);
  }
}
