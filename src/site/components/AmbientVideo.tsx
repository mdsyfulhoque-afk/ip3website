import { useEffect, useRef, useState } from 'react';
import { useMotion } from '../../lib/motion';

/** Films in public/video ship as MP4 (H.264) with a WebM (VP9) twin for browsers without H.264. */
export const webmFor = (src: string) => (/^\/video\/[\w-]+\.mp4$/.test(src) ? src.replace(/\.mp4$/, '.webm') : '');

interface AmbientVideoProps {
  src: string;
  poster: string;
  /** Describes what the video shows; used as the accessible name. */
  label: string;
  className?: string;
  videoClassName?: string;
}

/**
 * A silent, looping film. It plays only while on screen, never before hydration, and never for visitors who ask
 * for reduced motion (they see the poster and can press play). A visible button pauses and resumes it at any
 * time, so moving content never runs without a way to stop it.
 */
export function AmbientVideo({ src, poster, label, className = '', videoClassName = '' }: AmbientVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const { reducedMotion, hydrated } = useMotion();
  const [paused, setPaused] = useState(true);
  const userPaused = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || !hydrated) return;
    if (reducedMotion) {
      userPaused.current = true;
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && !userPaused.current) v.play().catch(() => setPaused(true));
        else if (!entry.isIntersecting) v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [hydrated, reducedMotion]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <video
        ref={ref}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        className={`block h-full w-full object-cover ${videoClassName}`}
      >
        {webmFor(src) ? <source src={webmFor(src)} type="video/webm" /> : null}
        <source src={src} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        className="t-label absolute bottom-3 right-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-midnight/75 px-4 text-ivory backdrop-blur transition-colors hover:bg-midnight"
      >
        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden="true">
          {paused ? <path d="M3 1.5v9l7-4.5z" /> : <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" />}
        </svg>
        {paused ? 'Play film' : 'Pause film'}
      </button>
    </div>
  );
}
