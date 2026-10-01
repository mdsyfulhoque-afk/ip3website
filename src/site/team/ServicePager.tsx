import { Link } from 'react-router-dom';
import type { ServiceLine } from '../../content';
import { toneStyle, type BandTone } from './tones';

function Chevron({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 12 12" className={`h-3 w-3 shrink-0 ${flip ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5" />
    </svg>
  );
}

/** Previous and next service line, with the index in between so the first and last lines are never dead ends. */
export function ServicePager({ prev, next, tone }: { prev?: ServiceLine; next?: ServiceLine; tone: BandTone }) {
  const t = toneStyle(tone);
  const linkBase = 'group block min-h-11 py-1';
  const titleCls = 'mt-1 block max-w-[26rem] font-serif text-xl leading-snug underline decoration-transparent decoration-1 underline-offset-4 group-hover:decoration-current';
  return (
    <nav aria-label="More services" className={`grid gap-8 border-t pt-8 sm:grid-cols-3 sm:items-start ${t.rule}`}>
      {prev ? (
        <div>
          <Link to={`/services/${prev.slug}`} className={linkBase}>
            <span className={`t-label inline-flex items-center gap-2 ${t.mute}`}>
              <Chevron flip />
              Previous service
            </span>
            <span className={titleCls}>{prev.title}</span>
          </Link>
        </div>
      ) : (
        <div aria-hidden="true" className="hidden sm:block" />
      )}
      <div className="sm:text-center">
        <Link to="/services" className={`t-label inline-flex min-h-11 items-center underline underline-offset-4 ${t.link}`}>
          All services
        </Link>
      </div>
      {next ? (
        <div className="sm:text-right">
          <Link to={`/services/${next.slug}`} className={`${linkBase} sm:ml-auto sm:max-w-[26rem]`}>
            <span className={`t-label inline-flex items-center gap-2 ${t.mute}`}>
              Next service
              <Chevron />
            </span>
            <span className={titleCls}>{next.title}</span>
          </Link>
        </div>
      ) : (
        <div aria-hidden="true" className="hidden sm:block" />
      )}
    </nav>
  );
}
