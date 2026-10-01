import { isTbc } from '../../content';
import type { Engagement, Sector, ServiceLine } from '../../content';

/** "Program & Survey Design (including CAPI surveys)" becomes "Program & Survey Design". */
export function plainTitle(title: string): string {
  return title.replace(/\s*\([^)]*\)\s*$/, '');
}

/** Sectors a service line is most often used in, resolved from slugs. Unknown slugs are dropped. */
export function serviceSectors(service: ServiceLine, sectors: Sector[]): Sector[] {
  const found: Sector[] = [];
  for (const slug of service.sectors) {
    const sector = sectors.find((s) => s.slug === slug);
    if (sector && !found.includes(sector)) found.push(sector);
  }
  return found;
}

/**
 * Published engagements for a service line: the ids it lists first, then any other entry that
 * names the service. Each entry appears once; anything not published is never shown.
 */
export function relatedEngagements(service: ServiceLine, portfolio: Engagement[]): Engagement[] {
  const byId = new Map(portfolio.map((e) => [e.id, e]));
  const seen = new Set<string>();
  const out: Engagement[] = [];
  const add = (e: Engagement | undefined) => {
    if (e && e.status === 'published' && !seen.has(e.id)) {
      seen.add(e.id);
      out.push(e);
    }
  };
  for (const id of service.portfolio) add(byId.get(id));
  for (const e of portfolio) if (e.services.includes(service.slug)) add(e);
  return out;
}

/** Client, place and period, minus anything still marked "to be confirmed". */
export function engagementMeta(e: Engagement): string[] {
  return [e.client, e.place, e.period].filter((v) => !isTbc(v));
}
