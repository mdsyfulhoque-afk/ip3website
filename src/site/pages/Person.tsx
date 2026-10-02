import { Fragment, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useContent, useContentStatus } from '../../content';
import { Seo } from '../Seo';
import { Band, PageHero, Tag, TextLink } from '../components/ui';
import { HomeClosing } from '../home/HomeClosing';
import { breadcrumbLd, origin } from '../seo';
import { PersonPortrait, PortraitPlate } from '../team/PersonPortrait';
import { groupLabel } from '../team/groups';
import { relatedAreas, type RelatedLink } from '../team/related';
import { H2, toneStyle, tonesFor, type BandTone } from '../team/tones';
import { InsightRow } from './Insights';
import { NotFound } from './NotFound';

const ANCHORS = ['right top', 'left bottom', 'center top', 'right bottom', 'left top', 'center bottom'];

function RelatedList({ title, links, tone }: { title: string; links: RelatedLink[]; tone: BandTone }) {
  const t = toneStyle(tone);
  return (
    <div>
      <h3 className={`t-label ${t.accent}`}>{title}</h3>
      <ul className={`mt-3 border-t ${t.rule}`}>
        {links.map((l) => (
          <li key={l.slug} className={`border-b py-4 ${t.rule}`}>
            <Link to={l.to} className={`inline-flex min-h-11 items-center font-serif text-xl leading-snug underline decoration-1 underline-offset-4 ${t.link}`}>
              {l.name}
            </Link>
            <p className={`t-ui mt-1 ${t.mute}`}>Practice area: {l.via.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Person() {
  const { slug } = useParams<{ slug: string }>();
  const content = useContent();
  const status = useContentStatus();
  const { people, domains, sectors, about, identity } = content;

  const index = people.findIndex((p) => p.slug === slug && p.status === 'published');
  const person = people[index];
  if (!person) return status === 'loading' ? <div className="min-h-[60vh]" /> : <NotFound />;

  const path = `/people/${person.slug}`;
  const related = relatedAreas(person, domains, sectors);
  const hasRelated = related.domains.length > 0 || related.sectors.length > 0;
  const label = groupLabel(person.group);
  const colleagues = people.filter((p) => p.status === 'published' && p.group === person.group && p.slug !== person.slug);
  const chair = about.chairman.name === person.name ? about.chairman : null;
  const chairSummary = chair?.summary && chair.summary !== person.summary ? chair.summary : '';

  const blocks: { key: string; render: (tone: BandTone) => ReactNode }[] = [];

  blocks.push({
    key: 'profile',
    render: (tone) => {
      const t = toneStyle(tone);
      return (
        <Band tone={tone} labelledBy="page-title">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-16">
            <div className="lg:col-span-4">
              <PortraitPlate person={person} />
            </div>
            <div className="lg:col-span-8 xl:col-span-7">
              {person.summary ? <p className="font-serif text-[clamp(1.5rem,1.1rem+1.7vw,2.375rem)] font-[350] leading-[1.25] tracking-[-0.012em] text-pretty">{person.summary}</p> : null}
              {person.affiliation ? <p className={`t-ui mt-5 font-semibold ${t.accent}`}>{person.affiliation}</p> : null}
              {person.bio?.map((para) => (
                <p key={para} className="t-body mt-6">
                  {para}
                </p>
              ))}
              {chairSummary ? <p className="t-body mt-6">{chairSummary}</p> : null}
              {chair?.quote ? (
                <figure className="mt-12 border-l-2 border-teal-deep pl-6">
                  <blockquote>
                    <p className="font-serif text-[clamp(1.25rem,1.05rem+0.9vw,1.75rem)] italic leading-snug">“{chair.quote}”</p>
                  </blockquote>
                  <figcaption className={`t-ui mt-3 ${t.mute}`}>{person.name}</figcaption>
                </figure>
              ) : null}
              {person.practice.length > 0 ? (
                <div className={`mt-12 border-t pt-8 ${t.rule}`}>
                  <h2 className="t-h3">Areas of practice</h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {person.practice.map((p) => (
                      <li key={p}>
                        <Tag>{p}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {person.education?.length ? (
                <div className={`mt-12 border-t pt-8 ${t.rule}`}>
                  <h2 className="t-h3">Education</h2>
                  <ul className="mt-4 grid gap-2">
                    {person.education.map((d) => (
                      <li key={d} className="t-ui flex gap-3">
                        <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-teal-deep" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <p className="t-ui mt-12">
                <TextLink to="/people" className={`min-h-11 ${t.link}`}>
                  Back to all people
                </TextLink>
              </p>
            </div>
          </div>
        </Band>
      );
    },
  });

  if (hasRelated) {
    blocks.push({
      key: 'related',
      render: (tone) => (
        <Band tone={tone} labelledBy="related-title">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-16">
            <div className="lg:col-span-4">
              <h2 id="related-title" className={`${H2} lg:sticky lg:top-28`}>
                Related focus areas and sectors
              </h2>
            </div>
            <div className="grid content-start gap-10 md:grid-cols-2 lg:col-span-8">
              {related.domains.length > 0 ? <RelatedList title="Focus areas" links={related.domains} tone={tone} /> : null}
              {related.sectors.length > 0 ? <RelatedList title="Sectors" links={related.sectors} tone={tone} /> : null}
            </div>
          </div>
        </Band>
      ),
    });
  }

  const writing = (content.insights ?? []).filter((i) => i.status === 'published' && i.people.includes(person.slug)).sort((a, b) => b.year - a.year);
  if (writing.length > 0) {
    blocks.push({
      key: 'writing',
      render: (tone) => (
        <Band tone={tone} labelledBy="writing-title">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-16">
            <div className="lg:col-span-4">
              <h2 id="writing-title" className={`${H2} lg:sticky lg:top-28`}>
                Selected publications
              </h2>
            </div>
            <ul className={`border-t lg:col-span-8 ${tone === 'night' ? 'border-midnight-rule' : 'border-midnight/20'}`}>
              {writing.map((i) => (
                <InsightRow key={i.id} item={i} tone={tone === 'night' ? 'night' : 'paper'} />
              ))}
            </ul>
          </div>
        </Band>
      ),
    });
  }

  if (colleagues.length > 0) {
    blocks.push({
      key: 'colleagues',
      render: (tone) => {
        const t = toneStyle(tone);
        return (
          <Band tone={tone} labelledBy="colleagues-title">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-16">
              <div className="lg:col-span-4">
                <h2 id="colleagues-title" className={`${H2} lg:sticky lg:top-28`}>
                  More in {label.toLowerCase()}
                </h2>
              </div>
              <ul className={`border-t lg:col-span-8 ${t.rule}`}>
                {colleagues.map((c) => (
                  <li key={c.slug} className={`group relative border-b ${t.rule}`}>
                    <div className="flex items-center gap-5 py-5">
                      <PersonPortrait person={c} size="sm" />
                      <div>
                        <p className="font-serif text-xl leading-snug">
                          <Link to={`/people/${c.slug}`} className="underline decoration-transparent decoration-1 underline-offset-4 after:absolute after:inset-0 group-hover:decoration-current">
                            {c.name}
                          </Link>
                        </p>
                        <p className={`t-ui mt-0.5 ${t.mute}`}>{c.role}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Band>
        );
      },
    });
  }

  const tones = tonesFor(blocks.length);
  const description = [`${person.name}, ${person.role}, ${identity.name}.`, person.summary].filter(Boolean).join(' ');

  return (
    <>
      <Seo
        title={person.name}
        description={description}
        path={path}
        jsonLd={[
          breadcrumbLd(content, [
            { name: 'Home', path: '/' },
            { name: 'People', path: '/people' },
            { name: person.name, path },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: person.name,
            jobTitle: person.role,
            url: `${origin(content)}${path}`,
            ...(person.portrait.trim() ? { image: person.portrait.trim().startsWith('/') ? `${origin(content)}${person.portrait.trim()}` : person.portrait.trim() } : {}),
            ...(person.affiliation ? { affiliation: person.affiliation } : {}),
            ...(person.practice.length ? { knowsAbout: person.practice } : {}),
            worksFor: { '@type': 'Organization', name: identity.name, url: origin(content) },
          },
        ]}
      />
      <PageHero
        title={person.name}
        lead={person.role}
        trail={[{ label: 'Home', to: '/' }, { label: 'People', to: '/people' }, { label: person.name }]}
        anchor={ANCHORS[index % ANCHORS.length]}
      />
      {blocks.map((b, i) => (
        <Fragment key={b.key}>{b.render(tones[i] ?? 'paper')}</Fragment>
      ))}
      <HomeClosing />
    </>
  );
}
