import { Link } from 'react-router-dom';
import type { ServiceLine } from '../../content';
import { TextLink } from '../components/ui';
import { plainTitle } from './serviceUtils';

const TITLE =
  'font-serif text-[clamp(1.625rem,1.1rem+1.9vw,2.5rem)] font-[400] leading-[1.12] tracking-[-0.018em] text-balance';

/**
 * The five service lines as a ruled list: the title and short line on the left, what is offered on the right.
 * Deliberately not cards, so the page reads as an index of work.
 */
export function ServiceList({ services }: { services: ServiceLine[] }) {
  return (
    <ul className="border-t border-midnight/25">
      {services.map((s) => (
        <li key={s.slug} className="gs-card border-b border-midnight/25 py-10 md:py-14">
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-12">
            <div className="md:col-span-6 lg:col-span-5">
              <h2 className={TITLE}>
                <Link to={`/services/${s.slug}`} className="underline decoration-transparent decoration-1 underline-offset-[7px] transition-colors hover:text-teal-deep hover:decoration-current">
                  {s.title}
                </Link>
              </h2>
              <p className="t-body mt-4 text-ink-soft">{s.short}</p>
              <p className="t-ui mt-6">
                <TextLink to={`/services/${s.slug}`} className="min-h-11 text-teal-deep">
                  See the offers and deliverables<span className="sr-only"> for {plainTitle(s.title)}</span>
                </TextLink>
              </p>
            </div>
            {s.offers.length > 0 ? (
              <div className="md:col-span-6 lg:col-span-6 lg:col-start-7">
                <h3 className="t-label text-teal-deep">What we offer</h3>
                <ul className="mt-3 grid gap-x-10 lg:grid-cols-2">
                  {s.offers.map((o) => (
                    <li key={o.title} className="t-ui border-t border-midnight/15 py-3">
                      {o.title}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
