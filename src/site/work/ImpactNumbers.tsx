import { useEffect, useState } from 'react';
import { useMotion } from '../../lib/motion';
import { useInViewOnce } from '../../lib/useInViewOnce';
import type { ImpactFigures } from './data';

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
export const toBanglaDigits = (s: string | number) => String(s).replace(/\d/g, (d) => BN_DIGITS[Number(d)]!);

/** Counts from zero to `value` once, when first seen. The server and reduced-motion visitors get the final number. */
function Count({ value, run, lang }: { value: number; run: boolean; lang: 'en' | 'bn' }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const t0 = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    setShown(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, value]);
  return <>{lang === 'bn' ? toBanglaDigits(shown) : shown}</>;
}

interface Labels {
  projects: (since: string) => string;
  countries: string;
  institutions: string;
  sectors: string;
  note: string;
}

const EN: Labels = {
  projects: (since) => `assignments since ${since}`,
  countries: 'countries',
  institutions: 'institutions worked with',
  sectors: 'sectors',
  note: 'Counted from the assignments listed on this site.',
};

const BN: Labels = {
  projects: (since) => `${since} সাল থেকে সম্পন্ন ও চলমান কাজ`,
  countries: 'দেশে কাজ',
  institutions: 'প্রতিষ্ঠানের সঙ্গে কাজ',
  sectors: 'খাত',
  note: 'এই ওয়েবসাইটে তালিকাভুক্ত কাজ থেকে গণনা করা।',
};

/** The impact band: four figures, all derived from the published portfolio. */
export function ImpactNumbers({ figures, tone = 'night', lang = 'en' }: { figures: ImpactFigures; tone?: 'night' | 'paper'; lang?: 'en' | 'bn' }) {
  const { reducedMotion, hydrated } = useMotion();
  const { ref, seen } = useInViewOnce<HTMLDListElement>(0.4);
  const run = hydrated && seen && !reducedMotion;
  const L = lang === 'bn' ? BN : EN;
  const since = lang === 'bn' ? toBanglaDigits(figures.since) : String(figures.since);
  const items = [
    { value: figures.projects, label: L.projects(since) },
    { value: figures.countries, label: L.countries },
    { value: figures.institutions, label: L.institutions },
    { value: figures.sectors, label: L.sectors },
  ];
  const rule = tone === 'night' ? 'border-midnight-rule' : 'border-midnight/20';
  const accent = tone === 'night' ? 'text-signal' : 'text-teal-deep';
  const mute = tone === 'night' ? 'text-mist' : 'text-ink-soft';
  return (
    <div>
      <dl ref={ref} className={`grid grid-cols-2 border-t lg:grid-cols-4 ${rule}`}>
        {items.map((it) => (
          <div key={it.label} className={`gs-card flex flex-col-reverse justify-end gap-2 border-b py-6 pr-4 lg:border-b-0 lg:py-8 ${rule}`}>
            <dt className={`t-ui ${mute}`}>{it.label}</dt>
            <dd className={`font-serif text-[clamp(3rem,2rem+4vw,5.5rem)] font-[340] leading-none tracking-[-0.03em] ${accent}`}>
              <Count value={it.value} run={run} lang={lang} />
            </dd>
          </div>
        ))}
      </dl>
      <p className={`t-ui mt-4 ${mute}`}>{L.note}</p>
    </div>
  );
}
