import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/** Scroll positions by history entry, so Back and Forward return you to where you were. */
const positions = new Map<string, number>();

/**
 * Route changes behave like page loads: scroll to the top (or to the #anchor), and move keyboard
 * focus to the main region so screen-reader users hear the new page.
 */
export function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const type = useNavigationType();
  const first = useRef(true);
  const current = useRef(key);
  current.current = key;

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        positions.set(current.current, window.scrollY);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const isFirst = first.current;
    first.current = false;

    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ block: 'start' }));
        return;
      }
    }
    if (type === 'POP') {
      const saved = positions.get(key);
      requestAnimationFrame(() => window.scrollTo(0, saved ?? 0));
      return;
    }
    window.scrollTo(0, 0);
    if (!isFirst) document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname, hash, key, type]);

  return null;
}
