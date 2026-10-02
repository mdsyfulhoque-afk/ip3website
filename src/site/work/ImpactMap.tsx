import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Engagement } from '../../content';
import { PLACES } from '../../content/places';
import { toBanglaDigits } from './ImpactNumbers';
import { workAt, yearSpan } from './data';

interface MapData {
  attribution: { bangladesh: string; region: string };
  bd: {
    width: number;
    height: number;
    outline: string;
    divisions: string;
    upazilas: string;
    labels: { name: string; bn: string; x: number; y: number }[];
    sites: Record<string, [number, number]>;
  };
  region: { width: number; height: number; context: string[]; countries: { key: string; name: string; d: string; cx: number; cy: number }[] };
}

type Lang = 'en' | 'bn';

const T = {
  en: {
    choose: 'Choose a place',
    count: (n: number) => (n === 1 ? '1 assignment' : `${n} assignments`),
    bangladesh: 'Bangladesh',
    region: 'Beyond Bangladesh',
    none: 'No published assignments here yet.',
    loading: 'Loading the map…',
    mapLabelBd: 'Map of Bangladesh with its eight divisions. Choose the country or a marked site to list the work there.',
    mapLabelRegion: 'Map of South, Central and South-East Asia. Highlighted countries are where IP3 has worked; choose one to list the work.',
  },
  bn: {
    choose: 'একটি স্থান বেছে নিন',
    count: (n: number) => `${toBanglaDigits(n)}টি কাজ`,
    bangladesh: 'বাংলাদেশ',
    region: 'বাংলাদেশের বাইরে',
    none: 'এখানে এখনও কোনো প্রকাশিত কাজ নেই।',
    loading: 'মানচিত্র লোড হচ্ছে…',
    mapLabelBd: 'বাংলাদেশের আটটি বিভাগসহ মানচিত্র। কাজের তালিকা দেখতে দেশ বা চিহ্নিত স্থান বেছে নিন।',
    mapLabelRegion: 'দক্ষিণ, মধ্য ও দক্ষিণ-পূর্ব এশিয়ার মানচিত্র। চিহ্নিত দেশগুলোতে IP3 কাজ করেছে।',
  },
};

/** Lets an SVG shape behave as a button: focusable, Enter or Space to choose. */
function pressable(label: string, pressed: boolean, onPress: () => void) {
  return {
    role: 'button',
    tabIndex: 0,
    'aria-label': label,
    'aria-pressed': pressed,
    onClick: onPress,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onPress();
      }
    },
  } as const;
}

/**
 * The Impact Map. Bangladesh is drawn with its divisions and upazilas; sites named in the portfolio are marked,
 * and the countries beyond Bangladesh are highlighted on a regional map. Choosing any of them lists the work.
 * Only places listed on published entries appear: nothing is plotted that the portfolio does not state.
 */
