import { useContent } from '../../content';
import { Seo } from '../Seo';
import { Band, PageHero } from '../components/ui';
import { HomeClosing } from '../home/HomeClosing';
import { ChairmanNote } from '../team/ChairmanNote';
import { PeopleDirectory } from '../team/PeopleDirectory';
import { groupPeople } from '../team/groups';

export function People() {
  const { people, about, identity } = useContent();
  const groups = groupPeople(people);
  const count = groups.reduce((n, g) => n + g.people.length, 0);
  const chair = about.chairman;
  const chairProfile = people.find((p) => p.status === 'published' && p.name === chair.name);
  const showNote = Boolean(chair.name && (chair.quote || chair.summary));

  const description = `The leadership and specialists of ${identity.name}: ${count} people across ${groups
    .map((g) => g.label.toLowerCase())
    .join(', ')}, with their roles and practice areas.`;

  return (
    <>
      <Seo title="People" description={description} path="/people" />
      <PageHero
        title="People"
        lead="The institute's founding directors, advisors, practice leads and affiliated research scholars."
        trail={[{ label: 'Home', to: '/' }, { label: 'People' }]}
        anchor="center"
      />
      {showNote ? (
        <Band tone="stone" labelledBy="chairman-title">
          <ChairmanNote chairman={chair} profileTo={chairProfile ? `/people/${chairProfile.slug}` : undefined} portrait={chairProfile?.portrait ?? ''} />
        </Band>
      ) : null}
      {groups.length > 0 ? (
        <Band tone="paper" labelledBy={showNote ? undefined : 'page-title'} id="directory">
          <PeopleDirectory groups={groups} />
        </Band>
      ) : null}
      <HomeClosing />
    </>
  );
}
