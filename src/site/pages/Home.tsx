import { useContent } from '../../content';
import { Seo } from '../Seo';
import { organizationLd } from '../seo';
import { HomeCapabilities } from '../home/HomeCapabilities';
import { HomeClosing } from '../home/HomeClosing';
import { HomeMethod } from '../home/HomeMethod';
import { HomeSectors } from '../home/HomeSectors';
import { HomeWork } from '../home/HomeWork';
import { Journey } from '../home/Journey';

export function Home() {
  const content = useContent();
  return (
    <>
      <Seo
        title={content.identity.name}
        description={`${content.home.hero.headline} ${content.home.hero.support} ${content.home.hero.audience}`}
        path="/"
        alternates={[
          { hreflang: 'en', path: '/' },
          { hreflang: 'bn', path: '/bn' },
          { hreflang: 'x-default', path: '/' },
        ]}
        jsonLd={[organizationLd(content)]}
      />
      <Journey />
      <HomeCapabilities />
      <HomeSectors />
      <HomeWork />
      <HomeMethod />
      <HomeClosing />
    </>
  );
}
