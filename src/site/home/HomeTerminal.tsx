import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../content';
import { PHOTOS } from '../../content/photos';
import { loadGsap, prefersReducedMotion } from '../../lib/gsap';

/** One terminal screenshot in a dark device frame. */
function Screen({ photoKey, eager }: { photoKey: string; eager: boolean }) {
  const p = PHOTOS[photoKey];
  if (!p) return null;
  const set = (ext: string) => p.widths.map((w) => `/media/${p.key}-${w}.${ext} ${w}w`).join(', ');
  return (
    <div className="term-screen overflow-hidden rounded-xl border border-midnight-rule bg-midnight-deep shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]">
      <div className="flex items-center gap-2 border-b border-midnight-rule px-4 py-2.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-mist/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-mist/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-mist/30" />
        <span className="t-ui ml-3 truncate text-[0.75rem] text-mist">IP3 · Policy Intelligence Terminal</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-signal">
          <span className="term-live h-1.5 w-1.5 rounded-full bg-signal" />
          Live
        </span>
      </div>
      <div className="relative">
        <picture>
          <source type="image/avif" srcSet={set('avif')} sizes="(min-width: 1024px) 58vw, 100vw" />
          <img
            src={`/media/${p.key}-800.webp`}
            srcSet={set('webp')}
            sizes="(min-width: 1024px) 58vw, 100vw"
            width={p.width}
            height={p.height}
            alt={p.alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            className="block h-auto w-full"
          />
        </picture>
        <span className="term-scan pointer-events-none absolute inset-x-0 top-0 h-24" aria-hidden="true" />
      </div>
    </div>
  );
}

/**
 * The Policy Intelligence Terminal showcase. On capable desktops the stage pins and one scrubbed GSAP timeline
 * walks through the beats (the same pattern as the "Show your working" film on the portfolio site): screens
 * change, copy crossfades and the pipeline rail fills. Everywhere else, and without JavaScript, it is a plain
 * sequence of beats, each with its screen.
 */
export function HomeTerminal() {
  const { home } = useContent();
  const t = home.terminal;
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const jump = useRef<(i: number) => void>(() => {});

  useEffect(() => {
    const el = root.current;
    const st = stage.current;
    if (!el || !st || prefersReducedMotion()) return;
    let revert: (() => void) | undefined;
    let live = true;

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (!live) return;
      const mm = gsap.matchMedia();

      // Intro copy, every size.
      const intro = gsap.context(() => {
        gsap.from(el.querySelectorAll('[data-term-intro]'), {
          y: 28,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.08,
          clearProps: 'all',
          scrollTrigger: { trigger: el, start: 'top 75%', once: true },
        });
      }, el);

      mm.add('(min-width: 1024px) and (min-height: 700px)', () => {
        st.dataset.pinned = 'true';
        const beats = Array.from(st.querySelectorAll<HTMLElement>('[data-beat]'));
        const nodes = Array.from(st.querySelectorAll<HTMLElement>('[data-node]'));
        const fill = st.querySelector<HTMLElement>('[data-fill]');
        const n = beats.length;
        const D = n - 1 + 0.45;
        const tl = gsap.timeline({ defaults: { ease: 'none' }, paused: true });

        beats.forEach((b, i) => {
          const text = b.querySelector('[data-beat-text]');
          const fig = b.querySelector('[data-beat-fig]');
          const scan = b.querySelector('.term-scan');
          tl.addLabel(`beat${i}`, i);
          if (i === 0) gsap.set(b, { autoAlpha: 1 });
          else {
            // The previous beat has fully left (by i - 0.1) before this one arrives, so copy never overlaps.
            tl.fromTo(b, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, i - 0.08)
              .fromTo(text, { y: 34 }, { y: 0, duration: 0.2, ease: 'power2.out' }, i - 0.08)
              .fromTo(fig, { y: 70, scale: 0.94, rotationX: 6, transformPerspective: 1200 }, { y: 0, scale: 1, rotationX: 0, duration: 0.24, ease: 'power2.out' }, i - 0.08);
          }
          if (scan) tl.fromTo(scan, { yPercent: -100, autoAlpha: 0.9 }, { yPercent: 900, autoAlpha: 0, duration: 0.5 }, i + 0.02);
          if (i < n - 1) {
            tl.to(b, { autoAlpha: 0, duration: 0.1 }, i + 0.8).to(fig, { y: -40, scale: 0.97, duration: 0.12 }, i + 0.78);
          }
        });
        if (fill) tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: D, transformOrigin: 'left center' }, 0);
        tl.set({}, {}, D);

        const trigger = ScrollTrigger.create({
          trigger: st,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * n * 0.9)}`,
          pin: true,
          scrub: 0.6,
          animation: tl,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress * D;
            setActive(Math.min(n - 1, Math.max(0, Math.floor(p + 0.1))));
            const lit = Math.floor((self.progress + 0.001) * (nodes.length - 1) + 0.5);
            nodes.forEach((node, k) => node.toggleAttribute('data-lit', k <= lit));
          },
        });
        jump.current = (i: number) => {
          const top = trigger.start + (trigger.end - trigger.start) * (i / D);
          window.scrollTo({ top, behavior: 'smooth' });
        };
        return () => {
          delete st.dataset.pinned;
          nodes.forEach((node) => node.removeAttribute('data-lit'));
          jump.current = () => {};
        };
      });

      mm.add('(max-width: 1023px), (max-height: 699px)', () => {
        const beats = Array.from(st.querySelectorAll<HTMLElement>('[data-beat]'));
        beats.forEach((b) =>
          gsap.from(b.children, {
            y: 32,
            autoAlpha: 0,
            duration: 0.75,
            ease: 'power3.out',
            stagger: 0.1,
            clearProps: 'all',
            scrollTrigger: { trigger: b, start: 'top 85%', once: true },
          }),
        );
        st.querySelectorAll('[data-node]').forEach((node) => node.setAttribute('data-lit', ''));
      });

      revert = () => {
        mm.revert();
        intro.revert();
      };
    });
    return () => {
      live = false;
      revert?.();
    };
  }, []);

  if (!t?.beats?.length) return null;
  const pad = (i: number) => String(i + 1).padStart(2, '0');

  return (
    <section ref={root} data-own-motion aria-labelledby="terminal-title" className="on-night relative overflow-hidden border-t border-midnight-rule pt-[clamp(4rem,10vw,7rem)]">
      <div aria-hidden="true" className="term-glow pointer-events-none absolute inset-x-0 top-0 h-[60%]" />
      <div className="wrap relative">
        <p data-term-intro className="t-label text-signal">
          {t.kicker}
        </p>
        <h2 id="terminal-title" data-term-intro className="t-h2 mt-4 max-w-[18ch]">
          {t.heading}
        </h2>
        <p data-term-intro className="t-lead mt-6 max-w-[46rem] text-mist">
          {t.lead}
        </p>
      </div>

      <div ref={stage} className="term-stage wrap relative mt-12 lg:mt-16">
        <nav aria-label="Terminal walkthrough" className="term-rail">
          <ol className="flex flex-wrap gap-x-8">
            {t.beats.map((b, i) => (
              <li key={b.title}>
                <button
                  type="button"
                  onClick={() => jump.current(i)}
                  aria-current={active === i ? 'step' : undefined}
                  className={`t-ui flex min-h-11 items-center gap-3 text-left transition-colors ${active === i ? 'text-ivory' : 'text-mist hover:text-ivory'}`}
                >
                  <span className={`h-px transition-all duration-300 ${active === i ? 'w-8 bg-signal' : 'w-4 bg-mist/50'}`} aria-hidden="true" />
                  <span className="font-mono text-[0.75rem]">{pad(i)}</span>
                  <span className="hidden xl:inline">{b.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="term-beats">
          {t.beats.map((b, i) => (
            <article key={b.title} data-beat={i} aria-labelledby={`term-beat-${i}`} className="term-beat grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <div data-beat-text className="lg:col-span-5">
                <p className="t-label text-signal">
                  {pad(i)} / {pad(t.beats.length - 1)}
                </p>
                <h3 id={`term-beat-${i}`} className="mt-3 font-serif text-[clamp(1.75rem,1.2rem+1.8vw,2.6rem)] font-[380] leading-[1.1] tracking-[-0.015em]">
                  {b.title}
                </h3>
                <p className="t-body mt-5 text-mist">{b.text}</p>
                {b.points.length ? (
                  <ul className="mt-6 grid gap-2">
                    {b.points.map((pt) => (
                      <li key={pt} className="t-ui flex gap-3">
                        <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <figure data-beat-fig className="lg:col-span-7">
                <Screen photoKey={b.photo} eager={i === 0} />
                <figcaption className="t-ui mt-3 text-mist">{PHOTOS[b.photo]?.caption}</figcaption>
              </figure>
            </article>
          ))}
        </div>

        {t.pipeline.length ? (
          <div className="term-pipeline mt-12">
            <p className="sr-only">From signal to verified brief:</p>
            <div className="relative">
              <div className="absolute left-0 right-0 top-[7px] hidden h-px bg-midnight-rule lg:block" aria-hidden="true" />
              <div data-fill className="absolute left-0 right-0 top-[7px] hidden h-px origin-left bg-signal lg:block" aria-hidden="true" />
              <ol
                className="relative grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:[grid-template-columns:repeat(var(--steps),minmax(0,1fr))]"
                style={{ '--steps': t.pipeline.length } as CSSProperties}
              >
                {t.pipeline.map((step, k) => (
                  <li key={step} data-node className="term-node flex flex-col items-start gap-3 pr-2">
                    <span className="term-dot h-[15px] w-[15px] rounded-full border-2 border-midnight-rule bg-midnight transition-colors duration-300" aria-hidden="true" />
                    <span className="t-ui text-[0.8rem] leading-tight text-mist transition-colors duration-300">
                      <span className="font-mono text-[0.7rem] text-mist/70">{pad(k)}</span> {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : null}
      </div>

      <div className="wrap relative pb-[clamp(4rem,10vw,7rem)] pt-12">
        <Link to={t.cta.href} className="btn bg-signal text-midnight hover:bg-ivory">
          {t.cta.label}
        </Link>
      </div>
    </section>
  );
}
