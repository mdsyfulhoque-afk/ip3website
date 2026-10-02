import { PHOTOS } from './photos';
import { PLACES } from './places';
import type { SiteContent } from './types';

/**
 * Checks that cross-references resolve and nothing a visitor sees is empty.
 * Used by the admin editor before publishing and by the unit tests on the bundled defaults.
 */
export function validateContent(c: SiteContent): string[] {
  const errors: string[] = [];
  const dup = (what: string, slugs: string[]) => {
    const seen = new Set<string>();
    for (const s of slugs) {
      if (!s) errors.push(`${what}: an entry has an empty slug.`);
      else if (seen.has(s)) errors.push(`${what}: the slug "${s}" is used twice.`);
      seen.add(s);
      if (s && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)) errors.push(`${what}: the slug "${s}" must be lower-case letters, numbers and hyphens.`);
    }
  };
  const need = (what: string, value: string | undefined) => {
    if (!value || !value.trim()) errors.push(`${what} is empty.`);
  };

  const sectors = new Set(c.sectors.map((s) => s.slug));
  const services = new Set(c.services.map((s) => s.slug));
  const domains = new Set(c.domains.map((s) => s.slug));
  const engagements = new Set(c.portfolio.map((e) => e.id));

  dup('Sectors', c.sectors.map((s) => s.slug));
  dup('Services', c.services.map((s) => s.slug));
  dup('Focus areas', c.domains.map((s) => s.slug));
  dup('People', c.people.map((s) => s.slug));
  dup('Capabilities', c.capabilities.map((s) => s.slug));
  dup('Portfolio', c.portfolio.map((s) => s.id));

  const ref = (from: string, kind: string, known: Set<string>, slugs: string[]) => {
    for (const s of slugs) if (!known.has(s)) errors.push(`${from} points to a ${kind} that does not exist: "${s}".`);
  };

  for (const s of c.sectors) {
    ref(`Sector "${s.name}"`, 'sector', sectors, s.connects);
    ref(`Sector "${s.name}"`, 'service', services, s.services);
    ref(`Sector "${s.name}"`, 'focus area', domains, s.domains);
  }
  for (const d of c.domains) {
    ref(`Focus area "${d.title}"`, 'sector', sectors, d.sectors);
    ref(`Focus area "${d.title}"`, 'service', services, d.services);
  }
  for (const s of c.services) {
    ref(`Service "${s.title}"`, 'sector', sectors, s.sectors);
    ref(`Service "${s.title}"`, 'portfolio entry', engagements, s.portfolio);
  }
  for (const e of c.portfolio) {
    ref(`Engagement "${e.title}"`, 'service', services, e.services);
    ref(`Engagement "${e.title}"`, 'sector', sectors, e.sectors);
    ref(`Engagement "${e.title}"`, 'map place', new Set(Object.keys(PLACES)), e.places ?? []);
    if (e.photo && !PHOTOS[e.photo]) errors.push(`Engagement "${e.title}" points to a photo that does not exist: "${e.photo}".`);
  }

  const people = new Set(c.people.map((p) => p.slug));
  dup('Insights', (c.insights ?? []).map((i) => i.id));
  for (const i of c.insights ?? []) {
    ref(`Insight "${i.title}"`, 'person', people, i.people);
    if (i.engagement) ref(`Insight "${i.title}"`, 'portfolio entry', engagements, [i.engagement]);
    if (i.href && !/^https?:\/\//.test(i.href)) errors.push(`Insight "${i.title}" has a link that does not start with http:// or https://.`);
  }

  need('Organisation name', c.identity.name);
  need('Contact email', c.contact.email);
  for (const p of c.people) if (p.status === 'published') need(`Person "${p.slug}" name`, p.name);
  for (const s of c.sectors) need(`Sector "${s.slug}" name`, s.name);
  for (const s of c.services) need(`Service "${s.slug}" title`, s.title);
  for (const d of c.domains) need(`Focus area "${d.slug}" title`, d.title);

  if (c.contact.consultation.enabled && c.contact.consultation.slots.length === 0) errors.push('Consultation booking is on but no time slots are set.');

  return errors;
}
