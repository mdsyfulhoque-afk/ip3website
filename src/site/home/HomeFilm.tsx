import { useEffect, useRef } from 'react';
import { useContent } from '../../content';
import { loadGsap, prefersReducedMotion } from '../../lib/gsap';
import { AmbientVideo } from '../components/AmbientVideo';

/**
 * The brand film under the 3D story. As the band scrolls in, the film grows from an inset card to the full width
 * of the page and the headline rises word by word. Without JavaScript, or with reduced motion, it is simply a
 * headline above a full-width film.
 */
export function HomeFilm() {
  const { home } = useContent();
  const f = home.film;
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    let revert: (() => void) | undefined;
    let live = true;
    loadGsap().then(({ gsap }) => {
      if (!live) return;
      const ctx = gsap.context(() => {
        const frame = el.querySelector<HTMLElement>('[data-film-frame]');
        const video = el.querySelector<HTMLElement>('video');
        const words = el.querySelectorAll<HTMLElement>('[data-word]');
        gsap.from(words, {
          yPercent: 110,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: 'top 75%', once: true },
        });
        gsap.from(el.querySelectorAll('[data-film-copy]'), {
          y: 24,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.1,
          clearProps: 'all',
          scrollTrigger: { trigger: el, start: 'top 70%', once: true },
        });
        if (frame) {
          gsap.fromTo(
            frame,
            { clipPath: 'inset(6% 9% 6% 9% round 28px)' },
            { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: frame, start: 'top 85%', end: 'center 55%', scrub: 0.6 } },
          );
        }
        if (video) {
          gsap.fromTo(video, { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
        }
      }, el);
      revert = () => ctx.revert();
    });
    return () => {
      live = false;
      revert?.();
    };
  }, []);

  if (!f?.video) return null;

  return (
    <section ref={root} data-own-motion aria-labelledby="film-title" className="on-night overflow-hidden pb-[clamp(3rem,8vw,6rem)] pt-[clamp(4rem,10vw,8rem)]">
      <div className="wrap">
        <p data-film-copy className="t-label text-signal">
          {f.kicker}
        </p>
        <h2 id="film-title" className="t-h2 mt-4 max-w-[20ch]">
          {f.heading.split(' ').map((w, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <span data-word className="inline-block">
                {w}
                {' '}
              </span>
            </span>
          ))}
        </h2>
        <p data-film-copy className="t-lead mt-6 max-w-[40rem] text-mist">
          {f.lead}
        </p>
      </div>
      <div data-film-frame className="mt-12 lg:mt-16">
        <AmbientVideo
          src={f.video}
          poster={f.poster}
          label="IP3 brand film: a garment factory sewing machine, climate and energy data on a touchscreen, IP3's circular economy projects title, and the IP3 logo with the line From polycrisis to polysolution."
          className="aspect-[16/9] max-h-[88svh] w-full overflow-hidden bg-midnight-deep"
        />
      </div>
    </section>
  );
}
