import { useContent } from '../../content';
import { Seo } from '../Seo';
import { Band, PageHero } from '../components/ui';
import { HomeClosing } from '../home/HomeClosing';
import { breadcrumbLd } from '../seo';
import { H2 } from '../team/tones';
import { ImpactMap } from '../work/ImpactMap';
import { ImpactNumbers } from '../work/ImpactNumbers';
import { WorkList } from '../work/WorkList';
import { byDate, impactFigures, publishedWork } from '../work/data';

export function Work() {
  const content = useContent();
  const work = publishedWork(content.portfolio);
  const figures = impactFigures(work);
  const lead = `Assignments for development partners, governments and institutions since ${figures.since}: who we worked for, what we did, and where.`;

  return (
    <>
      <Seo
        title="Our work"
        description={lead}
        path="/work"
        jsonLd={[
          breadcrumbLd(content, [
            { name: 'Home', path: '/' },
            { name: 'Our work', path: '/work' },
          ]),
        ]}
      />
      <PageHero title="Our work" lead={lead} trail={[{ label: 'Home', to: '/' }, { label: 'Our work' }]} anchor="right center" />

      <Band tone="night" labelledBy="impact-title">
        <h2 id="impact-title" className="sr-only">
          Our work in numbers
        </h2>
        <ImpactNumbers figures={figures} />
      </Band>

      <Band tone="night" labelledBy="map-title" className="border-t border-midnight-rule">
        <div className="max-w-[44rem]">
          <h2 id="map-title" className={H2}>
            Where the work happened
          </h2>
          <p className="t-lead mt-4 text-mist">
            Most of our work covers the whole of Bangladesh. Where an assignment was tied to a place, it is marked. Choose a place to see what we did there.
          </p>
        </div>
        <div className="mt-10 lg:mt-14">
          <ImpactMap work={work} />
        </div>
      </Band>

      <Band tone="paper" labelledBy="list-title">
        <div className="max-w-[44rem]">
          <h2 id="list-title" className={H2}>
            Every assignment
          </h2>
          <p className="t-lead mt-4 text-ink-soft">Each one opens as a short case story: the challenge, what we did, and who we did it with.</p>
        </div>
        <div className="mt-10">
          <WorkList work={byDate(work)} />
        </div>
      </Band>
      <HomeClosing />
    </>
  );
}
