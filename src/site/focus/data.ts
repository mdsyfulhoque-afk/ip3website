import { isTbc } from '../../content';
import type { Domain, Engagement, Sector, ServiceLine } from '../../content';

/** Small, pure helpers shared by the focus-area and sector pages. */

export type LightTone = 'paper' | 'stone';

/** Resolve slugs to entries, keeping the given order, dropping unknown and repeated slugs. */
export function resolve<T extends { slug: string }>(items: T[], slugs: string[]): T[] {
  const out: T[] = [];
  const seen = new Set<string>();
  for (const slug of slugs) {
    if (seen.has(slug)) continue;
    const hit = items.find((i) => i.slug === slug);
    if (hit) {
      seen.add(slug);
      out.push(hit);
    }
  }
  return out;
}

/** Merge two slug lists without repeats: declared slugs first, then the ones found from the other side. */
export function union(declared: string[], derived: string[]): string[] {
  return [...new Set([...declared, ...derived])];
}

/**
 * Sector ties are stored one way (`connects`) but drawn both ways. This returns the sectors tied to `slug`
 * from either side, in list order, so the list on the page always matches the lines on the map.
 */
export function sectorNeighbours(sectors: Sector[], slug: string): Sector[] {
  const self = sectors.find((s) => s.slug === slug);
  const declared = new Set(self?.connects ?? []);
  return sectors.filter((s) => s.slug !== slug && (declared.has(s.slug) || s.connects.includes(slug)));
}

/** A copy of the sector list in which every tie is listed on both sectors, so map highlights agree with drawn lines. */
export function withMutualTies(sectors: Sector[]): Sector[] {
  return sectors.map((s) => ({ ...s, connects: sectorNeighbours(sectors, s.slug).map((n) => n.slug) }));
}

/** Sectors under a domain: those it lists plus those that list it. */
export function domainSectors(domain: Domain, sectors: Sector[]): Sector[] {
  const slugs = union(
    domain.sectors,
    sectors.filter((s) => s.domains.includes(domain.slug)).map((s) => s.slug),
  );
  return resolve(sectors, slugs);
}

/** Domains a sector sits under: those it lists plus those that list it. */
export function sectorDomains(sector: Sector, domains: Domain[]): Domain[] {
  const slugs = union(
    sector.domains,
    domains.filter((d) => d.sectors.includes(sector.slug)).map((d) => d.slug),
  );
  return resolve(domains, slugs);
}

/** Service lines for a domain: those it lists. */
export function domainServices(domain: Domain, services: ServiceLine[]): ServiceLine[] {
  return resolve(services, domain.services);
}

/** Service lines for a sector: those it lists plus those that name the sector. */
export function sectorServices(sector: Sector, services: ServiceLine[]): ServiceLine[] {
  const slugs = union(
    sector.services,
    services.filter((s) => s.sectors.includes(sector.slug)).map((s) => s.slug),
  );
  return resolve(services, slugs);
}

/** Published engagements for a sector, in content order. */
export function sectorEngagements(portfolio: Engagement[], slug: string): Engagement[] {
  return portfolio.filter((e) => e.status === 'published' && e.sectors.includes(slug) && !isTbc(e.title));
}

/** Drop strings that are empty or still marked to be confirmed. */
export function keep(items: string[]): string[] {
  return items.filter((i) => !isTbc(i));
}

/** The facts about an engagement that are confirmed, ready to print one per line. */
export function engagementFacts(e: Engagement): string[] {
  return [e.client, e.place, e.period].filter((v) => !isTbc(v));
}

const WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
/** "Three" for 3, the numeral beyond ten. */
export function countWord(n: number): string {
  return WORDS[n] ?? String(n);
}

/**
 * A meta description of up to `max` characters built from whole sentences where possible.
 * Falls back to cutting the first sentence at a word boundary.
 */
export function describe(text: string, max = 200): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const sentences = clean.match(/[^.!?]+[.!?]+(?:\s|$)/g) ?? [clean];
  let out = '';
  for (const s of sentences) {
    if ((out + s).trim().length > max) break;
    out += s;
  }
  if (out.trim()) return out.trim();
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ') > 40 ? cut.lastIndexOf(' ') : cut.length).replace(/[,;:\s]+$/, '')}…`;
}

/** The first sentence of a passage, or the whole passage when it has no sentence end. */
export function firstSentence(text: string): string {
  const m = text.trim().match(/^[^.!?]+[.!?]/);
  return m ? m[0].trim() : text.trim();
}

/** Ensure a description ends like a sentence. */
export function endSentence(text: string): string {
  return /[.!?…]$/.test(text.trim()) ? text.trim() : `${text.trim()}.`;
}

/**
 * Alternate paper and stone bands across only the bands that will actually render, so two bands of the
 * same tone never touch when optional blocks are empty. Returns a tone per flag, or null when absent.
 */
export function bandTones(flags: boolean[]): (LightTone | null)[] {
  let n = 0;
  return flags.map((on) => (on ? (n++ % 2 === 0 ? 'paper' : 'stone') : null));
}

/** The previous and next entries, wrapping at the ends. Nothing when there is nothing else to go to. */
export function adjacent<T>(list: T[], index: number): { prev: T | null; next: T | null } {
  if (list.length < 2 || index < 0) return { prev: null, next: null };
  const next = list[(index + 1) % list.length] ?? null;
  const prev = list.length > 2 ? (list[(index - 1 + list.length) % list.length] ?? null) : null;
  return { prev, next };
}

/** A playable file URL only: https or same-site. Anything else is ignored. */
export function playableVideo(url: string): string | null {
  const v = url.trim();
  if (isTbc(v)) return null;
  return /^(https:\/\/|\/(?!\/))/.test(v) ? v : null;
}
