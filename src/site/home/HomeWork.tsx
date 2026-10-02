import { Link } from 'react-router-dom';
import { isTbc, useContent } from '../../content';
import { SectionHead, TextLink } from '../components/ui';
import { ImpactNumbers } from '../work/ImpactNumbers';
import { impactFigures, publishedWork, yearSpan } from '../work/data';

/** The impact band and selected engagements. Only published entries appear, featured first; each opens its case story. */
export function HomeWork() {
  const { home, portfolio } = useContent();
  const work = publishedWork(portfolio);
  if (work.length === 0) return null;
  const shown = work.slice(0, 6);

  return (
    <section id="work" aria-labelledby="work-title" className="on-paper band border-t border-midnight/10">
      <div className="wrap">
        <SectionHead id="work-title" title={home.workHeading} lead={home.workSub} />
        <div className="mt-12">
          <ImpactNumbers figures={impactFigures(work)} tone="paper" />
        </div>
        <ul className="mt-12 grid gap-x-12 gap-y-0 md:grid-cols-2 lg:mt-16">
          {shown.map((e) => {
            const meta = [isTbc(e.client) ? '' : e.client, yearSpan(e)].filter(Boolean);
            return (
              <li key={e.id} className="border-t border-midnight/20">
                <Link to={`/work/${e.id}`} className="group block py-7 no-underline">
                  {meta.length ? <span className="t-ui block text-ink-soft">{meta.join(' · ')}</span> : null}
                  <span className="t-h3 mt-1 block text-midnight group-hover:text-teal-deep">{e.title}</span>
                  <span className="t-ui mt-3 block text-ink-soft">{e.summary}</span>
                  <span className="t-ui mt-4 inline-block font-semibold text-teal-deep underline underline-offset-4">Read the case story</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-10">
          <TextLink to="/work" className="text-teal-deep">
            All {work.length} assignments and the Impact Map
          </TextLink>
        </p>
      </div>
    </section>
  );
}
