/** Small text helpers shared by the About and Approach pages. */

/** Trim copy to a length suited to a meta description, ending on a sentence or word boundary. */
export function clip(text: string, max = 300): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
  if (stop > max * 0.6) return cut.slice(0, stop + 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:\s]+$/, '')}…`;
}

/**
 * Splits "Aphorism. Detail…" into its first sentence and the rest. Used where the content opens each
 * paragraph with a short principle, so the page can set it as a lead line. If the first sentence is long
 * (or there is only one), the whole text is returned as the rest.
 */
export function splitLead(text: string): { lead: string; rest: string } {
  const m = /^(.+?[.!?])\s+(\S[\s\S]*)$/.exec(text.trim());
  if (m && m[1] && m[2] && m[1].length <= 90) return { lead: m[1], rest: m[2] };
  return { lead: '', rest: text.trim() };
}

const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/** 6 becomes "six"; larger numbers stay as digits. */
export function numberWord(n: number): string {
  return WORDS[n] ?? String(n);
}

/** "A, B and C" */
export function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}
