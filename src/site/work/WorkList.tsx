import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { isTbc, useContent } from '../../content';
import type { Engagement } from '../../content';
import { plainTitle } from '../team/serviceUtils';
import { yearSpan } from './data';

/** The full record of published work, filterable by sector and service. Filters are buttons, results are links. */
export function WorkList({ work }: { work: Engagement[] }) {
  const { sectors, services } = useContent();
  const [sector, setSector] = useState('');
  const [service, setService] = useState('');

  const usedSectors = useMemo(() => sectors.filter((s) => work.some((e) => e.sectors.includes(s.slug))), [sectors, work]);
  const usedServices = useMemo(() => services.filter((s) => work.some((e) => e.services.includes(s.slug))), [services, work]);
  const shown = work.filter((e) => (!sector || e.sectors.includes(sector)) && (!service || e.services.includes(service)));

  const chip = (on: boolean) =>
    `t-ui inline-flex min-h-11 items-center rounded-full border px-4 transition-colors ${
      on ? 'border-midnight bg-midnight text-ivory' : 'border-midnight/25 text-midnight hover:border-midnight'
    }`;

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-2">
        <fieldset>
          <legend className="t-label text-teal-deep">Sector</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={chip(!sector)} aria-pressed={!sector} onClick={() => setSector('')}>
              All
            </button>
            {usedSectors.map((s) => (
              <button key={s.slug} type="button" className={chip(sector === s.slug)} aria-pressed={sector === s.slug} onClick={() => setSector(s.slug)}>
                {s.name}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="t-label text-teal-deep">Service</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={chip(!service)} aria-pressed={!service} onClick={() => setService('')}>
              All
            </button>
            {usedServices.map((s) => (
              <button key={s.slug} type="button" className={chip(service === s.slug)} aria-pressed={service === s.slug} onClick={() => setService(s.slug)}>
                {plainTitle(s.title)}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <p className="t-ui mt-8 text-ink-soft" aria-live="polite">
        {shown.length === work.length ? `${work.length} assignments` : `${shown.length} of ${work.length} assignments`}
      </p>
      <ul className="mt-4 border-t border-midnight/20">
        {shown.map((e) => {
          const meta = [isTbc(e.client) ? '' : e.client, isTbc(e.place) ? '' : e.place].filter(Boolean);
          return (
            <li key={e.id} className="border-b border-midnight/20">
              <Link to={`/work/${e.id}`} className="group grid gap-x-8 gap-y-2 py-7 no-underline md:grid-cols-12">
                <span className="t-ui text-ink-soft md:col-span-2">{yearSpan(e)}</span>
                <span className="md:col-span-7">
                  <span className="t-h3 block text-midnight group-hover:text-teal-deep">{e.title}</span>
                  <span className="t-ui mt-2 block max-w-[62ch] text-ink-soft">{e.summary}</span>
                </span>
                <span className="t-ui text-ink-soft md:col-span-3">{meta.join(' · ')}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
