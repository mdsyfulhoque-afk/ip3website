import type { Domain, Person, Sector } from '../../content';

export interface RelatedLink {
  slug: string;
  name: string;
  to: string;
  /** The practice labels that led to this link. */
  via: string[];
}

export interface RelatedAreas {
  domains: RelatedLink[];
  sectors: RelatedLink[];
}

/** "Climate, Energy and Green Transition" gives ["climate", "energy", "green transition"]. */
function nameParts(name: string): string[] {
  return name
    .toLowerCase()
    .split(/,|&|\band\b/)
    .map((p) => p.trim())
    .filter((p) => p.length >= 3);
}

/** Deliberately strict: the label is a part of the name, or starts with one ("Climate economics" starts with "climate"). */
function matches(label: string, parts: string[]): boolean {
  const l = label.toLowerCase().trim();
  return parts.some((p) => l === p || l.startsWith(`${p} `));
}

function collect<T extends { slug: string }>(
  items: T[],
  nameOf: (t: T) => string,
  hrefBase: string,
  practice: string[],
): RelatedLink[] {
  const out: RelatedLink[] = [];
  for (const item of items) {
    const parts = nameParts(nameOf(item));
    const via = practice.filter((label) => matches(label, parts));
    if (via.length) out.push({ slug: item.slug, name: nameOf(item), to: `${hrefBase}/${item.slug}`, via });
  }
  return out;
}

/** Focus areas and sectors whose names clearly match one of the person's practice labels. Often empty, and that is fine. */
export function relatedAreas(person: Person, domains: Domain[], sectors: Sector[]): RelatedAreas {
  return {
    domains: collect(domains, (d) => d.title, '/focus', person.practice),
    sectors: collect(sectors, (s) => s.name, '/sectors', person.practice),
  };
}
