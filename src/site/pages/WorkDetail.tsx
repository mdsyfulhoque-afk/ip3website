import { Link, useParams } from 'react-router-dom';
import { isTbc, useContent, useContentStatus } from '../../content';
import { PLACES } from '../../content/places';
import { Seo } from '../Seo';
import { Photo } from '../components/Photo';
import { Band, PageHero } from '../components/ui';
import { HomeClosing } from '../home/HomeClosing';
import { breadcrumbLd } from '../seo';
import { plainTitle } from '../team/serviceUtils';
import { H2 } from '../team/tones';
import { byDate, publishedWork, yearSpan } from '../work/data';
import { NotFound } from './NotFound';

/** One engagement told as a case story: the challenge, what IP3 did, and the facts of the assignment. */
export function WorkDetail() {
  const { id } = useParams<{ id: string }>();
  const content = useContent();
  const status = useContentStatus();
  const work = byDate(publishedWork(content.portfolio));
  const index = work.findIndex((e) => e.id === id);
  const e = work[index];
  if (!e) return status === 'loading' ? <div className="min-h-[60vh]" /> : <NotFound />;

  const path = `/work/${e.id}`;
  const services = e.services.map((s) => content.services.find((x) => x.slug === s)).filter((s) => s !== undefined);
  const sectors = e.sectors.map((s) => content.sectors.find((x) => x.slug === s)).filter((s) => s !== undefined);
  const others = e.institutions.filter((i) => !e.client.includes(i.replace(/\s*\(.*\)$/, '')));
  const facts = [
    { label: 'Client', value: e.client },
    { label: 'Our role', value: e.role },
    { label: 'When', value: e.period },
    { label: 'Where', value: e.place },
    { label: 'Reference', value: e.reference },
    { label: 'Also involved', value: others.join(', ') },
  ].filter((f) => f.value && !isTbc(f.value));
  const places = (e.places ?? []).map((k) => PLACES[k]?.label).filter(Boolean);
  const prev = work[index + 1];
  const next = work[index - 1];

  return (
    <>
      <Seo
        title={e.title}
        description={e.summary}
        path={path}
        image={e.photo ? `/media/${e.photo}-960.webp` : undefined}
        jsonLd={[
          breadcrumbLd(content, [
            { name: 'Home', path: '/' },
            { name: 'Our work', path: '/work' },
            { name: e.title, path },
          ]),
        ]}
      />
      <PageHero title={e.title} lead={e.summary} trail={[{ label: 'Home', to: '/' }, { label: 'Our work', to: '/work' }, { label: e.title }]} anchor="left top">
        <p className="t-label text-signal">{yearSpan(e)}</p>
      </PageHero>

      <Band tone="paper" labelledBy="challenge-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-7">
            {e.challenge ? (
              <>
                <h2 id="challenge-title" className={H2}>
                  The challenge
                </h2>
                <p className="t-lead mt-6">{e.challenge}</p>
              </>
            ) : (
              <h2 id="challenge-title" className="sr-only">
                About this assignment
              </h2>
            )}
            {e.photo ? <Photo photoKey={e.photo} className="mt-10 text-ink-soft" sizes="(min-width: 1024px) 55vw, 100vw" /> : null}
          </div>
          {facts.length ? (
            <aside aria-labelledby="facts-title" className="lg:col-span-4 lg:col-start-9">
              <h2 id="facts-title" className="t-label text-teal-deep">
                The assignment
              </h2>
              <dl className="mt-3 border-t border-midnight/20">
                {facts.map((f) => (
                  <div key={f.label} className="border-b border-midnight/20 py-3">
                    <dt className="t-ui text-ink-soft">{f.label}</dt>
                    <dd className="t-ui mt-0.5 font-semibold">{f.value}</dd>
                  </div>
                ))}
                {places.length ? (
                  <div className="border-b border-midnight/20 py-3">
                    <dt className="t-ui text-ink-soft">On the map</dt>
                    <dd className="t-ui mt-0.5">
                      <Link to="/work#map-title" className="font-semibold text-teal-deep underline underline-offset-4">
                        {places.join(', ')}
                      </Link>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </aside>
          ) : null}
        </div>
      </Band>

      {e.approach.length ? (
        <Band tone="stone" labelledBy="approach-title">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-16">
            <div className="lg:col-span-4">
              <h2 id="approach-title" className={`${H2} lg:sticky lg:top-28`}>
                What we did
              </h2>
            </div>
            <ol className="border-t border-midnight/20 lg:col-span-8">
              {e.approach.map((step, i) => (
                <li key={step} className="grid grid-cols-[3rem_1fr] gap-x-4 border-b border-midnight/20 py-5">
                  <span aria-hidden="true" className="font-serif text-2xl leading-none text-teal-deep">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="t-body">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </Band>
      ) : null}

      <Band tone="night" labelledBy="related-title">
        <h2 id="related-title" className="sr-only">
          Related
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          {e.links.length ? (
            <div>
              <h3 className="t-label text-signal">Published reports</h3>
              <ul className="mt-3 grid gap-3">
                {e.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="t-ui text-ivory underline decoration-midnight-rule underline-offset-4 hover:decoration-signal">
                      {l.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {services.length ? (
            <div>
              <h3 className="t-label text-signal">Services</h3>
              <ul className="mt-3 grid gap-1">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/services/${s.slug}`} className="t-ui inline-flex min-h-11 items-center text-ivory underline decoration-midnight-rule underline-offset-4 hover:decoration-signal">
                      {plainTitle(s.title)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {sectors.length ? (
            <div>
              <h3 className="t-label text-signal">Sectors</h3>
              <ul className="mt-3 grid gap-1">
                {sectors.map((s) => (
                  <li key={s.slug}>
                    <Link to={`/sectors/${s.slug}`} className="t-ui inline-flex min-h-11 items-center text-ivory underline decoration-midnight-rule underline-offset-4 hover:decoration-signal">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        {prev || next ? (
          <nav aria-label="More work" className="mt-14 grid gap-6 border-t border-midnight-rule pt-8 sm:grid-cols-2">
            {prev ? (
              <Link to={`/work/${prev.id}`} className="group no-underline">
                <span className="t-label text-mist">Earlier</span>
                <span className="t-h3 mt-1 block text-ivory group-hover:text-signal">{prev.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link to={`/work/${next.id}`} className="group no-underline sm:text-right">
                <span className="t-label text-mist">More recent</span>
                <span className="t-h3 mt-1 block text-ivory group-hover:text-signal">{next.title}</span>
              </Link>
            ) : null}
          </nav>
        ) : null}
      </Band>
      <HomeClosing />
    </>
  );
}
