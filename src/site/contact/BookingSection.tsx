import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import { isTbc, useContent } from '../../content';
import { getAvailability, saveBooking } from '../../lib/contentStore';
import { Band } from '../components/ui';
import { DayPicker } from './DayPicker';
import { SlotPicker, type SlotStatus } from './SlotPicker';
import { bookableDays, dhakaToday, formatLong } from './dates';
import {
  AlertRegion,
  DetailRow,
  Field,
  PrivacyPointer,
  SubmitButton,
  controlClass,
  focusFirstInvalid,
  friendlyError,
  rules,
  selectClass,
  selectStyle,
} from './shared';

type Values = { name: string; email: string; topic: string; note: string };
type ErrorKey = 'date' | 'slot' | 'name' | 'email';
type Errors = Partial<Record<ErrorKey, string>>;
type Done = { bookingId?: string; meetLink: string; date: string; slot: string; email: string };

const EMPTY: Values = { name: '', email: '', topic: '', note: '' };

/** Only a web address is ever turned into a link. Anything else is treated as "no link". */
const safeLink = (value: string | undefined) => (value && /^https?:\/\/\S+$/i.test(value.trim()) ? value.trim() : '');

/**
 * The consultation booking band. Dates and times are Dhaka time. Taken slots come from the API, and the database,
 * not this page, is what finally decides a clash.
 */
