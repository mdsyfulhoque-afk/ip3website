import { Link } from 'react-router-dom';
import type { Capability } from '../../content';

/**
 * The capabilities as one ruled list of links. Each row is one tab stop (the title is the link, stretched over
 * the row), so the quote beside it is not read as part of the link name.
 */
export function CapabilityLinks({ items, to }: { items: Capability[]; to: string }) {
  return (
    <ul role="list" className="border-b border-midnight/20">
      {items.map((c) => (
        <li
          key={c.slug}
          className="group relative grid gap-2 border-t border-midnight/20 py-6 transition-colors hover:bg-white/60 has-[a:focus-visible]:outline-[3px] has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-teal-deep md:grid-cols-12 md:gap-8 md:py-7"
        >
          <p className="t-label text-teal-deep md:col-span-2 md:pt-1.5">{c.label}</p>
          <div className="md:col-span-9">
            <h3 className="t-h3">
              <Link to={`${to}#capability-${c.slug}`} className="no-underline after:absolute after:inset-0 after:content-[''] group-hover:text-teal-deep focus-visible:outline-none">
                {c.title}
              </Link>
            </h3>
            {c.need ? <p className="mt-2 font-serif text-lg italic leading-snug text-ink-soft">“{c.need}”</p> : null}
          </div>
          <span aria-hidden="true" className="hidden text-teal-deep md:col-span-1 md:flex md:justify-end md:pt-2">
            <svg viewBox="0 0 12 12" className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5" />
            </svg>
          </span>
        </li>
      ))}
    </ul>
  );
}
