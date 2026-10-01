import type { CSSProperties, ElementType, ReactNode } from 'react';
import { Link } from 'react-router-dom';

/** Shared building blocks for every inner page, so they read as one site. */

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="t-ui text-mist">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-2">
              {c.to && !last ? (
                <Link to={c.to} className="text-mist underline-offset-4 hover:text-ivory hover:underline">
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={last ? 'text-ivory' : undefined}>
                  {c.label}
                </span>
              )}
              {!last ? (
                <svg viewBox="0 0 8 12" className="h-3 w-2 text-mist/60" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  <path d="M1.5 1.5 6 6 1.5 10.5" />
                </svg>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

interface PageHeroProps {
  title: string;
  lead?: string;
  trail?: Crumb[];
  /** Where the contour backdrop is anchored, so each page crops the same map differently. */
  anchor?: string;
  children?: ReactNode;
  titleId?: string;
}

/** The dark opening band of every inner page: breadcrumb, title, one-sentence lead. */
export function PageHero({ title, lead, trail, anchor = 'center', children, titleId = 'page-title' }: PageHeroProps) {
  const style: CSSProperties = { backgroundImage: 'url(/contours.svg)', backgroundSize: 'cover', backgroundPosition: anchor };
  return (
    <header className="relative isolate overflow-hidden bg-midnight text-ivory" style={{ paddingTop: 'var(--header-h)' }}>
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-60" style={style} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight via-midnight/80 to-midnight/20" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-midnight to-transparent" />
      <div className="wrap py-[clamp(3rem,8vw,6.5rem)]">
        {trail ? <Breadcrumbs trail={trail} /> : null}
        <h1 id={titleId} className="t-display mt-6 max-w-[18ch]">
          {title}
        </h1>
        {lead ? <p className="t-lead mt-6 max-w-[40rem] text-ivory/90">{lead}</p> : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </header>
  );
}

type Tone = 'paper' | 'stone' | 'night';

interface BandProps {
  tone?: Tone;
  id?: string;
  labelledBy?: string;
  className?: string;
  children: ReactNode;
  as?: ElementType;
}

const toneClass: Record<Tone, string> = { paper: 'on-paper', stone: 'on-stone', night: 'on-night' };

/** A full-width section band. Alternate tones to separate topics instead of drawing boxes. */
export function Band({ tone = 'paper', id, labelledBy, className = '', children, as = 'section' }: BandProps) {
  const Tag = as as ElementType<{ id?: string; 'aria-labelledby'?: string; className?: string; children?: ReactNode }>;
  return (
    <Tag id={id} aria-labelledby={labelledBy} className={`${toneClass[tone]} band ${className}`}>
      <div className="wrap">{children}</div>
    </Tag>
  );
}

export function SectionHead({ id, title, lead, className = '' }: { id?: string; title: string; lead?: string; className?: string }) {
  return (
    <div className={`max-w-[44rem] ${className}`}>
      <h2 id={id} className="t-h2">
        {title}
      </h2>
      {lead ? <p className="t-lead mt-4 text-ink-soft">{lead}</p> : null}
    </div>
  );
}

export function Tag({ children, tone = 'paper' }: { children: ReactNode; tone?: 'paper' | 'night' }) {
  return (
    <span
      className={`t-ui inline-flex items-center rounded-full border px-3 py-0.5 ${
        tone === 'night' ? 'border-midnight-rule text-mist' : 'border-midnight/25 text-ink-soft'
      }`}
    >
      {children}
    </span>
  );
}

/** An inline link that ends in a small chevron. The label stays plain text for screen readers. */
export function TextLink({ to, children, className = '' }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={`group inline-flex items-center gap-2 font-semibold underline decoration-1 underline-offset-4 ${className}`}>
      {children}
      <svg
        viewBox="0 0 12 12"
        className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5" />
      </svg>
    </Link>
  );
}

/** Whole-card link: the card is one tab stop, the heading is the accessible name. */
export function LinkCard({
  to,
  title,
  children,
  meta,
  className = '',
}: {
  to: string;
  title: string;
  children?: ReactNode;
  meta?: string;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={`group relative flex h-full flex-col rounded-sm border border-midnight/15 bg-ivory p-6 no-underline transition-colors hover:border-teal-deep hover:bg-white sm:p-7 ${className}`}
    >
      {meta ? <span className="t-ui text-ink-soft">{meta}</span> : null}
      <span className="t-h3 mt-1 text-midnight group-hover:text-teal-deep">{title}</span>
      {children ? <span className="t-ui mt-3 block text-ink-soft">{children}</span> : null}
      <span className="mt-auto pt-5 text-teal-deep" aria-hidden="true">
        <svg viewBox="0 0 12 12" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5" />
        </svg>
      </span>
    </Link>
  );
}

/** A bulleted list that does not rely on browser list styling. */
export function Dots({ items, tone = 'paper' }: { items: string[]; tone?: 'paper' | 'night' }) {
  return (
    <ul className="grid gap-2.5">
      {items.map((it) => (
        <li key={it} className="t-ui flex gap-3">
          <span aria-hidden="true" className={`mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full ${tone === 'night' ? 'bg-signal' : 'bg-teal-deep'}`} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/** A circular monogram used instead of stock portraits. */
export function Monogram({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name
    .replace(/^(Prof\.|Dr\.|Adj\.|Barr\.|Barrister|Md\.)\s*/gi, '')
    .replace(/^(Prof\.|Dr\.|Adj\.|Barr\.|Barrister|Md\.)\s*/gi, '')
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase())
    .slice(0, 2)
    .join('');
  const dims = size === 'lg' ? 'h-28 w-28 text-4xl' : size === 'sm' ? 'h-10 w-10 text-base' : 'h-16 w-16 text-2xl';
  return (
    <span
      aria-hidden="true"
      className={`${dims} inline-flex shrink-0 items-center justify-center rounded-full border border-teal-deep/40 bg-stone font-serif text-teal-deep`}
    >
      {initials}
    </span>
  );
}
