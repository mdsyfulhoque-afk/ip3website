import { useEffect, type MutableRefObject } from 'react';

/**
 * Turns scroll position into a continuous "scene coordinate" u.
 * u = 0 when the hero is centred in the viewport, 1 when the first scene is centred, and so on.
 * Uses each section's real position, so scenes of different heights still line up with the camera.
 */
export function useJourneyProgress(
  sections: MutableRefObject<(HTMLElement | null)[]>,
  target: MutableRefObject<number>,
  onActive: (scene: number) => void,
) {
  useEffect(() => {
    let raf = 0;
    let lastActive = -1;

    const compute = () => {
      raf = 0;
      const els = sections.current;
      const n = els.length;
      if (n < 2 || els.some((e) => !e)) return;
      const mid = window.scrollY + window.innerHeight * 0.5;
      const centres = els.map((el) => {
        const r = el!.getBoundingClientRect();
        return r.top + window.scrollY + r.height / 2;
      });
      let u: number;
      if (mid <= centres[0]!) u = 0;
      else if (mid >= centres[n - 1]!) u = n - 1;
      else {
        let i = 0;
        while (i < n - 2 && mid >= centres[i + 1]!) i++;
        u = i + (mid - centres[i]!) / (centres[i + 1]! - centres[i]!);
      }
      target.current = u;
      const active = Math.round(u);
      if (active !== lastActive) {
        lastActive = active;
        onActive(active);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    const ro = new ResizeObserver(schedule);
    ro.observe(document.body);
    compute();
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sections, target, onActive]);
}
