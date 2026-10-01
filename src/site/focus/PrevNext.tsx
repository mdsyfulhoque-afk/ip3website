import { Link } from 'react-router-dom';
import { Band } from '../components/ui';

export interface Hop {
  to: string;
  title: string;
}

function Chevron({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={`h-4 w-4 shrink-0 text-signal transition-transform ${flip ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5" />
    </svg>
  );
}

/** Previous and next entries in a dark band, so the page ends clearly before the closing call to action. */
export function PrevNext({ label, noun, prev, next }: { label: string; noun: string; prev: Hop | null; next: Hop | null }) {
  if (!prev && !next) return null;
  return (
    <Band tone="night" as="div" className="py-0">
      <nav aria-label={label}>
        <ul className="grid md:grid-cols-2">
          {prev ? (
            <li className="border-b border-midnight-rule md:border-b-0 md:border-r">
              <Link to={prev.to} className="group flex h-full items-center gap-5 py-9 no-underline md:py-14 md:pr-10">
                <Chevron flip />
                <span>
                  <span className="t-ui block text-mist">Previous {noun}</span>
                  <span className="t-h3 mt-1 block text-ivory underline decoration-ivory/0 decoration-1 underline-offset-4 transition-colors group-hover:decoration-signal">
                    {prev.title}
                  </span>
                </span>
              </Link>
            </li>
          ) : null}
          {next ? (
            <li className="md:col-start-2">
              <Link to={next.to} className="group flex h-full items-center justify-between gap-5 py-9 no-underline md:py-14 md:pl-10 md:text-right">
                <span className="md:ml-auto">
                  <span className="t-ui block text-mist">Next {noun}</span>
                  <span className="t-h3 mt-1 block text-ivory underline decoration-ivory/0 decoration-1 underline-offset-4 transition-colors group-hover:decoration-signal">
                    {next.title}
                  </span>
                </span>
                <Chevron />
              </Link>
            </li>
          ) : null}
        </ul>
      </nav>
    </Band>
  );
}
