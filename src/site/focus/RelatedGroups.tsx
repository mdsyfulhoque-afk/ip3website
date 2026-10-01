import { Link } from 'react-router-dom';

export interface RelatedItem {
  to: string;
  title: string;
  text?: string;
}

export interface RelatedGroup {
  id: string;
  heading: string;
  items: RelatedItem[];
}

/** A ruled list of whole-row links. */
export function RelatedList({ items, labelledBy }: { items: RelatedItem[]; labelledBy?: string }) {
  if (items.length === 0) return null;
  return (
    <ul aria-labelledby={labelledBy} className="border-b border-midnight/20">
      {items.map((it) => (
        <li key={it.to} className="border-t border-midnight/20">
          <Link to={it.to} className="group flex items-start justify-between gap-6 py-5 no-underline">
            <span>
              <span className="t-h3 block underline decoration-teal-deep/40 decoration-1 underline-offset-4 transition-colors group-hover:text-teal-deep group-hover:decoration-teal-deep">
                {it.title}
              </span>
              {it.text ? <span className="t-ui mt-1.5 block text-ink-soft">{it.text}</span> : null}
            </span>
            <svg
              viewBox="0 0 12 12"
              className="mt-2 h-4 w-4 shrink-0 text-teal-deep transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5" />
            </svg>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Named lists of links, ruled rather than boxed. Empty groups are dropped. */
export function RelatedGroups({ groups }: { groups: RelatedGroup[] }) {
  const shown = groups.filter((g) => g.items.length > 0);
  if (shown.length === 0) return null;
  return (
    <div className={`grid gap-x-16 gap-y-14 ${shown.length > 1 ? 'md:grid-cols-2' : 'max-w-[44rem]'}`}>
      {shown.map((g) => (
        <div key={g.id}>
          <h3 id={g.id} className="t-label text-teal-deep">
            {g.heading}
          </h3>
          <div className="mt-4">
            <RelatedList items={g.items} labelledBy={g.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
