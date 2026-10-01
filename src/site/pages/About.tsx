import { isTbc, useContent } from '../../content';
import { HomeClosing } from '../home/HomeClosing';
import { Seo } from '../Seo';
import { breadcrumbLd } from '../seo';
import { Band, PageHero, TextLink } from '../components/ui';
import { AudienceList, WorksWith } from '../about/Audiences';
import { Chairman } from '../about/Chairman';
import { PrincipleList } from '../about/Principles';
import { Statements } from '../about/Statements';
import { clip } from '../about/text';
import { ThroughLine } from '../about/ThroughLine';

/** The closing line of the body copy is set apart as a statement when it is short enough to be one. */
const STATEMENT_MAX = 120;

export function About() {
  const content = useContent();
  const { about, pillars, people, identity } = content;

  const last = about.body[about.body.length - 1];
  const statement = about.body.length > 1 && last && last.length <= STATEMENT_MAX ? last : '';
  const reading = statement ? about.body.slice(0, -1) : about.body;
  // The About copy carries the fuller wording of the same five principles; the pillars are the fallback.
  const principles = about.principles.length ? about.principles : pillars;
  const audiences = about.audiences;
  const worksNames = about.worksWith.names.filter((n) => !isTbc(n));
  const worksNote = isTbc(about.worksWith.note) ? '' : about.worksWith.note;

  return (
    <>
      <Seo
        title="About"
        description={clip(about.lead, 300)}
        path="/about"
        jsonLd={[breadcrumbLd(content, [{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])]}
      />
      <PageHero
        title={about.heading}
        lead={about.lead}
        trail={[{ label: 'Home', to: '/' }, { label: 'About' }]}
        anchor="left bottom"
      />

      {reading.length ? (
        <Band tone="paper" labelledBy="who-title">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <h2 id="who-title" className="t-h2">
                  Who we are
                </h2>
                <p className="t-ui mt-5 text-ink-soft">
                  {identity.name}
                  <br />
                  {identity.descriptor}
                </p>
              </div>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              {reading.map((p, i) => (
                <p key={p} className={`t-body ${i ? 'mt-6' : ''}`}>
                  {p}
                </p>
              ))}
              <p className="mt-8 flex flex-wrap gap-x-8">
                <TextLink to="/approach" className="min-h-11 text-teal-deep">
                  How we work
                </TextLink>
                <TextLink to="/people" className="min-h-11 text-teal-deep">
                  See our people
                </TextLink>
              </p>
            </div>
          </div>
        </Band>
      ) : null}

      {about.throughLine.length ? (
        <Band tone="night" labelledBy="through-line-title" className="border-t border-midnight-rule">
          <h2 id="through-line-title" className="t-scene max-w-[30ch]">
            {statement || 'Our through-line'}
          </h2>
          <ThroughLine items={about.throughLine} label="The through-line, in order" />
        </Band>
      ) : null}

      {about.vision.trim() || about.mission.trim() ? (
        <Band tone="stone" as="div">
          <Statements
            items={[
              { id: 'vision-title', title: 'Vision', text: about.vision },
              { id: 'mission-title', title: 'Mission', text: about.mission },
            ]}
          />
        </Band>
      ) : null}

      {principles.length ? (
        <Band tone="paper" labelledBy="principles-title">
          <h2 id="principles-title" className="t-h2">
            Principles
          </h2>
          <div className="mt-12 lg:mt-16">
            <PrincipleList items={principles} />
          </div>
        </Band>
      ) : null}

      {audiences.length || worksNames.length ? (
        <Band tone="stone" labelledBy="audiences-title">
          <h2 id="audiences-title" className="t-h2">
            Who we work with
          </h2>
          {audiences.length ? (
            <div className="mt-12 lg:mt-16">
              <AudienceList items={audiences} />
            </div>
          ) : null}
          <WorksWith heading={about.worksWith.heading} names={worksNames} note={worksNote} />
        </Band>
      ) : null}

      <Chairman chairman={about.chairman} people={people} />
      <HomeClosing />
    </>
  );
}
