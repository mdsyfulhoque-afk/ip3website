import { isTbc } from '../../content';
import type { Engagement } from '../../content';
import { PLACES } from '../../content/places';

/** Published engagements, featured first, then newest first. */
export function publishedWork(portfolio: Engagement[]): Engagement[] {
  return portfolio
    .filter((e) => e.status === 'published' && !isTbc(e.title))
    .slice()
    .sort((a, b) => Number(b.featured) - Number(a.featured) || (b.end || 9999) - (a.end || 9999) || b.start - a.start);
}

/** Newest first, ignoring the featured flag. */
export function byDate(work: Engagement[]): Engagement[] {
  return work.slice().sort((a, b) => (b.end || 9999) - (a.end || 9999) || b.start - a.start);
}

export interface ImpactFigures {
  projects: number;
  since: number;
  countries: number;
  institutions: number;
  sectors: number;
  ongoing: number;
}

/**
 * Every figure on the impact band is counted from the published portfolio, so it can never claim more than
 * the entries show. Countries counts Bangladesh plus every country key; institutions counts distinct names.
 */
export function impactFigures(work: Engagement[]): ImpactFigures {
  const countries = new Set<string>();
  const institutions = new Set<string>();
  const sectors = new Set<string>();
  for (const e of work) {
    for (const key of e.places ?? []) {
      const p = PLACES[key];
      if (!p) continue;
      countries.add(p.kind === 'country' ? key : 'BD');
    }
    for (const i of e.institutions ?? []) if (i.trim()) institutions.add(i.trim());
    for (const s of e.sectors) sectors.add(s);
  }
  const starts = work.map((e) => e.start).filter((n) => n > 0);
  return {
    projects: work.length,
    since: starts.length ? Math.min(...starts) : 0,
    countries: countries.size,
    institutions: institutions.size,
    sectors: sectors.size,
    ongoing: work.filter((e) => e.end === 0).length,
  };
}

/** "2022–2023", "2025–present" or "2020". */
export function yearSpan(e: Engagement): string {
  if (!e.start) return '';
  if (e.end === 0) return `${e.start}–present`;
  return e.end && e.end !== e.start ? `${e.start}–${e.end}` : String(e.start);
}

/** Engagements that list a place key. "BD" also matches every Bangladesh site. */
export function workAt(work: Engagement[], key: string): Engagement[] {
  return work.filter((e) => (e.places ?? []).includes(key));
}
