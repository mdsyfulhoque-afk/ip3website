import { useContent } from '../../content';
import { Seo } from '../Seo';
import { Band, PageHero } from '../components/ui';
import { HomeClosing } from '../home/HomeClosing';
import { ServiceList } from '../team/ServiceList';
import { ServiceMatrix } from '../team/ServiceMatrix';
import { plainTitle } from '../team/serviceUtils';

export function Services() {
  const { services, sectors } = useContent();
  const description = `${services.length} service lines from IP3 Consulting: ${services.map((s) => plainTitle(s.title)).join('; ')}.`;

  return (
    <>
      <Seo title="Services" description={description} path="/services" />
      <PageHero
        title="Services"
        lead="Each service line sets out what we offer, what you receive, and where it is most often used."
        trail={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
        anchor="center top"
      />
      <Band tone="paper" labelledBy="page-title">
        <ServiceList services={services} />
      </Band>
      {sectors.length > 0 && services.length > 0 ? (
        <Band tone="night" labelledBy="matrix-title">
          <div className="max-w-[44rem]">
            <h2 id="matrix-title" className="t-h2">
              Where each service is most often used
            </h2>
            <p className="t-lead mt-6 text-mist">A mark shows a sector in which the service line is most often used. Names link to their pages.</p>
          </div>
          <ServiceMatrix services={services} sectors={sectors} />
        </Band>
      ) : null}
      <HomeClosing />
    </>
  );
}
