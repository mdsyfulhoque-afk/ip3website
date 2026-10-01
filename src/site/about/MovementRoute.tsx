import { useEffect, useState } from 'react';
import type { Movement } from '../../content';
import { splitLead } from './text';

const titleClass =
  'font-serif font-[380] leading-[1.08] tracking-[-0.02em] text-balance text-[clamp(1.75rem,1.25rem+1.8vw,2.75rem)]';

/** Tracks which movement is crossing the upper-middle of the viewport. Read-only: it never moves the page. */
function useCurrentMovement(slugs: string[]): string | null {
  const [current, setCurrent] = useState<string | null>(null);
  const key = slugs.join('|');
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const ids = key.split('|');
    const inView = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inView.add(e.target.id);
          else inView.delete(e.target.id);
        }
        const first = ids.find((id) => inView.has(id));
        if (first) setCurrent(first);
      },
      { rootMargin: '-30% 0px -60% 0px' },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [key]);
  return current;
}

/**
 * Plain in-page anchors, shown from xl up. The current movement is marked with aria-current and the
 * movements already passed are filled in. It is a table of contents with a sense of place, not a scroll hijack.
 */
function Rail({ movements, current }: { movements: Movement[]; current: string | null }) {
  const n = movements.length;
  const idx = current ? movements.findIndex((m) => m.slug === current) : -1;
  return (
    <nav aria-label="The movements" className="hidden xl:col-span-2 xl:block">
      <div className="sticky top-28">
        <ol role="list">
          {movements.map((m, i) => {
            const here = i === idx;
            const done = i < idx;
            // Each row draws its own two half-segments, so the line stays joined when a title wraps.
            const upFilled = i <= idx;
            const downFilled = i < idx;
            return (
              <li key={m.slug} className="relative">
                {i > 0 ? (
                  <span aria-hidden="true" className={`absolute left-[5px] top-0 h-1/2 transition-colors ${upFilled ? 'w-[2px] -translate-x-[0.5px] bg-teal-deep' : 'w-px bg-midnight/20'}`} />
                ) : null}
                {i < n - 1 ? (
                  <span aria-hidden="true" className={`absolute bottom-0 left-[5px] h-1/2 transition-colors ${downFilled ? 'w-[2px] -translate-x-[0.5px] bg-teal-deep' : 'w-px bg-midnight/20'}`} />
                ) : null}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1/2 h-[11px] w-[11px] -translate-y-1/2 rounded-full border-2 transition-colors ${
                    done || here ? 'border-teal-deep bg-teal-deep' : 'border-midnight/35 bg-ivory'
                  } ${here ? 'ring-4 ring-teal-deep/20' : ''}`}
                />
                <a
                  href={`#${m.slug}`}
                  aria-current={here ? 'location' : undefined}
                  className={`t-ui flex min-h-11 items-center py-1 pl-7 no-underline transition-colors hover:text-teal-deep ${
                    here ? 'font-semibold text-midnight' : 'text-ink-soft'
                  }`}
                >
                  {m.title}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

/**
 * The six movements as one route. A single line runs the length of the list: it passes a numbered node where each
 * movement begins and a diamond where it arrives at its named output, then carries on into the next movement.
 * From lg up the title sits to the left of the line and the detail to the right; on small screens everything
 * stacks to the right of the line.
 */
export function MovementRoute({ movements }: { movements: Movement[] }) {
  const current = useCurrentMovement(movements.map((m) => m.slug));
  if (movements.length === 0) return null;
  const line = 'bg-midnight/35';

  return (
    <div className="mt-14 xl:mt-20 xl:grid xl:grid-cols-12 xl:gap-10">
      <Rail movements={movements} current={current} />
      <ol role="list" aria-label="The movements, in order" className="xl:col-span-10">
        {movements.map((m, i) => {
          const first = i === 0;
          const last = i === movements.length - 1;
          const { lead, rest } = splitLead(m.text);
          return (
            <li id={m.slug} key={m.slug} className="grid grid-cols-[2.25rem_minmax(0,1fr)] lg:grid-cols-[minmax(0,4fr)_3rem_minmax(0,8fr)]">
              {/* the line and the numbered node */}
              <div aria-hidden="true" className="relative col-start-1 row-span-2 row-start-1 lg:col-start-2 lg:row-span-1">
                <span className={`absolute bottom-0 left-1/2 w-px -translate-x-1/2 ${line} ${first ? 'top-[18px] lg:top-[22px]' : 'top-0'}`} />
                <span className="absolute left-1/2 top-0 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full border border-teal-deep bg-ivory font-serif text-lg leading-none text-teal-deep lg:h-11 lg:w-11 lg:text-xl">
                  {i + 1}
                </span>
              </div>

              <div className="col-start-2 row-start-1 flex min-h-9 items-center pb-5 pl-5 lg:col-start-1 lg:min-h-11 lg:items-start lg:justify-end lg:pb-0 lg:pl-0 lg:pr-10 lg:text-right">
                <h3 className={titleClass}>{m.title}</h3>
              </div>

              <div className="col-start-2 row-start-2 pb-9 pl-5 lg:col-start-3 lg:row-start-1 lg:pb-10 lg:pl-10 lg:pt-1">
                {lead ? <p className="t-lead">{lead}</p> : null}
                <p className={`t-body ${lead ? 'mt-4' : ''}`}>{rest}</p>
              </div>

              {/* arrival at the named output */}
              <div aria-hidden="true" className="relative col-start-1 row-start-3 lg:col-start-2 lg:row-start-2">
                {!last ? <span className={`absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 ${line}`} /> : null}
                <span className="absolute left-1/2 top-0 h-px w-1/2 bg-midnight/25" />
                <span className="absolute left-1/2 top-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-amber-deep bg-ivory" />
              </div>
              <div
                className={`col-start-2 row-start-3 border-t border-midnight/25 pl-5 pt-4 lg:col-start-3 lg:row-start-2 lg:pl-10 ${
                  last ? '' : 'pb-12 lg:pb-16'
                }`}
              >
                <p className="t-label text-amber-deep">Output</p>
                <p className="t-h3 mt-1 max-w-[30ch]">{m.output}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
