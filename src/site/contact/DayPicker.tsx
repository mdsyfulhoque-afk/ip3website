import { useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { WORK_DAYS, columnHeadings, dayOfMonth, formatLong, monthShort, toWeeks } from './dates';
import { Choice, ErrorText } from './shared';

const WEEKS_PER_STEP = 3;

/**
 * The day chooser: Sunday to Thursday only, one row per week, so Friday and Saturday cannot be picked at all.
 * It is a native radio group underneath, so the arrow keys, Tab and screen readers behave as they should.
 */
export function DayPicker({
  days,
  value,
  onChange,
  error,
}: {
  days: string[];
  value: string;
  onChange: (iso: string) => void;
  error?: string;
}) {
  const weeks = useMemo(() => toWeeks(days), [days]);
  const headings = useMemo(columnHeadings, []);
  const [shown, setShown] = useState(WEEKS_PER_STEP);
  const rootRef = useRef<HTMLFieldSetElement>(null);

  // A chosen date in a later week must stay visible even if the list is re-created.
  const needed = value ? weeks.findIndex((w) => w.includes(value)) + 1 : 0;
  const visible = weeks.slice(0, Math.max(shown, needed));
  const hasMore = visible.length < weeks.length;

  function showMore() {
    const before = rootRef.current?.querySelectorAll('input[type="radio"]').length ?? 0;
    flushSync(() => setShown(Math.max(shown, needed) + WEEKS_PER_STEP));
    // Keep the keyboard where the new dates begin, rather than losing it when the button moves or disappears.
    rootRef.current?.querySelectorAll<HTMLInputElement>('input[type="radio"]')[before]?.focus();
  }

  const errorId = 'booking-date-error';
  const cols = WORK_DAYS.length;

  return (
    <fieldset ref={rootRef} data-invalid={error ? 'true' : undefined} aria-describedby={error ? errorId : 'booking-date-hint'} className="m-0 min-w-0 border-0 p-0">
      <legend className="t-h3 p-0">Choose a day</legend>
      <p id="booking-date-hint" className="t-ui mt-1 text-ink-soft">
        Sunday to Thursday. Friday and Saturday are not offered.
      </p>

      <div className="mt-5">
        <div aria-hidden="true" className="t-ui mb-2 grid gap-2 text-center font-semibold text-ink-soft" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {headings.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
        <div className="grid gap-2">
          {visible.map((week, i) => (
            <div key={i} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
              {week.map((iso, c) =>
                iso ? (
                  <Choice key={iso} name="booking-date" value={iso} checked={value === iso} onChange={onChange} className="min-h-14 px-1">
                    <span className="sr-only">{formatLong(iso)}</span>
                    <span aria-hidden="true" className="text-lg font-semibold leading-none tabular-nums">
                      {dayOfMonth(iso)}
                    </span>
                    <span aria-hidden="true" className="mt-1 text-[0.8125rem] leading-none">
                      {monthShort(iso)}
                    </span>
                  </Choice>
                ) : (
                  <span key={`gap-${c}`} aria-hidden="true" />
                ),
              )}
            </div>
          ))}
        </div>
      </div>

      {hasMore ? (
        <button type="button" onClick={showMore} className="t-ui mt-4 inline-flex min-h-11 items-center font-semibold text-teal-deep underline underline-offset-4">
          Show later dates
        </button>
      ) : null}

      {error ? <ErrorText id={errorId}>{error}</ErrorText> : null}
    </fieldset>
  );
}
