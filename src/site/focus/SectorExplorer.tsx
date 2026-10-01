import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../content';
import { SectorMap } from '../components/SectorMap';
import { Dots, TextLink } from '../components/ui';
import { withMutualTies } from './data';
import { MapFrame } from './MapFrame';

type State = 'selected' | 'linked' | 'idle';

/** The small circle at the head of each row repeats how the same sector is drawn on the map. */
function Marker({ state }: { state: State }) {
  const ring = state === 'selected' ? 'border-midnight bg-midnight' : state === 'linked' ? 'border-teal-deep bg-ivory' : 'border-midnight/40 bg-ivory';
  const dot = state === 'selected' ? 'bg-signal' : state === 'linked' ? 'bg-teal-deep' : 'bg-teal-deep/55';
  return (
    <span aria-hidden="true" className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition-colors duration-200 ${ring}`}>
      <span className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ${dot}`} />
    </span>
  );
}

/**
 * The map and the list of all sectors, tied together. Moving over a row, tabbing to it, or tapping a node on
 * the map selects that sector and highlights what it is tied to. The map is decorative; the list is the interface.
 */
export function SectorExplorer({ heading }: { heading: ReactNode }) {
  const { sectors } = useContent();
  const ties = useMemo(() => withMutualTies(sectors), [sectors]);
  const [selected, setSelected] = useState<string | null>(sectors[0]?.slug ?? null);
  const current = ties.find((s) => s.slug === selected) ?? ties[0] ?? null;
  const nameOf = (slug: string) => ties.find((s) => s.slug === slug)?.name ?? slug;
  const linked = new Set(current?.connects ?? []);

  return (
    <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12 lg:gap-y-12">
      <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">{heading}</div>

      <div className="lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1">
        <div className="lg:[@media(min-height:54rem)]:sticky lg:top-28">
          <MapFrame>
            <SectorMap sectors={ties} selected={current?.slug ?? null} onSelect={setSelected} />
          </MapFrame>
          {current ? (
            <div className="mt-6 border-t border-midnight/20 pt-5">
              <p className="t-h3">{current.name}</p>
              {current.connects.length ? (
                <>
                  <p className="t-ui mt-2 text-ink-soft lg:hidden">
                    {current.connects.length === 1 ? '1 connection' : `${current.connects.length} connections`} highlighted on the map
                  </p>
                  <div className="hidden lg:block">
                    <p className="t-ui mt-2 text-ink-soft">Connected with</p>
                    <div className="mt-2">
                      <Dots items={current.connects.map(nameOf)} />
                    </div>
                  </div>
                </>
              ) : null}
              <p className="mt-4">
                <TextLink to={`/sectors/${current.slug}`} className="min-h-11 text-teal-deep">
                  Read about this sector
                </TextLink>
              </p>
              <p role="status" className="sr-only">
                {current.name} selected.{current.connects.length ? ` Connected with: ${current.connects.map(nameOf).join('; ')}.` : ''}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <ul className="lg:col-span-7 lg:col-start-6 lg:row-start-2">
        {ties.map((s) => {
          const state: State = s.slug === current?.slug ? 'selected' : linked.has(s.slug) ? 'linked' : 'idle';
          return (
            <li
              key={s.slug}
              onPointerEnter={() => setSelected(s.slug)}
              onFocus={() => setSelected(s.slug)}
              className={`relative border-t border-midnight/20 transition-colors duration-200 last:border-b ${
                state === 'selected' ? 'bg-ivory' : state === 'linked' ? 'bg-ivory/50' : ''
              }`}
            >
              <div className="flex gap-4 px-3 py-6 sm:gap-5 sm:px-5 sm:py-7">
                <Marker state={state} />
                <div className="min-w-0">
                  <h3 className="t-h3">
                    <Link to={`/sectors/${s.slug}`} className="no-underline after:absolute after:inset-0 hover:text-teal-deep">
                      {s.name}
                    </Link>
                  </h3>
                  <p className="t-ui mt-1.5 text-ink-soft">{s.summary}</p>
                  {state === 'selected' ? <span className="sr-only">Selected on the map.</span> : null}
                  {state === 'linked' && current ? <span className="sr-only">Connected with {current.name} on the map.</span> : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
