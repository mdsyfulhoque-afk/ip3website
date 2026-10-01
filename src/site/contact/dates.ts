/**
 * Calendar helpers for the consultation picker.
 *
 * Dates travel as "YYYY-MM-DD" strings, the form the API stores. All arithmetic is done in UTC on those
 * strings so it never depends on the visitor's own time zone. "Today" is the calendar date in Dhaka,
 * because that is where the team works and where the slots are expressed.
 */

/** Sunday to Thursday, as JavaScript weekday numbers (0 is Sunday). Friday and Saturday are not offered. */
export const WORK_DAYS = [0, 1, 2, 3, 4] as const;

/** How far ahead a conversation can be booked. */
export const HORIZON_DAYS = 56;

const pad = (n: number) => String(n).padStart(2, '0');

function utc(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y ?? 1970, (m ?? 1) - 1, d ?? 1));
}

function toIso(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/** The calendar date in Dhaka right now. */
export function dhakaToday(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function addDays(iso: string, days: number): string {
  const d = utc(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return toIso(d);
}

export function weekdayOf(iso: string): number {
  return utc(iso).getUTCDay();
}

export function isWorkingDay(iso: string): boolean {
  return (WORK_DAYS as readonly number[]).includes(weekdayOf(iso));
}

/** Every bookable date: from the next working day after today, up to about eight weeks ahead. */
export function bookableDays(today: string): string[] {
  const out: string[] = [];
  for (let i = 1; i <= HORIZON_DAYS; i += 1) {
    const iso = addDays(today, i);
    if (isWorkingDay(iso)) out.push(iso);
  }
  return out;
}

/** Groups bookable dates into Sunday-to-Thursday rows. Gaps at the edges stay as null. */
export function toWeeks(days: string[]): (string | null)[][] {
  const weeks = new Map<string, (string | null)[]>();
  for (const iso of days) {
    const wd = weekdayOf(iso);
    const col = (WORK_DAYS as readonly number[]).indexOf(wd);
    if (col < 0) continue;
    const start = addDays(iso, -wd);
    let row = weeks.get(start);
    if (!row) {
      row = WORK_DAYS.map(() => null);
      weeks.set(start, row);
    }
    row[col] = iso;
  }
  return [...weeks.values()];
}

const longFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const monthFmt = new Intl.DateTimeFormat('en-GB', { month: 'short', timeZone: 'UTC' });
const dayNameFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: 'UTC' });

/** "Sunday 4 October 2026" */
export function formatLong(iso: string): string {
  return longFmt.format(utc(iso)).replace(',', '');
}

export const dayOfMonth = (iso: string) => String(utc(iso).getUTCDate());
export const monthShort = (iso: string) => monthFmt.format(utc(iso));

/** Column headings for the picker, taken from a known Sunday so they follow the same locale as the dates. */
export function columnHeadings(): string[] {
  return WORK_DAYS.map((wd) => dayNameFmt.format(utc(addDays('2026-01-04', wd))));
}
