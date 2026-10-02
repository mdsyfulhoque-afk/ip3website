const TITLES = /^(?:prof|dr|adj|asst|barr|md|mr|ms|mrs)\.?\s+|^barrister\s+/i;

/**
 * Two-letter initials from the first and last name, honorifics removed ("Prof. Dr. M Niaz Asadullah" gives "MA",
 * "Dr. Md. Esraz-Ul-Zannat" gives "EZ").
 */
export function initialsOf(name: string): string {
  let rest = name.trim();
  for (let i = 0; i < 5 && TITLES.test(rest); i += 1) rest = rest.replace(TITLES, '');
  const words = rest.split(/[\s-]+/).filter(Boolean);
  const pick = words.length > 1 ? [words[0]!, words[words.length - 1]!] : words;
  return pick.map((w) => w[0]!.toUpperCase()).join('');
}
