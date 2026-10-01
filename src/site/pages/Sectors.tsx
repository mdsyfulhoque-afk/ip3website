import { Link } from 'react-router-dom';
import { useContent } from '../../content';
import { Seo } from '../Seo';
import { HomeClosing } from '../home/HomeClosing';
import { Band, PageHero, SectionHead } from '../components/ui';
import { describe, domainSectors, endSentence, firstSentence } from '../focus/data';
import { SectorExplorer } from '../focus/SectorExplorer';

const MAP_NOTE =
  'Evaluation and learning sits at the centre because it runs through every other sector. Lines show where sectors depend on one another.';

/** The eight sectors as one connected system: the map is for orientation, the list is the way in. */
export function Sectors() {
  const { home, sectors, domains } = useContent();
  const byDomain = domains.map((d) => ({ domain: d, items: domainSectors(d, sectors) })).filter((g) => g.items.length > 0);
  const description = describe(`${endSentence(home.sectorsHeading)} ${firstSentence(home.sectorsSub)}`);

  return (
    <>
      <Seo title="Sectors" description={description} path="/sectors" />
      <PageHero
        title="Sectors"
        lead={home.sectorsSub}
        trail={[{ label: 'Home', to: '/' }, { label: 'Sectors' }]}
        anchor="85% 15%"
      />

      {sectors.length > 0 ? (
        <Band tone="stone" labelledBy="sectors-title">
          <SectorExplorer heading={<SectionHead id="sectors-title" title={home.sectorsHeading} lead={MAP_NOTE} />} />
        </Band>
      ) : null}

      {byDomain.length > 0 ? (
        <Band tone="paper" labelledBy="by-focus-title">
          <SectionHead id="by-focus-title" title="Sectors by focus area" />
          <div className="mt-12 grid gap-x-12 gap-y-12 md:grid-cols-3 lg:mt-16">
            {byDomain.map(({ domain, items }) => (
              <div key={domain.slug} className="border-t-2 border-midnight pt-5">
                <h3 className="t-h3">
                  <Link to={`/focus/${domain.slug}`} className="underline decoration-teal-deep/40 decoration-1 underline-offset-4 hover:text-teal-deep hover:decoration-teal-deep">
                    {domain.title}
                  </Link>
                </h3>
                <ul className="mt-4">
                  {items.map((s) => (
                    <li key={s.slug}>
                      <Link
                        to={`/sectors/${s.slug}`}
                        className="t-ui inline-flex min-h-11 items-center text-teal-deep underline underline-offset-4 hover:text-midnight"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Band>
      ) : null}

      <HomeClosing />
    </>
  );
}
