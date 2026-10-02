/**
 * The one place GSAP is loaded. It is imported on demand in the browser only, so prerendering never touches it
 * and pages that do not animate never download it. ScrollTrigger is registered here, so registration can never
 * be skipped by accident.
 */
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';

type GsapModule = typeof import('gsap').gsap;
export interface Gsap {
  gsap: GsapModule;
  ScrollTrigger: typeof ScrollTriggerType;
}

let loading: Promise<Gsap> | null = null;

export function loadGsap(): Promise<Gsap> {
  loading ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([g, st]) => {
    g.gsap.registerPlugin(st.ScrollTrigger);
    return { gsap: g.gsap, ScrollTrigger: st.ScrollTrigger };
  });
  return loading;
}

/** True when the visitor has asked for reduced motion. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
