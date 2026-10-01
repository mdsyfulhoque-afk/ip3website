import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../content';
import { SectorMap } from '../components/SectorMap';
import { Dots } from '../components/ui';

/** Sectors as a connected map plus an accordion. The map is for orientation; the list is the interface. */
export function HomeSectors() {
  const { home, sectors } = useContent();
  const [open, setOpen] = useState<string | null>(sectors[0]?.slug ?? null);
  const uid = useId();
  const bySlug = new Map(sectors.map((s) => [s.slug, s]));

  return (
    <section id="sectors" aria-labelledby="sectors-title" className="on-stone band">
      <div className="wrap">
        <div className="max-w-[44rem]">
          <h2 id="sectors-title" className="t-h2">
            {home.sectorsHeading}
          </h2>
          <p className="t-lead mt-6 text-ink-soft">{home.sectorsSub}</p>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectorMap sectors={sectors} selected={open} onSelect={setOpen} />
              <p className="t-ui mx-auto mt-4 max-w-[26rem] text-center text-ink-soft">
                Evaluation and learning sits at the centre because it runs through every other sector. Lines show where sectors depend on
                one another.
              </p>
            </div>
          </div>

          <ul className="grid gap-3 lg:col-span-7" aria-label="Sectors">
            {sectors.map((s) => {
              const isOpen = open === s.slug;
              const btnId = `${uid}-${s.slug}-btn`;
              const panelId = `${uid}-${s.slug}-panel`;
              return (
                <li
                  key={s.slug}
                  className={`rounded-[4px] border transition-colors ${isOpen ? 'border-teal-deep bg-[#FBFAF5]' : 'border-midnight/15 bg-ivory'}`}
                >
                  <h3 className="m-0">
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : s.slug)}
                      className="flex w-full items-start justify-between gap-4 rounded-[4px] p-5 text-left sm:p-6"
                    >
                      <span>
                        <span className="t-h3 block">{s.name}</span>
                        <span className="t-ui mt-1.5 block text-ink-soft">{s.summary}</span>
                      </span>
                      <span aria-hidden="true" className="mt-1.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-midnight/30">
                        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                          <path d="M2 6 H10" />
                          {!isOpen ? <path d="M6 2 V10" /> : null}
                        </svg>
                      </span>
                    </button>
                  </h3>
                  <div id={panelId} role="region" aria-labelledby={btnId} className="reveal" data-open={isOpen} inert={!isOpen}>
                    <div>
                      <div className="px-5 pb-6 sm:px-6">
                        <p className="t-label text-teal-deep">Questions we help answer</p>
                        <div className="mt-3">
                          <Dots items={s.questions} />
                        </div>
                        <p className="t-label mt-6 text-teal-deep">Works closely with</p>
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {s.connects.map((slug) => (
                            <li key={slug}>
                              <button
                                type="button"
                                onClick={() => setOpen(slug)}
                                aria-label={`Open ${bySlug.get(slug)?.name ?? slug}`}
                                className="t-label min-h-11 rounded-full border border-midnight/25 px-4 transition-colors hover:border-teal-deep hover:bg-stone"
                              >
                                {bySlug.get(slug)?.name ?? slug}
                              </button>
                            </li>
                          ))}
                        </ul>
                        <Link to={`/sectors/${s.slug}`} className="t-label mt-6 inline-flex min-h-11 items-center text-teal-deep underline underline-offset-4">
                          See the work in this sector
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
