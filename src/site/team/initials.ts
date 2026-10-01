const TITLES = /^(?:prof|dr|adj|barr|md|mr|ms|mrs)\.?\s+|^barrister\s+/i;

/** Two-letter initials with honorifics removed ("Prof. Dr. Niaz Asadullah" gives "NA"). */
export function initialsOf(name: string): string {
  let rest = name.trim();
  for (let i = 0; i < 4 && TITLES.test(rest); i += 1) rest = rest.replace(TITLES, '');
  return rest
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase())
    .slice(0, 2)
    .join('');
}
