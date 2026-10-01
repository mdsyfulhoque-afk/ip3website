import { useContent } from '../../content';
import { Seo } from '../Seo';
import { breadcrumbLd } from '../seo';
import { HomeClosing } from '../home/HomeClosing';
import { Band, PageHero, SectionHead, TextLink } from '../components/ui';
import { CapabilityLinks } from '../about/CapabilityLinks';
import { MovementRoute } from '../about/MovementRoute';
import { PrincipleList } from '../about/Principles';
import { clip, joinList, numberWord } from '../about/text';

export function Approach() {
  const content = useContent();
  const { method, capabilities, home } = content;
  const [opening, ...more] = method.intro;
  const count = method.movements.length;
  const description = count
    ? `IP3 works through ${numberWord(count)} movements, each ending in a named output: ${joinList(method.movements.map((m) => m.title))}.`
    : clip(method.intro.join(' '), 300);

  return (
    <>
      <Seo
        title="Approach"
        description={description}
        path="/approach"
        jsonLd={[breadcrumbLd(content, [{ name: 'Home', path: '/' }, { name: 'Approach', path: '/approach' }])]}
      />
      <PageHero
        title={method.heading}
        lead={opening}
        trail={[{ label: 'Home', to: '/' }, { label: 'Approach' }]}
        anchor="center top"
      />

      {count ? (
        <Band tone="paper" labelledBy="route-title">
          <SectionHead id="route-title" title={`The ${numberWord(count)} movements`} lead={more.join(' ') || undefined} />
          <MovementRoute movements={method.movements} />
        </Band>
      ) : null}

      {method.principles.length ? (
        <Band tone="night" labelledBy="method-principles-title">
          <h2 id="method-principles-title" className="t-h2">
            Principles
          </h2>
          <div className="mt-12 lg:mt-16">
            <PrincipleList items={method.principles} tone="night" />
          </div>
        </Band>
      ) : null}

      {capabilities.length ? (
        <Band tone="paper" labelledBy="method-capabilities-title">
          <SectionHead id="method-capabilities-title" title={home.capabilitiesHeading} lead={home.capabilitiesSub} />
          <div className="mt-12 lg:mt-16">
            <CapabilityLinks items={capabilities} to="/" />
          </div>
          <p className="mt-10">
            <TextLink to="/services" className="min-h-11 text-teal-deep">
              See our services
            </TextLink>
          </p>
        </Band>
      ) : null}

      <HomeClosing />
    </>
  );
}
