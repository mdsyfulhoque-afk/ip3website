import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

/** Small pieces shared by the enquiry form and the booking form. Both sit on paper or stone, never on the dark hero. */

/** A deep brick that passes AA on ivory, stone and white. The palette has no error colour for light surfaces. */
const BRICK = '#8f2d1f';

/* ------------------------------- validation ------------------------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // the same rule the API applies

export const rules = {
  name(value: string): string | undefined {
    const v = value.trim();
    if (!v) return 'Enter your name.';
    if (v.length < 2) return 'Enter your name in full. It needs at least two characters.';
    return undefined;
  },
  email(value: string): string | undefined {
    const v = value.trim();
    if (!v) return 'Enter your email address.';
    if (!EMAIL_RE.test(v)) return 'Check your email address. It should look like name@example.org.';
    return undefined;
  },
  message(value: string): string | undefined {
    return value.trim() ? undefined : 'Tell us briefly what you would like to discuss.';
  },
};

/** The API client's wording is written for developers; visitors get the same fact in plain terms. */
export function friendlyError(message: string | undefined): string {
  if (!message) return 'Something went wrong on our side.';
  if (/cannot reach the api/i.test(message)) return 'We could not connect. Check your internet connection.';
  return message;
}

/** Moves focus to the first field (or choice group) marked invalid. Groups hand focus to their first usable radio. */
export function focusFirstInvalid(root: HTMLElement | null) {
  const el = root?.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid="true"]');
  if (!el) return;
  const target = el.matches('input, select, textarea, button') ? el : el.querySelector<HTMLElement>('input:not(:disabled)') ?? el;
  target.focus();
}

/* --------------------------------- fields --------------------------------- */

export const controlClass =
  'block w-full min-h-[3.25rem] rounded-[3px] border border-midnight/50 bg-white px-4 py-3 font-sans text-base leading-normal text-midnight ' +
  'placeholder:text-ink-soft hover:border-midnight focus:border-teal-deep aria-[invalid=true]:border-2 aria-[invalid=true]:border-[#8f2d1f]';

/** Native select with a chevron that reads on a white field (the shared `.select-field` chevron is drawn for dark surfaces). */
export const selectStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8' fill='none' stroke='%2344536a' stroke-width='1.6' stroke-linecap='round'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 1rem center',
  backgroundSize: '0.75rem',
} as const;

export const selectClass = `${controlClass} appearance-none pr-10`;

export interface FieldAria {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  required?: true;
}

export function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="t-ui mt-2 flex items-start gap-2 font-medium" style={{ color: BRICK }}>
      <svg viewBox="0 0 16 16" className="mt-[0.28em] h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 4.6v4M8 11.2v.1" />
      </svg>
      <span>{children}</span>
    </p>
  );
}

/** A visible label, optional hint, the control, and an inline message tied to it with aria-describedby. */
export function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: (aria: FieldAria) => ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div>
      <label htmlFor={id} className="t-ui block font-semibold text-midnight">
        {label} <span className="font-normal text-ink-soft">({required ? 'required' : 'optional'})</span>
      </label>
      {hint ? (
        <p id={hintId} className="t-ui mt-1 text-ink-soft">
          {hint}
        </p>
      ) : null}
      <div className="mt-2">
        {children({
          id,
          'aria-describedby': describedBy,
          'aria-invalid': error ? true : undefined,
          required: required ? true : undefined,
        })}
      </div>
      {error ? <ErrorText id={errorId!}>{error}</ErrorText> : null}
    </div>
  );
}

/* --------------------------------- choices -------------------------------- */

/**
 * One option in a radio group, drawn as a chip. The real input stays in the page (visually hidden), so arrow keys,
 * focus and screen-reader semantics are all native. A disabled choice stays in the DOM and can carry a reason.
 */
export function Choice({
  name,
  value,
  checked,
  disabled,
  onChange,
  describedBy,
  className = '',
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  describedBy?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`relative block ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        aria-describedby={describedBy}
        className="peer sr-only"
      />
      <span
        className={
          'flex min-h-12 flex-col items-center justify-center rounded-[3px] border border-midnight/50 bg-white px-3 py-2 text-center text-midnight transition-colors ' +
          'hover:border-midnight peer-checked:border-midnight peer-checked:bg-midnight peer-checked:text-ivory ' +
          'peer-disabled:border-dashed peer-disabled:border-midnight/35 peer-disabled:bg-transparent peer-disabled:text-ink-soft ' +
          'peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-teal-deep ' +
          className
        }
      >
        {children}
      </span>
    </label>
  );
}

/* --------------------------------- actions -------------------------------- */

function Spinner() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5 animate-spin motion-reduce:animate-none" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" opacity="0.3" />
      <path d="M10 2.5a7.5 7.5 0 0 1 7.5 7.5" />
    </svg>
  );
}

/** Uses aria-disabled while busy, not `disabled`, so keyboard focus is not thrown away mid-submit. */
export function SubmitButton({ busy, idle, working }: { busy: boolean; idle: string; working: string }) {
  return (
    <>
      <button
        type="submit"
        aria-disabled={busy || undefined}
        className="btn btn-ink min-h-14 w-full gap-3 px-8 aria-disabled:cursor-progress aria-disabled:opacity-70 sm:w-auto"
      >
        {busy ? <Spinner /> : null}
        <span>{busy ? working : idle}</span>
      </button>
      <span role="status" className="sr-only">
        {busy ? working : ''}
      </span>
    </>
  );
}

/** Always in the DOM so that a message added to it is announced. */
export function AlertRegion({ children }: { children?: ReactNode }) {
  return (
    <div role="alert" className="empty:hidden">
      {children ? (
        <div className="t-ui border-l-4 bg-white px-5 py-4 text-midnight" style={{ borderColor: BRICK }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function PrivacyPointer({ className = '' }: { className?: string }) {
  return (
    <p className={`t-ui text-ink-soft ${className}`}>
      How this website handles what you send is set out in the{' '}
      <Link to="/privacy" className="text-teal-deep underline underline-offset-4">
        privacy notice
      </Link>
      .
    </p>
  );
}

/** One ruled row of a definition list: a quiet label above the value. Used for contact details and booking facts. */
export function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-t border-midnight/20 py-5">
      <dt className="t-ui font-semibold text-ink-soft">{label}</dt>
      <dd className="mt-1.5 font-serif text-[1.0625rem] leading-relaxed">{children}</dd>
    </div>
  );
}
