import type { Person } from '../../content';

const LABELS: Record<string, string> = {
  leadership: 'Founding directors',
  advisors: 'Advisors',
  practice: 'Practice area leads',
  scholars: 'Affiliated research scholars',
  economics: 'Economics',
  education: 'Education',
  law: 'Law',
  climate: 'Climate',
  data: 'Data and digital',
};

const ORDER = Object.keys(LABELS);

/** Plain, readable group name. Unknown groups added in the editor still get a sensible label. */
export function groupLabel(group: string): string {
  const known = LABELS[group];
  if (known) return known;
  const spaced = group.replace(/[-_]+/g, ' ').trim();
  return spaced ? spaced.charAt(0).toUpperCase() + spaced.slice(1) : 'Other';
}

export interface PeopleGroup {
  group: string;
  label: string;
  people: Person[];
}

/** Published people only, grouped in a fixed order (leadership first); empty groups are skipped. */
export function groupPeople(people: Person[]): PeopleGroup[] {
  const published = people.filter((p) => p.status === 'published');
  const keys = [...new Set(published.map((p) => p.group))];
  const rank = (g: string) => {
    const i = ORDER.indexOf(g);
    return i === -1 ? ORDER.length : i;
  };
  keys.sort((a, b) => rank(a) - rank(b));
  return keys
    .map((group) => ({ group, label: groupLabel(group), people: published.filter((p) => p.group === group) }))
    .filter((g) => g.people.length > 0);
}
