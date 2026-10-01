import { useParams } from 'react-router-dom';
import { useContent, useContentStatus } from '../../content';
import { Seo } from '../Seo';
import { breadcrumbLd } from '../seo';
import { HomeClosing } from '../home/HomeClosing';
import { SectorMap } from '../components/SectorMap';
import { Band, PageHero, SectionHead } from '../components/ui';
import {
  adjacent,
  bandTones,
  describe,
  endSentence,
  keep,
  sectorDomains,
  sectorEngagements,
  sectorNeighbours,
  sectorServices,
  withMutualTies,
} from '../focus/data';
import { EngagementLedger } from '../focus/EngagementLedger';
import { MapFrame } from '../focus/MapFrame';
import { PrevNext } from '../focus/PrevNext';
import { QuestionsColumns } from '../focus/Questions';
import { RelatedGroups, RelatedList } from '../focus/RelatedGroups';
import { NotFound } from './NotFound';

/** Where the contour backdrop is anchored, so each sector crops the map differently. */
const ANCHORS = ['82% 18%', '10% 78%', '55% 0%', '96% 60%', '18% 28%', '70% 92%', '2% 50%', '62% 8%'];

export function SectorDetail() {
  const { slug } = useParams<{ slug: string }>();
  const content = useContent();
  const status = useContentStatus();
  const { sectors, domains, services, portfolio, home } = content;

  const index = sectors.findIndex((s) => s.slug === slug);
  const sector = index >= 0 ? sectors[index] : undefined;
  if (!sector) return status === 'loading' ? <div className="min-h-[60vh]" /> : <NotFound />;

  const path = `/sectors/${sector.slug}`;
  const ties = sectorNeighbours(sectors, sector.slug);
  const relatedDomains = sectorDomains(sector, domains);
  const relatedServices = sectorServices(sector, services);
  const engagements = sectorEngagements(portfolio, sector.slug);

  const questions = keep(sector.questions);
  const work = keep(sector.work);
  const hasQuestions = questions.length > 0;
  const hasWork = work.length > 0;
  const hasMap = ties.length > 0;
  const hasRelated = relatedDomains.length > 0 || relatedServices.length > 0;
  const hasEngagements = engagements.length > 0;
  const [questionsTone, workTone, mapTone, relatedTone, workedTone] = bandTones([hasQuestions, hasWork, hasMap, hasRelated, hasEngagements]);
  const { prev, next } = adjacent(sectors, index);

  const description = describe([sector.summary, work[0] ? endSentence(work[0]) : ''].filter(Boolean).join(' '));

  return (
    <>
      <Seo
        title={sector.name}
        description={description}
        path={path}
        jsonLd={[
          breadcrumbLd(content, [
            { name: 'Home', path: '/' },
            { name: 'Sectors', path: '/sectors' },
            { name: sector.name, path },
          ]),
        ]}
      />
      <PageHero
        title={sector.name}
        lead={sector.summary}
        trail={[{ label: 'Home', to: '/' }, { label: 'Sectors', to: '/sectors' }, { label: sector.name }]}
        anchor={ANCHORS[index % ANCHORS.length]}
      />

      {hasQuestions && questionsTone ? (
        <Band tone={questionsTone} id="questions" labelledBy="questions-title">
          <SectionHead id="questions-title" title="Questions we help answer" />
          <div className="mt-12 lg:mt-16">
            <QuestionsColumns questions={questions} />
          </div>
        </Band>
      ) : null}

      {hasWork && workTone ? (
        <Band tone={workTone} id="work" labelledBy="work-title">
          <SectionHead id="work-title" title="What we do here" />
          <ul className="mt-12 grid gap-x-14 border-b border-midnight/20 md:grid-cols-2 lg:mt-16">
            {work.map((w) => (
              <li key={w} className="border-t border-midnight/20 py-6 md:py-8">
                <p className="t-lead">{w}</p>
              </li>
            ))}
          </ul>
        </Band>
      ) : null}

      {hasMap && mapTone ? (
        <Band tone={mapTone} id="connections" labelledBy="connections-title">
          <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12 lg:gap-y-12">
            <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
              <SectionHead
                id="connections-title"
                title="Connected sectors"
                lead={`Lines on the map show where sectors depend on one another. Those tied to ${sector.name} are highlighted.`}
              />
            </div>
            <div className="lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1">
              <div className="lg:[@media(min-height:54rem)]:sticky lg:top-28">
                <MapFrame>
                  <SectorMap sectors={withMutualTies(sectors)} selected={sector.slug} />
                </MapFrame>
              </div>
            </div>
            <div className="lg:col-span-7 lg:col-start-6 lg:row-start-2">
              <RelatedList items={ties.map((s) => ({ to: `/sectors/${s.slug}`, title: s.name, text: s.summary }))} labelledBy="connections-title" />
            </div>
          </div>
        </Band>
      ) : null}

      {hasRelated && relatedTone ? (
        <Band tone={relatedTone} id="related" labelledBy="related-title">
          <SectionHead id="related-title" title="Focus areas and services" />
          <div className="mt-12 lg:mt-16">
            <RelatedGroups
              groups={[
                {
                  id: 'related-domains',
                  heading: 'Focus areas',
                  items: relatedDomains.map((d) => ({ to: `/focus/${d.slug}`, title: d.title, text: d.short })),
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

      {hasEngagements && workedTone ? (
        <Band tone={workedTone} id="selected-work" labelledBy="selected-work-title">
          <SectionHead id="selected-work-title" title={home.workHeading} lead={home.workSub} />
          <div className="mt-12 lg:mt-16">
            <EngagementLedger items={engagements} services={services} />
          </div>
        </Band>
      ) : null}

      <PrevNext
        label="Other sectors"
        noun="sector"
        prev={prev ? { to: `/sectors/${prev.slug}`, title: prev.name } : null}
        next={next ? { to: `/sectors/${next.slug}`, title: next.name } : null}
      />
      <HomeClosing />
    </>
  );
}
