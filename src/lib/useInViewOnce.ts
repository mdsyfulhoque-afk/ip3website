import { useEffect, useRef, useState } from 'react';

/** Reports once when the element first scrolls into view. Returns false during server render. */
export function useInViewOnce<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [armed, setArmed] = useState(false);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setArmed(true);
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, armed, seen };
}
