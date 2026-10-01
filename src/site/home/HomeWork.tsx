import { Link } from 'react-router-dom';
import { isTbc, useContent } from '../../content';
import { SectionHead, TextLink } from '../components/ui';

/** Selected engagements. Only entries marked published appear, and fields still "to be confirmed" are left out. */
export function HomeWork() {
  const { home, portfolio, services } = useContent();
  const shown = portfolio.filter((e) => e.status === 'published').slice(0, 6);
  if (shown.length === 0) return null;
  const serviceName = (slug: string) => services.find((s) => s.slug === slug);

  return (
    <section id="work" aria-labelledby="work-title" className="on-paper band border-t border-midnight/10">
      <div className="wrap">
        <SectionHead id="work-title" title={home.workHeading} lead={home.workSub} />
        <ul className="mt-12 grid gap-x-12 gap-y-0 md:grid-cols-2 lg:mt-16">
          {shown.map((e) => {
            const meta = [isTbc(e.client) ? '' : e.client, isTbc(e.place) ? '' : e.place, isTbc(e.period) ? '' : e.period].filter(Boolean);
            const svc = e.services[0] ? serviceName(e.services[0]) : undefined;
            return (
              <li key={e.id} className="border-t border-midnight/20 py-7">
                {meta.length ? <p className="t-ui text-ink-soft">{meta.join(', ')}</p> : null}
                <h3 className="t-h3 mt-1">{e.title}</h3>
                <p className="t-ui mt-3 text-ink-soft">{e.summary}</p>
                {svc ? (
                  <p className="t-ui mt-4">
                    <Link to={`/services/${svc.slug}`} className="text-teal-deep underline underline-offset-4">
                      {svc.title.replace(/ \(.*\)$/, '')}
                    </Link>
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
        <p className="mt-10">
          <TextLink to="/services" className="text-teal-deep">
            See the services behind this work
          </TextLink>
        </p>
      </div>
    </section>
  );
}