export function ImpactMap({
  work,
  lang = 'en',
  linkBase = '/work',
  titles = {},
}: {
  work: Engagement[];
  lang?: Lang;
  linkBase?: string;
  /** Translated titles by engagement id; anything missing shows the English title. */
  titles?: Record<string, string>;
}) {
  const t = T[lang];
  const [data, setData] = useState<MapData | null>(null);
  const [selected, setSelected] = useState('BD');

  useEffect(() => {
    let live = true;
    import('../impact/map-data.json').then((m) => live && setData(m.default as unknown as MapData));
    return () => {
      live = false;
    };
  }, []);

  const placeLabel = (key: string) => (lang === 'bn' ? PLACES[key]?.bn : PLACES[key]?.label) ?? key;

  // Every place that at least one published entry lists, in gazetteer order.
  const places = useMemo(
    () => Object.keys(PLACES).filter((k) => workAt(work, k).length > 0).map((k) => ({ key: k, count: workAt(work, k).length })),
    [work],
  );
  const listed = workAt(work, selected);
  const counts = new Map(places.map((p) => [p.key, p.count]));

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-12">
      <div className="lg:col-span-5">
        <h3 className="t-label text-signal">{t.bangladesh}</h3>
        <div className="relative mt-3" style={{ aspectRatio: '520 / 640' }}>
          {data ? (
            <svg viewBox={`0 0 ${data.bd.width} ${data.bd.height}`} className="h-full w-full" role="group" aria-label={t.mapLabelBd}>
              <path
                d={data.bd.outline}
                className={`cursor-pointer outline-none transition-colors duration-300 focus-visible:stroke-signal ${
                  selected === 'BD' ? 'fill-teal-deep/70' : 'fill-midnight-raised hover:fill-teal-deep/40'
                }`}
                stroke="#35D6CF"
                strokeOpacity={0.55}
                strokeWidth={1.2}
                {...pressable(`${placeLabel('BD')}: ${t.count(counts.get('BD') ?? 0)}`, selected === 'BD', () => setSelected('BD'))}
              />
              <path d={data.bd.upazilas} fill="none" stroke="#A9B8CC" strokeOpacity={0.16} strokeWidth={0.4} pointerEvents="none" />
              <path d={data.bd.divisions} fill="none" stroke="#F2EFE5" strokeOpacity={0.5} strokeWidth={0.9} pointerEvents="none" />
              {data.bd.labels.map((l) => (
                <text
                  key={l.name}
                  x={l.x}
                  y={l.name === 'Dhaka' ? l.y + 34 : l.y}
                  textAnchor="middle"
                  className="pointer-events-none fill-ivory/70 font-sans text-[13px] font-semibold uppercase tracking-[0.08em]"
                >
                  {lang === 'bn' ? l.bn : l.name}
                </text>
              ))}
              {Object.entries(data.bd.sites).map(([key, [x, y]]) => {
                const n = counts.get(key);
                if (!n) return null;
                const on = selected === key;
                return (
                  <g key={key} className="cursor-pointer outline-none [&:focus-visible>circle:last-child]:stroke-ivory" {...pressable(`${placeLabel(key)}: ${t.count(n)}`, on, () => setSelected(key))}>
                    <circle cx={x} cy={y} r={on ? 22 : 16} className="fill-amber/25 motion-safe:animate-pulse" />
                    <circle cx={x} cy={y} r={on ? 9 : 7} className="fill-amber" stroke="#0A1628" strokeWidth={2} />
                  </g>
                );
              })}
            </svg>
          ) : (
            <p className="t-ui flex h-full items-center justify-center rounded-sm border border-midnight-rule text-mist">{t.loading}</p>
          )}
        </div>
      </div>

      <div className="lg:col-span-7">
        <h3 className="t-label text-signal">{t.region}</h3>
        <div className="relative mt-3" style={{ aspectRatio: '800 / 560' }}>
          {data ? (
            <svg viewBox={`0 0 ${data.region.width} ${data.region.height}`} className="h-full w-full" role="group" aria-label={t.mapLabelRegion}>
              {data.region.context.map((d, i) => (
                <path key={i} d={d} className="fill-midnight-raised" stroke="#1E3A5C" strokeWidth={0.6} />
              ))}
              {data.region.countries.map((c) => {
                const key = c.key;
                const n = counts.get(key);
                const on = selected === key;
                if (key === 'BD') {
                  return <path key={key} d={c.d} className="fill-amber" stroke="#0A1628" strokeWidth={0.6} pointerEvents="none" />;
                }
                if (!n) return <path key={key} d={c.d} className="fill-midnight-raised" stroke="#1E3A5C" strokeWidth={0.6} />;
                return (
                  <path
                    key={key}
                    d={c.d}
                    className={`cursor-pointer outline-none transition-colors duration-300 focus-visible:stroke-ivory ${on ? 'fill-signal' : 'fill-teal-deep hover:fill-signal/70'}`}
                    stroke="#0A1628"
                    strokeWidth={0.8}
                    {...pressable(`${placeLabel(key)}: ${t.count(n)}`, on, () => setSelected(key))}
                  />
                );
              })}
            </svg>
          ) : null}
        </div>

        <div className="mt-6">
          <p id="map-choose" className="t-label text-mist">
            {t.choose}
          </p>
          <ul aria-labelledby="map-choose" className="mt-3 flex flex-wrap gap-2">
            {places.map((p) => (
              <li key={p.key}>
                <button
                  type="button"
                  aria-pressed={selected === p.key}
                  onClick={() => setSelected(p.key)}
                  className={`t-ui inline-flex min-h-11 items-center gap-2 rounded-full border px-4 transition-colors ${
                    selected === p.key ? 'border-signal bg-signal text-midnight' : 'border-midnight-rule text-ivory hover:border-ivory'
                  }`}
                >
                  {placeLabel(p.key)}
                  <span className={selected === p.key ? 'text-midnight/70' : 'text-mist'}>{lang === 'bn' ? toBanglaDigits(p.count) : p.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div aria-live="polite" className="mt-8 border-t border-midnight-rule pt-6">
          <p className="font-serif text-2xl">
            {placeLabel(selected)} <span className="t-ui text-mist">· {t.count(listed.length)}</span>
          </p>
          {listed.length ? (
            <ul className="mt-4 grid gap-0">
              {listed.map((e) => (
                <li key={e.id} className="border-b border-midnight-rule">
                  <Link to={`${linkBase}/${e.id}`} className="group flex min-h-11 flex-col py-3 no-underline sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="t-ui shrink-0 text-mist sm:w-28">{lang === 'bn' ? toBanglaDigits(yearSpan(e)) : yearSpan(e)}</span>
                    <span
                      lang={titles[e.id] || lang === 'en' ? undefined : 'en'}
                      className="t-ui font-semibold text-ivory underline decoration-midnight-rule decoration-1 underline-offset-4 group-hover:decoration-signal"
                    >
                      {titles[e.id] || e.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="t-ui mt-3 text-mist">{t.none}</p>
          )}
        </div>
        {data ? (
          <p className="t-ui mt-6 text-[0.8rem] text-mist/80">
            {data.attribution.bangladesh} {data.attribution.region}
          </p>
        ) : null}
      </div>
    </div>
  );
}
