import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../content';
import type { Insight } from '../../content';
import { Seo } from '../Seo';
import { Band, PageHero } from '../components/ui';
import { HomeClosing } from '../home/HomeClosing';
import { breadcrumbLd, origin } from '../seo';

const ORDER = ['Report', 'Journal article', 'Book chapter', 'Policy brief', 'Commentary'];

/** One publication as a record: year in the margin, the title as the link out, credit and a sentence below. */
export function InsightRow({ item, tone = 'paper' }: { item: Insight; tone?: 'paper' | 'night' }) {
  const { people, portfolio } = useContent();
  const authors = item.people.map((slug) => people.find((p) => p.slug === slug && p.status === 'published')).filter((p) => p !== undefined);
  const work = item.engagement ? portfolio.find((e) => e.id === item.engagement && e.status === 'published') : undefined;
  const mute = tone === 'night' ? 'text-mist' : 'text-ink-soft';
  const link = tone === 'night' ? 'text-ivory' : 'text-teal-deep';
  return (
    <li className={`grid gap-x-8 gap-y-2 border-b py-7 md:grid-cols-12 ${tone === 'night' ? 'border-midnight-rule' : 'border-midnight/20'}`}>
      <p className={`t-ui md:col-span-2 ${mute}`}>
        {item.year}
        <span className="block">{item.kind}</span>
      </p>
      <div className="md:col-span-10 lg:col-span-8">
        <h3 className="t-h3">
          {item.href ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline decoration-1 underline-offset-4 ${tone === 'night' ? 'hover:text-signal' : 'hover:text-teal-deep'}`}
            >
              {item.title}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            item.title
          )}
        </h3>
        <p className={`t-ui mt-2 ${mute}`}>
          {item.authors}. {item.publisher}.
        </p>
        <p className="t-body mt-3">{item.summary}</p>
        {authors.length || work ? (
          <p className="t-ui mt-3 flex flex-wrap gap-x-5 gap-y-1">
            {authors.map((p) => (
              <Link key={p.slug} to={`/people/${p.slug}`} className={`font-semibold underline underline-offset-4 ${link}`}>
                {p.name}
              </Link>
            ))}
            {work ? (
              <Link to={`/work/${work.id}`} className={`font-semibold underline underline-offset-4 ${link}`}>
                The assignment behind it
              </Link>
            ) : null}
          </p>
        ) : null}
      </div>
    </li>
  );
}

export function Insights() {
  const content = useContent();
  const items = (content.insights ?? []).filter((i) => i.status === 'published').sort((a, b) => b.year - a.year);
  const kinds = ORDER.filter((k) => items.some((i) => i.kind === k)).concat([...new Set(items.map((i) => i.kind))].filter((k) => !ORDER.includes(k)));
  const [kind, setKind] = useState('');
  const shown = kind ? items.filter((i) => i.kind === kind) : items;
  const lead = 'Reports, research and commentary by our team: the evidence behind the advice.';

  return (
    <>
      <Seo
        title="Insights"
        description={lead}
        path="/insights"
        jsonLd={[
          breadcrumbLd(content, [
            { name: 'Home', path: '/' },
            { name: 'Insights', path: '/insights' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            url: `${origin(content)}/insights`,
            itemListElement: items.map((i, n) => ({
              '@type': 'ListItem',
              position: n + 1,
              item: { '@type': i.kind === 'Commentary' ? 'Article' : 'ScholarlyArticle', name: i.title, datePublished: String(i.year), ...(i.href ? { url: i.href } : {}), publisher: i.publisher },
            })),
          },
        ]}
      />
      <PageHero title="Insights" lead={lead} trail={[{ label: 'Home', to: '/' }, { label: 'Insights' }]} anchor="left center" />
      <Band tone="paper" labelledBy="page-title">
        {kinds.length > 1 ? (
          <div role="group" aria-label="Show" className="flex flex-wrap gap-2">
            {['', ...kinds].map((k) => (
              <button
                key={k || 'all'}
                type="button"
                aria-pressed={kind === k}
                onClick={() => setKind(k)}
                className={`t-ui inline-flex min-h-11 items-center rounded-full border px-4 transition-colors ${
                  kind === k ? 'border-midnight bg-midnight text-ivory' : 'border-midnight/25 text-midnight hover:border-midnight'
                }`}
              >
                {k ? `${k}s`.replace('Commentarys', 'Commentary') : 'All'}
              </button>
            ))}
          </div>
        ) : null}
        <ul className="mt-8 border-t border-midnight/20">
          {shown.map((i) => (
            <InsightRow key={i.id} item={i} />
          ))}
        </ul>
        <p className="t-ui mt-8 max-w-[44rem] text-ink-soft">
          Where a report was written by a client's own team, the credit says so and names IP3's contribution. New policy briefs from current assignments will be added here as
          they are published.
        </p>
      </Band>
      <HomeClosing />
    </>
  );
}