export function BookingSection() {
  const { contact } = useContent();
  const c = contact.consultation;
  const slots = c.slots.filter((s) => s.trim() && !isTbc(s));
  const topics = c.topics.filter((t) => t.trim() && !isTbc(t));

  // "Today" depends on the clock, so it is read after mount. The prerendered page and the first client render match.
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(dhakaToday()), []);
  const days = useMemo(() => (today ? bookableDays(today) : []), [today]);

  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [taken, setTaken] = useState<string[]>([]);
  const [availability, setAvailability] = useState<'idle' | 'loading' | 'ready'>('idle');
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const latest = useRef(0);

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  /** Fetches the taken slots for a date. Answers that arrive out of order are ignored. */
  const refresh = useCallback(async (iso: string) => {
    const id = ++latest.current;
    const list = await getAvailability(iso);
    if (id === latest.current) {
      setTaken(list);
      setAvailability('ready');
    }
    return list;
  }, []);

  if (!c.enabled || slots.length === 0) return null;

  function chooseDate(iso: string) {
    setDate(iso);
    setSlot('');
    setTaken([]);
    setAvailability('loading');
    setFailure(null);
    setErrors((e) => ({ ...e, date: undefined, slot: undefined }));
    void refresh(iso);
  }

  function chooseSlot(value: string) {
    setSlot(value);
    setFailure(null);
    setErrors((e) => ({ ...e, slot: undefined }));
  }

  function set(key: keyof Values, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    if (key === 'name' || key === 'email') setErrors((e) => (e[key] ? { ...e, [key]: rules[key](value) } : e));
  }

  function checkOnBlur(key: 'name' | 'email') {
    if (!values[key].trim()) return;
    setErrors((e) => ({ ...e, [key]: rules[key](values[key]) }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;

    const found: Errors = {};
    if (!date) found.date = 'Choose a day for the conversation.';
    if (!slot) found.slot = date ? 'Choose a time.' : 'Choose a day first, then a time.';
    const nameError = rules.name(values.name);
    const emailError = rules.email(values.email);
    if (nameError) found.name = nameError;
    if (emailError) found.email = emailError;
    if (Object.keys(found).length > 0) {
      flushSync(() => {
        setErrors(found);
        setFailure(null);
      });
      focusFirstInvalid(formRef.current);
      return;
    }

    setBusy(true);
    setFailure(null);
    const note = values.note.trim();
    const res = await saveBooking({
      name: values.name.trim(),
      email: values.email.trim(),
      ...(values.topic ? { topic: values.topic } : {}),
      // The Booking model keeps `notes`, and the admin schedule reads it.
      ...(note ? { notes: note } : {}),
      date,
      timeSlot: slot,
      source: 'Website booking',
    });

    if (res.ok) {
      setBusy(false);
      setDone({ bookingId: res.bookingId, meetLink: safeLink(res.meetLink), date, slot, email: values.email.trim() });
      return;
    }

    // The client does not receive the error code, so ask the source of truth: is the slot now taken?
    const fresh = await refresh(date);
    const clash = fresh.includes(slot) || /taken|already booked/i.test(res.error ?? '');
    flushSync(() => {
      setBusy(false);
      if (clash) {
        setSlot('');
        setFailure('That time has just been taken by someone else. The times shown are now up to date. Choose another time and send the request again.');
      } else {
        setFailure(friendlyError(res.error));
      }
    });
    if (clash) {
      const root = formRef.current;
      const next =
        root?.querySelector<HTMLInputElement>('input[name="booking-slot"]:not(:disabled)') ??
        root?.querySelector<HTMLInputElement>('input[name="booking-date"]:checked');
      next?.focus();
    }
  }

  function reset() {
    setDate('');
    setSlot('');
    setTaken([]);
    setAvailability('idle');
    setValues(EMPTY);
    setErrors({});
    setFailure(null);
    setDone(null);
    setToday(dhakaToday());
  }

  const slotStatus: SlotStatus = !date ? 'need-day' : availability === 'ready' ? 'ready' : 'loading';
  const free = slots.filter((s) => !taken.includes(s)).length;
  const announce = !date
    ? ''
    : availability === 'ready'
      ? free > 0
        ? `${free} of ${slots.length} times are free on ${formatLong(date)}.`
        : `No times are free on ${formatLong(date)}.`
      : `Checking which times are free on ${formatLong(date)}.`;

  const minutes = c.durationMinutes > 0 ? `${c.durationMinutes} minutes` : '';
  const choice =
    date && slot
      ? `${formatLong(date)} at ${slot}, ${c.timezoneLabel}${minutes ? `, ${minutes}` : ''}.`
      : date
        ? `${formatLong(date)}, no time chosen yet.`
        : 'no day or time chosen yet.';

  return (
    <Band tone="stone" id="book" labelledBy="booking-title">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 id="booking-title" className="t-h2 max-w-[16ch]">
              {c.heading.split(' ').map((word, i, all) => (
                <span key={i}>
                  {word.includes('-') ? <span className="whitespace-nowrap">{word}</span> : word}
                  {i < all.length - 1 ? ' ' : ''}
                </span>
              ))}
            </h2>
            <p className="t-lead mt-6 max-w-[28rem] text-ink-soft">{c.sub}</p>
            <dl className="mt-10 max-w-[28rem] border-b border-midnight/20">
              {minutes ? <DetailRow label="Length">{minutes}</DetailRow> : null}
              {c.timezoneLabel ? <DetailRow label="Time zone">{c.timezoneLabel}</DetailRow> : null}
            </dl>
          </div>
        </div>

        <div className="lg:col-span-7">
          {done ? (
            <div className="max-w-[36rem]">
              <h3 id="booking-done" ref={doneRef} tabIndex={-1} className="t-h3" style={{ fontSize: 'clamp(1.75rem, 1.3rem + 1.6vw, 2.5rem)' }}>
                Your request is in.
              </h3>
              <dl className="mt-8 border-b border-midnight/20">
                <DetailRow label="Day">{formatLong(done.date)}</DetailRow>
                <DetailRow label="Time">{done.slot}</DetailRow>
                <DetailRow label="Time zone">{c.timezoneLabel}</DetailRow>
                {minutes ? <DetailRow label="Length">{minutes}</DetailRow> : null}
                {done.bookingId ? <DetailRow label="Reference">{done.bookingId}</DetailRow> : null}
              </dl>
              <p className="t-body mt-8">
                {done.meetLink ? (
                  <>
                    Join with this link:{' '}
                    <a href={done.meetLink} target="_blank" rel="noopener noreferrer" className="break-all text-teal-deep underline underline-offset-4">
                      {done.meetLink}
                    </a>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </>
                ) : (
                  <>
                    We are holding this time for you. Once a member of the team confirms it, usually within one working day, we will email {done.email} with
                    the confirmation and the link to join.
                  </>
                )}
              </p>
              {contact.email && !isTbc(contact.email) ? (
                <p className="t-ui mt-4 text-ink-soft">
                  Questions about this booking: write to{' '}
                  <a href={`mailto:${contact.email}`} className="text-teal-deep underline underline-offset-4">
                    {contact.email}
                  </a>{' '}
                  and quote the reference.
                </p>
              ) : null}
              <button type="button" onClick={reset} className="btn mt-8 border-midnight/60 text-midnight hover:bg-midnight/5">
                Book another time
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} noValidate aria-labelledby="booking-title" aria-busy={busy} className="max-w-[36rem]">
              <p role="status" className="sr-only">
                {announce}
              </p>

              {today === null ? (
                <div aria-hidden="true" className="min-h-[18rem]" />
              ) : (
                <>
                  <DayPicker days={days} value={date} onChange={chooseDate} error={errors.date} />

                  <div className="mt-10 border-t border-midnight/20 pt-8">
                    <SlotPicker
                      slots={slots}
                      taken={taken}
                      status={slotStatus}
                      value={slot}
                      onChange={chooseSlot}
                      timezoneLabel={c.timezoneLabel}
                      error={errors.slot}
                    />
                  </div>

                  <fieldset className="m-0 mt-10 grid min-w-0 gap-6 border-0 border-t border-midnight/20 p-0 pt-8">
                    <legend className="t-h3 float-left mb-6 w-full p-0">Your details</legend>
                    <Field id="booking-name" label="Name" required error={errors.name}>
                      {(a) => (
                        <input
                          {...a}
                          type="text"
                          name="name"
                          autoComplete="name"
                          maxLength={120}
                          value={values.name}
                          onChange={(e) => set('name', e.target.value)}
                          onBlur={() => checkOnBlur('name')}
                          className={controlClass}
                        />
                      )}
                    </Field>
                    <Field id="booking-email" label="Email address" required error={errors.email}>
                      {(a) => (
                        <input
                          {...a}
                          type="email"
                          name="email"
                          autoComplete="email"
                          inputMode="email"
                          maxLength={200}
                          value={values.email}
                          onChange={(e) => set('email', e.target.value)}
                          onBlur={() => checkOnBlur('email')}
                          className={controlClass}
                        />
                      )}
                    </Field>
                    {topics.length > 0 ? (
                      <Field id="booking-topic" label="What is it about?">
                        {(a) => (
                          <select {...a} name="topic" value={values.topic} onChange={(e) => set('topic', e.target.value)} className={selectClass} style={selectStyle}>
                            <option value="">Choose a topic</option>
                            {topics.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        )}
                      </Field>
                    ) : null}
                    <Field id="booking-note" label="Anything we should know beforehand?">
                      {(a) => (
                        <textarea
                          {...a}
                          name="note"
                          rows={4}
                          maxLength={2000}
                          value={values.note}
                          onChange={(e) => set('note', e.target.value)}
                          className={`${controlClass} min-h-32 resize-y`}
                        />
                      )}
                    </Field>
                  </fieldset>

                  <p className="t-ui mt-8 border-t border-midnight/20 pt-6">
                    <span className="font-semibold">Your choice: </span>
                    {date && slot ? choice : <span className="text-ink-soft">{choice}</span>}
                  </p>

                  <div className="mt-6">
                    <AlertRegion>
                      {failure ? (
                        <>
                          <p className="font-semibold">Your booking was not made.</p>
                          <p className="mt-1">{failure}</p>
                          {!failure.startsWith('That time') ? (
                            <p className="mt-1">
                              Your details are still in the form. Try again in a moment
                              {contact.email && !isTbc(contact.email) ? (
                                <>
                                  , or write to{' '}
                                  <a href={`mailto:${contact.email}`} className="text-teal-deep underline underline-offset-4">
                                    {contact.email}
                                  </a>
                                </>
                              ) : null}
                              .
                            </p>
                          ) : null}
                        </>
                      ) : null}
                    </AlertRegion>
                  </div>

                  <div className="mt-6">
                    <SubmitButton busy={busy} idle="Request this time" working="Sending" />
                    <PrivacyPointer className="mt-5" />
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </Band>
  );
}
