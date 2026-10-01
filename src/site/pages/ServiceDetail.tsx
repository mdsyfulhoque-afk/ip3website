import { Fragment, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useContent, useContentStatus } from '../../content';
import { Seo } from '../Seo';
import { Band, PageHero } from '../components/ui';
import { HomeClosing } from '../home/HomeClosing';
import { breadcrumbLd, origin } from '../seo';
import { ServicePager } from '../team/ServicePager';
import { ServiceWork } from '../team/ServiceWork';
import { relatedEngagements, serviceSectors } from '../team/serviceUtils';
import { H2, toneStyle, tonesFor, type BandTone } from '../team/tones';
import { NotFound } from './NotFound';

const ANCHORS = ['left top', 'right top', 'center bottom', 'left bottom', 'right center'];

export function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const content = useContent();
  const status = useContentStatus();
  const { services, sectors, portfolio, identity, home } = content;

  const index = services.findIndex((s) => s.slug === slug);
  const service = services[index];
  if (!service) return status === 'loading' ? <div className="min-h-[60vh]" /> : <NotFound />;

  const path = `/services/${service.slug}`;
  const used = serviceSectors(service, sectors);
  const work = relatedEngagements(service, portfolio);
  const prev = services[index - 1];
  const next = services[index + 1];

  /** Each block is a band. Tones are handed out afterwards so that a missing block never leaves two equal neighbours. */
  const blocks: { key: string; render: (tone: BandTone) => ReactNode }[] = [];

  if (service.intro.length > 0 || used.length > 0) {
    blocks.push({
      key: 'intro',
      render: (tone) => {
        const t = toneStyle(tone);
        return (
          <Band tone={tone} labelledBy="page-title">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-16">
              <div className="lg:col-span-7">
                {service.intro.map((p, i) => (
                  <p key={p} className={i === 0 ? 't-lead' : 't-body mt-6'}>
                    {p}
                  </p>
                ))}
              </div>
              {used.length > 0 ? (
                <aside aria-labelledby="used-title" className="lg:col-span-4 lg:col-start-9">
                  <h2 id="used-title" className={`t-label ${t.accent}`}>
                    Most often used in
                  </h2>
                  <ul className={`mt-3 border-t ${t.rule}`}>
                    {used.map((s) => (
                      <li key={s.slug} className={`border-b ${t.rule}`}>
                        <Link to={`/sectors/${s.slug}`} className={`t-ui flex min-h-11 items-center py-2 font-semibold underline decoration-1 underline-offset-4 ${t.link}`}>
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </aside>
              ) : null}
            </div>
          </Band>
        );
      },
    });
  }

  if (service.offers.length > 0) {
    blocks.push({
      key: 'offers',
      render: (tone) => {
        const t = toneStyle(tone);
        return (
          <Band tone={tone} labelledBy="offers-title">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-16">
              <div className="lg:col-span-4">
                <h2 id="offers-title" className={`${H2} lg:sticky lg:top-28`}>
                  What we offer
                </h2>
              </div>
              <dl className={`border-t lg:col-span-8 ${t.rule}`}>
                {service.offers.map((o) => (
                  <div key={o.title} className={`border-b py-6 md:grid md:grid-cols-12 md:gap-x-8 ${t.rule}`}>
                    <dt className="t-h3 md:col-span-5">{o.title}</dt>
                    <dd className={`t-body mt-2 md:col-span-7 md:mt-0 ${t.mute}`}>{o.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Band>
        );
      },
    });
  }

  if (service.deliverables.length > 0) {
    blocks.push({
      key: 'deliverables',
      render: (tone) => {
        const t = toneStyle(tone);
        const dot = tone === 'night' ? 'bg-signal' : 'bg-teal-deep';
        return (
          <Band tone={tone} labelledBy="deliverables-title">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-16">
              <div className="lg:col-span-4">
                <h2 id="deliverables-title" className={`${H2} lg:sticky lg:top-28`}>
                  What you receive
                </h2>
              </div>
              <ul className={`border-t lg:col-span-8 ${t.rule}`}>
                {service.deliverables.map((d) => (
                  <li key={d} className={`flex gap-4 border-b py-4 font-serif text-lg leading-snug sm:text-xl ${t.rule}`}>
                    <span aria-hidden="true" className={`mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Band>
        );
      },
    });
  }

  if (work.length > 0) {
    blocks.push({
      key: 'work',
      render: (tone) => {
        const t = toneStyle(tone);
        return (
          <Band tone={tone} labelledBy="work-title">
            <div className="max-w-[44rem]">
              <h2 id="work-title" className={H2}>
                Related work
              </h2>
              {home.workSub ? <p className={`t-lead mt-4 ${t.mute}`}>{home.workSub}</p> : null}
            </div>
            <div className="mt-10 lg:mt-14">
              <ServiceWork engagements={work} tone={tone} />
            </div>
          </Band>
        );
      },
    });
  }

  if (prev || next) {
    blocks.push({
      key: 'pager',
      render: (tone) => (
        <Band tone={tone} className="!py-12 md:!py-16">
          <ServicePager prev={prev} next={next} tone={tone} />
        </Band>
      ),
    });
  }

  const tones = tonesFor(blocks.length);

  return (
    <>
      <Seo
        title={service.title}
        description={service.short}
        path={path}
        jsonLd={[
          breadcrumbLd(content, [
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: service.title, path },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: service.title,
            description: service.short,
            url: `${origin(content)}${path}`,
            provider: { '@type': 'Organization', name: identity.name, url: origin(content) },
          },
        ]}
      />
      <PageHero
        title={service.title}
        lead={service.short}
        trail={[{ label: 'Home', to: '/' }, { label: 'Services', to: '/services' }, { label: service.title }]}
        anchor={ANCHORS[index % ANCHORS.length]}
      />
      {blocks.map((b, i) => (
        <Fragment key={b.key}>{b.render(tones[i] ?? 'paper')}</Fragment>
      ))}
      <HomeClosing />
    </>
  );
}
