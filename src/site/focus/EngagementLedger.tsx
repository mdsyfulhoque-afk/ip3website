import { Link } from 'react-router-dom';
import { isTbc, type Engagement, type ServiceLine } from '../../content';
import { engagementFacts, resolve } from './data';

/**
 * Published engagements as a ledger: what is confirmed about each on the left, the work on the right.
 * Fields that are still to be confirmed are left out rather than shown.
 */
export function EngagementLedger({ items, services }: { items: Engagement[]; services: ServiceLine[] }) {
  return (
    <ul className="border-b border-midnight/20">
      {items.map((e) => {
        const facts = engagementFacts(e);
        const svc = resolve(services, e.services);
        return (
          <li key={e.id} className="grid gap-x-12 gap-y-3 border-t border-midnight/20 py-8 md:grid-cols-12">
            {facts.length ? (
              <ul className="t-ui text-ink-soft md:col-span-3 md:pt-1.5">
                {facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            ) : null}
            <div className={facts.length ? 'md:col-span-9' : 'md:col-span-9 md:col-start-4'}>
              <h3 className="t-h3">{e.title}</h3>
              {isTbc(e.summary) ? null : <p className="t-ui mt-3 max-w-[46rem] text-ink-soft">{e.summary}</p>}
              {svc.length ? (
                <p className="t-ui mt-4 flex flex-wrap gap-x-5 gap-y-1">
                  {svc.map((s) => (
                    <Link key={s.slug} to={`/services/${s.slug}`} className="inline-flex min-h-11 items-center text-teal-deep underline underline-offset-4 hover:text-midnight">
                      {s.title.replace(/ \(.*\)$/, '')}
                    </Link>
                  ))}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
