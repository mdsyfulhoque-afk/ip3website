import { Component, lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react';
import { useContent } from '../../content';
import { railOrder } from '../../content/journey';
import { useJourneyProgress } from '../../lib/journey';
import { useMotion } from '../../lib/motion';
import { Hero } from './Hero';
import { Complexity } from './Complexity';
import { Evidence } from './Evidence';
import { Impact } from './Impact';
import { Insight } from './Insight';
import { Policy } from './Policy';
import { Practice } from './Practice';

const World = lazy(() => import('../../webgl/World'));

class StageBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

interface StageProps {
  target: MutableRefObject<number>;
  run: boolean;
}

/** The pinned background: the static contour map for everyone, with the 3D landscape fading in over it. */
function Stage({ target, run }: StageProps) {
  const { use3D, mobile, fail3D } = useMotion();
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    if (!use3D) setReady(false);
  }, [use3D]);

  return (
    <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-midnight" aria-hidden="true">
      <img
        src="/contours.svg"
        alt=""
        width={1920}
        height={1080}
        fetchPriority="high"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${ready ? 'opacity-0' : 'opacity-90'}`}
      />
      {use3D ? (
        <div className="stage-canvas absolute inset-0" data-ready={ready}>
          <StageBoundary onError={fail3D}>
            <Suspense fallback={null}>
              <World target={target} run={run} mobile={mobile} onReady={onReady} onLost={fail3D} />
            </Suspense>
          </StageBoundary>
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-midnight to-transparent" />
    </div>
  );
}

function SceneRail({ active, visible }: { active: number; visible: boolean }) {
  const { scenes } = useContent().home;
  return (
    <>
      <nav
        aria-label="Story scenes"
        className={`fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 transition-opacity duration-300 2xl:block ${
          visible ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!visible}
      >
        <ol>
          {railOrder.map((id, i) => {
            const current = active === i + 1;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  tabIndex={visible ? 0 : -1}
                  aria-current={current ? 'true' : undefined}
                  className="flex min-h-11 items-center justify-end gap-3 no-underline"
                >
                  <span className={`t-label transition-colors ${current ? 'text-ivory' : 'text-mist'}`}>{scenes[id].rail}</span>
                  <span
                    aria-hidden="true"
                    className={`block rounded-full transition-all ${current ? 'h-2.5 w-2.5 bg-signal' : 'h-2 w-2 border border-mist'}`}
                  />
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      <div
        aria-hidden="true"
        className={`fixed inset-x-0 z-40 flex items-center justify-between gap-3 bg-midnight/90 px-[var(--gutter)] py-1.5 transition-opacity duration-300 2xl:hidden ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ top: 'var(--header-h)' }}
      >
        <span className="flex gap-1">
          {railOrder.map((id, i) => (
            <span key={id} className={`block h-1 w-5 rounded-full ${i + 1 <= active ? 'bg-signal' : 'bg-midnight-rule'}`} />
          ))}
        </span>
        <span className="t-label text-mist">{active >= 1 ? scenes[railOrder[active - 1]!].rail : ''}</span>
      </div>
    </>
  );
}

export function Journey() {
  const target = useRef(0);
  const els = useRef<(HTMLElement | null)[]>([]);
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(true);
  const [centred, setCentred] = useState(false);

  const setters = useMemo(
    () => Array.from({ length: 7 }, (_, i) => (el: HTMLElement | null) => void (els.current[i] = el)),
    [],
  );

  useJourneyProgress(els, target, setActive);

  useEffect(() => {
    const el = wrap.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const near = new IntersectionObserver(([e]) => setInView(Boolean(e?.isIntersecting)), { rootMargin: '10% 0px' });
    // A thin band across the middle of the viewport: true only while the story fills the screen.
    const mid = new IntersectionObserver(([e]) => setCentred(Boolean(e?.isIntersecting)), { rootMargin: '-45% 0px -45% 0px' });
    near.observe(el);
    mid.observe(el);
    return () => {
      near.disconnect();
      mid.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} id="journey" className="relative isolate">
      <Stage target={target} run={inView} />
      <div className="relative z-10 -mt-[100svh]">
        <Hero sectionRef={setters[0]!} />
        <Complexity sectionRef={setters[1]!} />
        <Evidence sectionRef={setters[2]!} />
        <Insight sectionRef={setters[3]!} />
        <Policy sectionRef={setters[4]!} />
        <Practice sectionRef={setters[5]!} />
        <Impact sectionRef={setters[6]!} />
      </div>
      <SceneRail active={active} visible={centred && active >= 1} />
    </div>
  );
}
