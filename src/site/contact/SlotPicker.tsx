import { useId } from 'react';
import { Choice, ErrorText } from './shared';

export type SlotStatus = 'need-day' | 'loading' | 'ready';

/**
 * The time chooser. Slots that are already booked stay in the page, disabled, and say why to assistive technology,
 * so nobody has to guess whether a time vanished or was never offered.
 */
export function SlotPicker({
  slots,
  taken,
  status,
  value,
  onChange,
  timezoneLabel,
  error,
}: {
  slots: string[];
  taken: string[];
  status: SlotStatus;
  value: string;
  onChange: (slot: string) => void;
  timezoneLabel: string;
  error?: string;
}) {
  const uid = useId();
  const bookedId = `${uid}-booked`;
  const loadingId = `${uid}-loading`;
  const errorId = 'booking-slot-error';
  const allTaken = status === 'ready' && slots.length > 0 && slots.every((s) => taken.includes(s));

  return (
    <fieldset data-invalid={error ? 'true' : undefined} aria-describedby={error ? errorId : 'booking-slot-hint'} className="m-0 min-w-0 border-0 p-0">
      <legend className="t-h3 p-0">Choose a time</legend>
      <p id="booking-slot-hint" className="t-ui mt-1 text-ink-soft">
        Times are in {timezoneLabel}.
      </p>

      {status === 'need-day' ? (
        <p className="t-ui mt-4 border-t border-midnight/20 pt-4 text-ink-soft">Choose a day first, then the times that are free appear here.</p>
      ) : (
        <>
          <span id={bookedId} className="sr-only">
            Already booked. Choose another time.
          </span>
          <span id={loadingId} className="sr-only">
            Checking which times are free.
          </span>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3" aria-busy={status === 'loading'}>
            {slots.map((slot) => {
              const isTaken = status === 'ready' && taken.includes(slot);
              const disabled = status === 'loading' || isTaken;
              return (
                <Choice
                  key={slot}
                  name="booking-slot"
                  value={slot}
                  checked={value === slot && !isTaken}
                  disabled={disabled}
                  onChange={onChange}
                  describedBy={status === 'loading' ? loadingId : isTaken ? bookedId : undefined}
                  className="min-h-14"
                >
                  <span className={`font-semibold tabular-nums ${isTaken ? 'line-through' : ''}`}>{slot}</span>
                  {isTaken ? <span className="mt-0.5 text-[0.8125rem] leading-none">Booked</span> : null}
                </Choice>
              );
            })}
          </div>
          {allTaken ? <p className="t-ui mt-4 font-medium text-midnight">Every time on this day is booked. Choose another day.</p> : null}
        </>
      )}

      {error ? <ErrorText id={errorId}>{error}</ErrorText> : null}
    </fieldset>
  );
}
