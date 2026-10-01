import { useEffect, useRef, useState, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import { isTbc, useContent } from '../../content';
import { saveLead } from '../../lib/contentStore';
import { AlertRegion, Field, PrivacyPointer, SubmitButton, controlClass, focusFirstInvalid, friendlyError, rules, selectClass, selectStyle } from './shared';

type Values = { name: string; email: string; organisation: string; topic: string; message: string };
type Errors = Partial<Record<'name' | 'email' | 'message', string>>;

const EMPTY: Values = { name: '', email: '', organisation: '', topic: '', message: '' };

function validate(v: Values): Errors {
  const errors: Errors = {};
  const name = rules.name(v.name);
  const email = rules.email(v.email);
  const message = rules.message(v.message);
  if (name) errors.name = name;
  if (email) errors.email = email;
  if (message) errors.message = message;
  return errors;
}

/** The enquiry: the primary column of the page. Heading, form, and the confirmation that replaces the form. */
export function EnquirySection() {
  const { contact, identity } = useContent();
  const topics = contact.consultation.topics.filter((t) => t.trim() && !isTbc(t));
  const showEmail = contact.email.trim() && !isTbc(contact.email);

  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [trap, setTrap] = useState('');
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [done, setDone] = useState<{ ticketId?: string } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  function set(key: keyof Values, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    // Once a message is showing, clear or refresh it as the visitor types.
    if (key === 'name' || key === 'email' || key === 'message') {
      setErrors((e) => (e[key] ? { ...e, [key]: rules[key](value) } : e));
    }
  }

  function checkOnBlur(key: 'name' | 'email' | 'message') {
    // Only judge a field the visitor has typed in; an empty one is reported on submit.
    if (!values[key].trim()) return;
    setErrors((e) => ({ ...e, [key]: rules[key](values[key]) }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;

    const found = validate(values);
    if (Object.keys(found).length > 0) {
      flushSync(() => {
        setErrors(found);
        setFailure(null);
      });
      focusFirstInvalid(formRef.current);
      return;
    }

    // The honeypot is hidden from people. If something filled it, behave as if it worked and send nothing.
    if (trap.trim()) {
      setDone({});
      return;
    }

    setBusy(true);
    setFailure(null);
    const org = values.organisation.trim();
    const res = await saveLead({
      name: values.name.trim(),
      email: values.email.trim(),
      ...(org ? { organisation: org } : {}),
      ...(values.topic ? { topic: values.topic } : {}),
      message: values.message.trim(),
      source: 'Website enquiry',
    });
    setBusy(false);

    if (res.ok) setDone({ ticketId: res.ticketId });
    else setFailure(friendlyError(res.error));
  }

  if (done) {
    return (
      <div className="max-w-[40rem]">
        <h2 id="enquiry-title" ref={doneRef} tabIndex={-1} className="t-h2">
          Your enquiry has been sent.
        </h2>
        <p className="t-lead mt-6 text-ink-soft">Thank you. Your message has reached {identity.name}.</p>
        {done.ticketId ? (
          <p className="t-body mt-6">
            Your reference is <span className="font-semibold tabular-nums">{done.ticketId}</span>.
            {showEmail ? (
              <>
                {' '}
                To add something to your message, write to{' '}
                <a href={`mailto:${contact.email}`} className="text-teal-deep underline underline-offset-4">
                  {contact.email}
                </a>{' '}
                and quote it.
              </>
            ) : null}
          </p>
        ) : showEmail ? (
          <p className="t-body mt-6">
            To add something to your message, write to{' '}
            <a href={`mailto:${contact.email}`} className="text-teal-deep underline underline-offset-4">
              {contact.email}
            </a>
            .
          </p>
        ) : null}
        <button
          type="button"
          className="btn mt-8 border-midnight/60 text-midnight hover:bg-midnight/5"
          onClick={() => {
            setValues(EMPTY);
            setErrors({});
            setTrap('');
            setFailure(null);
            setDone(null);
          }}
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[40rem]">
      <h2 id="enquiry-title" className="t-h2">
        {contact.heading}
      </h2>
      <p className="t-lead mt-6 text-ink-soft">{contact.sub}</p>

      <form ref={formRef} onSubmit={onSubmit} noValidate aria-labelledby="enquiry-title" aria-busy={busy} className="relative mt-10 grid gap-6">
        <Field id="enquiry-name" label="Name" required error={errors.name}>
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

        <Field id="enquiry-email" label="Email address" required error={errors.email}>
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

        <Field id="enquiry-organisation" label="Organisation">
          {(a) => (
            <input
              {...a}
              type="text"
              name="organisation"
              autoComplete="organization"
              maxLength={160}
              value={values.organisation}
              onChange={(e) => set('organisation', e.target.value)}
              className={controlClass}
            />
          )}
        </Field>

        {topics.length > 0 ? (
          <Field id="enquiry-topic" label="What is it about?">
            {(a) => (
              <select
                {...a}
                name="topic"
                value={values.topic}
                onChange={(e) => set('topic', e.target.value)}
                className={selectClass}
                style={selectStyle}
              >
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

        <Field id="enquiry-message" label="Your message" required error={errors.message}>
          {(a) => (
            <textarea
              {...a}
              name="message"
              rows={7}
              maxLength={5000}
              value={values.message}
              onChange={(e) => set('message', e.target.value)}
              onBlur={() => checkOnBlur('message')}
              className={`${controlClass} min-h-44 resize-y`}
            />
          )}
        </Field>

        {/* Honeypot. Positioned off-screen, skipped by keyboard and screen readers. People never see it. */}
        <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
          <label>
            Leave this field empty
            <input type="text" name="website" tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} />
          </label>
        </div>

        <AlertRegion>
          {failure ? (
            <>
              <p className="font-semibold">Your enquiry was not sent.</p>
              <p className="mt-1">{failure}</p>
              <p className="mt-1">
                Your message is still in the form. Try again in a moment
                {showEmail ? (
                  <>
                    , or write to{' '}
                    <a href={`mailto:${contact.email}`} className="text-teal-deep underline underline-offset-4">
                      {contact.email}
                    </a>
                  </>
                ) : null}
                .
              </p>
            </>
          ) : null}
        </AlertRegion>

        <div>
          <SubmitButton busy={busy} idle="Send enquiry" working="Sending" />
          <PrivacyPointer className="mt-5" />
        </div>
      </form>
    </div>
  );
}
