import { useParams } from 'react-router-dom';
import { isTbc, useContent, useContentStatus } from '../../content';
import { Seo } from '../Seo';
import { breadcrumbLd } from '../seo';
import { HomeClosing } from '../home/HomeClosing';
import { Band, PageHero, SectionHead } from '../components/ui';
import { adjacent, bandTones, describe, domainSectors, domainServices, keep, playableVideo } from '../focus/data';
import { DomainVideo } from '../focus/DomainVideo';
import { PrevNext } from '../focus/PrevNext';
import { QuestionsRuled } from '../focus/Questions';
import { RelatedGroups } from '../focus/RelatedGroups';
import { NotFound } from './NotFound';

/** Where the contour backdrop is anchored, so each domain crops the map differently. */
const ANCHORS = ['78% 22%', '8% 55%', '90% 85%'];

export function FocusDetail() {
  const { slug } = useParams<{ slug: string }>();
  const content = useContent();
  const status = useContentStatus();
  const { domains, sectors, services } = content;

  const index = domains.findIndex((d) => d.slug === slug);
  const domain = index >= 0 ? domains[index] : undefined;
  if (!domain) return status === 'loading' ? <div className="min-h-[60vh]" /> : <NotFound />;

  const path = `/focus/${domain.slug}`;
  const relatedSectors = domainSectors(domain, sectors);
  const relatedServices = domainServices(domain, services);
  const video = playableVideo(domain.video);
  const questions = keep(domain.questions);
  const intro = keep(domain.intro);
  const areas = domain.areas.filter((a) => !isTbc(a.title) && !isTbc(a.text));
  const hasQuestions = questions.length > 0;
  const hasAreas = areas.length > 0;
  const hasRelated = relatedSectors.length > 0 || relatedServices.length > 0;
  const [areasTone, relatedTone, videoTone] = bandTones([hasAreas, hasRelated, video !== null]);
  const { prev, next } = adjacent(domains, index);

  const jump = [
    hasQuestions ? { id: 'questions', label: 'Questions clients bring' } : null,
    hasAreas ? { id: 'areas', label: 'Areas of work' } : null,
    hasRelated ? { id: 'related', label: 'Related sectors and services' } : null,
    video ? { id: 'video', label: 'Video' } : null,
  ].filter((j): j is { id: string; label: string } => j !== null);

  const [lead, ...rest] = intro;

  return (
    <>
      <Seo
        title={domain.title}
        description={describe(intro[0] ?? domain.short)}
        path={path}
        jsonLd={[
          breadcrumbLd(content, [
            { name: 'Home', path: '/' },
            { name: 'Focus areas', path: '/focus' },
            { name: domain.title, path },
          ]),
        ]}
      />
      <PageHero
        title={domain.title}
        lead={domain.short}
        trail={[{ label: 'Home', to: '/' }, { label: 'Focus areas', to: '/focus' }, { label: domain.title }]}
        anchor={ANCHORS[index % ANCHORS.length]}
      />

      {intro.length > 0 ? (
        <Band tone="paper" id="overview" labelledBy="page-title">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              {lead ? <p className="t-lead text-midnight">{lead}</p> : null}
              {rest.map((p) => (
                <p key={p} className="t-body mt-6 text-ink-soft first:mt-0">
                  {p}
                </p>
              ))}
            </div>
            {jump.length > 1 ? (
              <nav aria-label="On this page" className="lg:col-span-3 lg:col-start-10">
                <div className="border-t-2 border-midnight pt-4">
                  <p className="t-label text-teal-deep">On this page</p>
                  <ul className="mt-2">
                    {jump.map((j) => (
                      <li key={j.id}>
                        <a href={`#${j.id}`} className="t-ui inline-flex min-h-11 items-center underline decoration-teal-deep/40 underline-offset-4 hover:text-teal-deep hover:decoration-teal-deep">
                          {j.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </nav>
            ) : null}
          </div>
        </Band>
      ) : null}

      {hasQuestions ? (
        <Band tone="night" id="questions" labelledBy="questions-title">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <h2 id="questions-title" className="t-h2 lg:col-span-4">
              Questions clients bring
            </h2>
            <div className="lg:col-span-8">
              <QuestionsRuled questions={questions} tone="night" size="lg" />
            </div>
          </div>
        </Band>
      ) : null}

      {hasAreas && areasTone ? (
        <Band tone={areasTone} id="areas" labelledBy="areas-title">
          <SectionHead id="areas-title" title="Areas of work" />
          <ul className="mt-12 border-b border-midnight/20 lg:mt-16">
            {areas.map((a) => (
              <li key={a.title} className="grid gap-x-12 gap-y-2 border-t border-midnight/20 py-7 md:grid-cols-12 md:py-9">
                <h3 className="t-h3 md:col-span-5">{a.title}</h3>
                <p className="t-body text-ink-soft md:col-span-7">{a.text}</p>
              </li>
            ))}
          </ul>
        </Band>
      ) : null}

      {hasRelated && relatedTone ? (
        <Band tone={relatedTone} id="related" labelledBy="related-title">
          <SectionHead id="related-title" title="Related sectors and services" />
          <div className="mt-12 lg:mt-16">
            <RelatedGroups
              groups={[
                {
                  id: 'related-sectors',
                  heading: 'Sectors',
                  items: relatedSectors.map((s) => ({ to: `/sectors/${s.slug}`, title: s.name, text: s.summary })),
                },
                {
                  id: 'related-services',
                  heading: 'Services',
                  items: relatedServices.map((s) => ({ to: `/services/${s.slug}`, title: s.title, text: s.short })),
                },
              ]}
            />
          </div>
        </Band>
      ) : null}

      {video && videoTone ? (
        <Band tone={videoTone} id="video" labelledBy="video-title">
          <SectionHead id="video-title" title="Video" />
          <div className="mt-10">
            <DomainVideo src={video} title={domain.title} />
          </div>
        </Band>
      ) : null}

      <PrevNext
        label="Other focus areas"
        noun="focus area"
        prev={prev ? { to: `/focus/${prev.slug}`, title: prev.title } : null}
        next={next ? { to: `/focus/${next.slug}`, title: next.title } : null}
      />
      <HomeClosing />
    </>
  );
}
