import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { loadGsap, prefersReducedMotion } from '../../lib/gsap';

/**
 * The site's shared GSAP language, ported from the IP3 storytelling homepage (mdsyfulhoque-afk/ippp,
 * useHomeGsap): cards rise with a slight tilt in batches, headings and leads rise, diagram lines draw, and each
 * inner page's hero settles into place.
 *
 * Rules that keep it safe:
 *  - Everything is visible without JavaScript; motion only ever animates *into* the final state.
 *  - Anything already on screen when the page opens is left alone (no flash), except the hero, which moves
 *    without fading.
 *  - Reduced-motion visitors get nothing. Every tween and trigger is reverted on the next route.
 *  - A fail-safe clears any inline style if ScrollTrigger never fires.
 *
 * Mark elements with `gs-card` (a card in a list or grid), `gs-reveal` (a heading or paragraph) or
 * `gs-draw` (an SVG whose paths should draw in). Sections with their own motion carry `data-own-motion`.
 */
export function useSiteMotion() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const main = document.getElementById('main');
    if (!main) return;
    let revert: (() => void) | undefined;
    let cancelled = false;

    // Wait a frame so the new route has rendered and the scroll position has been restored.
    const raf = requestAnimationFrame(() => {
      loadGsap().then(({ gsap, ScrollTrigger }) => {
        if (cancelled) return;
        const own = (el: Element) => Boolean(el.closest('[data-own-motion]'));
        const below = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.92;
        const pick = (sel: string) => gsap.utils.toArray<HTMLElement>(sel, main).filter((el) => !own(el) && below(el));

        const ctx = gsap.context(() => {
          // Inner-page hero: a one-time, transform-only settle.
          const hero = main.querySelector('header.page-hero');
          if (hero) {
            gsap.from(hero.querySelectorAll('.page-hero__item'), { y: 22, duration: 0.9, ease: 'power3.out', stagger: 0.08, clearProps: 'transform' });
          }

          const cards = pick('.gs-card');
          if (cards.length) {
            gsap.set(cards, { autoAlpha: 0 });
            ScrollTrigger.batch(cards, {
              start: 'top 90%',
              once: true,
              onEnter: (batch) =>
                gsap.fromTo(
                  batch,
                  { y: 30, z: -58, rotationX: 5, autoAlpha: 0, scale: 0.97, transformPerspective: 900 },
                  // Long lists share a 0.6 s stagger budget so the last card never trails far behind.
                  { y: 0, z: 0, rotationX: 0, autoAlpha: 1, scale: 1, duration: 0.72, stagger: Math.min(0.075, 0.6 / batch.length), ease: 'power3.out', clearProps: 'all' },
                ),
            });
          }

          const reveals = pick('.gs-reveal');
          if (reveals.length) {
            gsap.set(reveals, { autoAlpha: 0 });
            ScrollTrigger.batch(reveals, {
              start: 'top 92%',
              once: true,
              onEnter: (batch) =>
                gsap.fromTo(batch, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.78, stagger: Math.min(0.08, 0.6 / batch.length), ease: 'power2.out', clearProps: 'all' }),
            });
          }

          for (const svg of pick('.gs-draw')) {
            const paths = Array.from(svg.querySelectorAll<SVGGeometryElement>('path, line, polyline, circle')).filter((p) => {
              try {
                return p.getTotalLength() > 1;
              } catch {
                return false;
              }
            });
            paths.forEach((p) => {
              const len = p.getTotalLength();
              gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
            });
            gsap.to(paths, {
              strokeDashoffset: 0,
              duration: 1.2,
              ease: 'power2.inOut',
              stagger: 0.04,
              clearProps: 'strokeDasharray,strokeDashoffset',
              scrollTrigger: { trigger: svg, start: 'top 80%', once: true },
            });
          }
        }, main);

        // Fail-safe: never leave content hidden if triggers do not fire (frozen tab, unusual scroll container).
        const failSafe = window.setTimeout(() => {
          gsap.utils.toArray<HTMLElement>('.gs-card, .gs-reveal', main).forEach((el) => {
            if (el.getBoundingClientRect().top < window.innerHeight && getComputedStyle(el).visibility === 'hidden') gsap.set(el, { clearProps: 'all' });
          });
        }, 3000);

        // Images and fonts change the layout after start; measure again once they settle.
        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener('load', refresh, { once: true });
        document.fonts?.ready.then(refresh).catch(() => {});

        revert = () => {
          window.clearTimeout(failSafe);
          window.removeEventListener('load', refresh);
          ctx.revert();
        };
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      revert?.();
    };
  }, [pathname]);
}
