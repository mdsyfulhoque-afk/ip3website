import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { phoneNumbers, useContent } from '../../content';
import { Seo } from '../Seo';
import { Band } from '../components/ui';
import { breadcrumbLd, organizationLd } from '../seo';
import { PersonPortrait } from '../team/PersonPortrait';
import { H2 } from '../team/tones';
import { ImpactMap } from '../work/ImpactMap';
import { ImpactNumbers, toBanglaDigits } from '../work/ImpactNumbers';
import { impactFigures, publishedWork, yearSpan } from '../work/data';

const ROLE_BN: Record<string, string> = {
  'Founding Director & Executive Chairman': 'প্রতিষ্ঠাতা পরিচালক ও নির্বাহী চেয়ারম্যান',
  'Founding Director & Lead Economist': 'প্রতিষ্ঠাতা পরিচালক ও প্রধান অর্থনীতিবিদ',
  'Founding Director': 'প্রতিষ্ঠাতা পরিচালক',
  'Chief Economic Advisor': 'প্রধান অর্থনৈতিক উপদেষ্টা',
  'Senior Consulting Advisor': 'জ্যেষ্ঠ পরামর্শক উপদেষ্টা',
  'Deputy Director (Practice Area Lead)': 'উপপরিচালক (প্র্যাকটিস এরিয়া লিড)',
  'Practice Area Manager': 'প্র্যাকটিস এরিয়া ম্যানেজার',
  'Affiliated Research Scholar': 'সহযোগী গবেষক',
};

/** Marks an English-only destination for Bangla readers. */
const EN = <span className="t-ui font-normal"> (ইংরেজি)</span>;

/**
 * The Bangla page: the core story in Bangla, with the impact figures and the map. Everything a visitor might
 * want in more detail links to the English pages, marked "(ইংরেজি)". All copy comes from `content.bangla`.
 */
export function Bangla() {
  const content = useContent();
  const b = content.bangla;
  const work = publishedWork(content.portfolio);
  const figures = impactFigures(work);
  const byId = new Map(work.map((e) => [e.id, e]));
  const selected = b.work.filter((w) => byId.has(w.id));
  const team = content.people.filter((p) => p.status === 'published');
  const phones = phoneNumbers(content.contact.phone);

  // The prerendered file already says lang="bn"; this keeps the attribute right when arriving by client navigation.
  useEffect(() => {
    const prev = document.documentElement.lang;
    document.documentElement.lang = 'bn';
    return () => {
      document.documentElement.lang = prev || 'en';
    };
  }, []);

  return (
    <div lang="bn">
      <Seo
        title={b.title}
        description={b.description}
        path="/bn"
        locale="bn_BD"
        alternates={[
          { hreflang: 'en', path: '/' },
          { hreflang: 'bn', path: '/bn' },
          { hreflang: 'x-default', path: '/' },
        ]}
        jsonLd={[organizationLd(content), breadcrumbLd(content, [{ name: 'বাংলা', path: '/bn' }])]}
      />

      <header className="relative isolate overflow-hidden bg-midnight text-ivory" style={{ paddingTop: 'var(--header-h)' }}>
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-60"
          style={{ backgroundImage: 'url(/contours.svg)', backgroundSize: 'cover', backgroundPosition: 'right center' }}
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-midnight via-midnight/85 to-midnight/20" />
        <div className="wrap py-[clamp(3rem,8vw,6.5rem)]">
          <p className="t-label text-signal">{b.hero.kicker}</p>
          <h1 id="page-title" className="t-display mt-6 max-w-[16ch]">
            {b.hero.headline}
          </h1>
          <p className="t-lead mt-6 max-w-[42rem] text-ivory/90">{b.hero.lead}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href={b.hero.primary.href} className="btn bg-ivory text-midnight hover:bg-white">
              {b.hero.primary.label}
            </a>
            <a href={b.hero.secondary.href} className="btn btn-line">
              {b.hero.secondary.label}
            </a>
          </div>
          <p className="t-ui mt-8 max-w-[42rem] text-mist">
            {b.englishNote}{' '}
            <Link to="/" lang="en" className="text-ivory underline underline-offset-4">
              English
            </Link>
          </p>
        </div>
      </header>

      <Band tone="paper" labelledBy="bn-about">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-16">
          <h2 id="bn-about" className={`${H2} lg:col-span-4`}>
            {b.about.heading}
          </h2>
          <div className="lg:col-span-8">
            {b.about.body.map((p, i) => (
              <p key={p} className={i === 0 ? 't-lead' : 't-body mt-6'}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </Band>

      <Band tone="night" labelledBy="bn-impact">
        <h2 id="bn-impact" className={H2}>
          {b.impactHeading}
        </h2>
        <div className="mt-10">
          <ImpactNumbers figures={figures} lang="bn" />
        </div>
      </Band>

      <Band tone="night" labelledBy="bn-map" className="border-t border-midnight-rule">
        <div className="max-w-[44rem]">
          <h2 id="bn-map" className={H2}>
            {b.mapHeading}
          </h2>
          <p className="t-lead mt-4 text-mist">{b.mapLead}</p>
        </div>
        <div className="mt-10">
          <ImpactMap work={work} lang="bn" titles={Object.fromEntries(b.work.map((w) => [w.id, w.title]))} />
        </div>
      </Band>

      <Band tone="stone" labelledBy="bn-focus">
        <h2 id="bn-focus" className={H2}>
          {b.focusHeading}
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {b.focus.map((f) => (
            <li key={f.href} className="flex flex-col border-t-2 border-teal-deep pt-5">
              <h3 className="t-h3">{f.title}</h3>
              <p className="t-body mt-3 text-ink-soft">{f.text}</p>
              <Link to={f.href} className="t-ui mt-4 font-semibold text-teal-deep underline underline-offset-4">
                বিস্তারিত{EN}
              </Link>
            </li>
          ))}
        </ul>
      </Band>

      <Band tone="paper" labelledBy="bn-services">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-16">
          <h2 id="bn-services" className={`${H2} lg:col-span-4`}>
            {b.servicesHeading}
          </h2>
          <ul className="border-t border-midnight/20 lg:col-span-8">
            {b.services.map((s) => (
              <li key={s.href} className="border-b border-midnight/20 py-6">
                <h3 className="t-h3">
                  <Link to={s.href} className="underline decoration-transparent decoration-1 underline-offset-4 hover:text-teal-deep hover:decoration-current">
                    {s.title}
                  </Link>
                </h3>
                <p className="t-body mt-2 text-ink-soft">{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </Band>

      <Band tone="stone" id="bn-work" labelledBy="bn-work-title">
        <div className="max-w-[44rem]">
          <h2 id="bn-work-title" className={H2}>
            {b.workHeading}
          </h2>
          <p className="t-lead mt-4 text-ink-soft">{b.workLead}</p>
        </div>
        <ul className="mt-10 grid gap-x-12 md:grid-cols-2">
          {selected.map((w) => {
            const e = byId.get(w.id)!;
            return (
              <li key={w.id} className="border-t border-midnight/20 py-7">
                <p className="t-ui text-ink-soft">{toBanglaDigits(yearSpan(e))}</p>
                <h3 className="t-h3 mt-1">{w.title}</h3>
                <p className="t-body mt-3 text-ink-soft">{w.summary}</p>
                <Link to={`/work/${w.id}`} className="t-ui mt-4 inline-block font-semibold text-teal-deep underline underline-offset-4">
                  পূর্ণ বিবরণ{EN}
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-8">
          <Link to="/work" className="t-ui font-semibold text-teal-deep underline underline-offset-4">
            সব {toBanglaDigits(work.length)}টি কাজ{EN}
          </Link>
        </p>
      </Band>

      <Band tone="night" labelledBy="bn-approach">
        <h2 id="bn-approach" className={H2}>
          {b.approachHeading}
        </h2>
        <ol className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {b.approach.map((a, i) => (
            <li key={a.title} className="border-t border-midnight-rule pt-5">
              <span aria-hidden="true" className="font-serif text-2xl text-signal">
                {toBanglaDigits(String(i + 1).padStart(2, '0'))}
              </span>
              <h3 className="t-h3 mt-2">{a.title}</h3>
              <p className="t-body mt-2 text-mist">{a.text}</p>
            </li>
          ))}
        </ol>
      </Band>

      <Band tone="paper" labelledBy="bn-people">
        <div className="max-w-[44rem]">
          <h2 id="bn-people" className={H2}>
            {b.peopleHeading}
          </h2>
          <p className="t-lead mt-4 text-ink-soft">{b.peopleLead}</p>
        </div>
        <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((p) => (
            <li key={p.slug} className="group relative flex items-center gap-4">
              <PersonPortrait person={p} size="md" />
              <div>
                <p className="font-serif text-lg leading-snug" lang="en">
                  <Link to={`/people/${p.slug}`} className="underline decoration-transparent underline-offset-4 after:absolute after:inset-0 group-hover:decoration-current">
                    {p.name}
                  </Link>
                </p>
                <p className="t-ui text-ink-soft">{ROLE_BN[p.role] ?? p.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </Band>

      <Band tone="stone" id="bn-contact" labelledBy="bn-contact-title">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-6">
            <h2 id="bn-contact-title" className={H2}>
              {b.contactHeading}
            </h2>
            <p className="t-lead mt-4 text-ink-soft">{b.contactLead}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/contact" className="btn btn-ink">
                বার্তা পাঠান বা সময় নির্ধারণ করুন
              </Link>
            </div>
          </div>
          <dl className="border-t border-midnight/20 lg:col-span-5 lg:col-start-8">
            <div className="border-b border-midnight/20 py-4">
              <dt className="t-label text-teal-deep">ইমেইল</dt>
              <dd className="t-body mt-1">
                <a href={`mailto:${content.contact.email}`} className="text-teal-deep underline underline-offset-4" lang="en">
                  {content.contact.email}
                </a>
              </dd>
            </div>
            {phones.length ? (
              <div className="border-b border-midnight/20 py-4">
                <dt className="t-label text-teal-deep">ফোন</dt>
                <dd className="t-body mt-1 grid">
                  {phones.map((p) => (
                    <a key={p.tel} href={`tel:${p.tel}`} className="text-teal-deep underline underline-offset-4">
                      {toBanglaDigits(p.display)}
                    </a>
                  ))}
                </dd>
              </div>
            ) : null}
            <div className="border-b border-midnight/20 py-4">
              <dt className="t-label text-teal-deep">ঠিকানা</dt>
              <dd className="t-body mt-1">
                <address className="not-italic">
                  {b.address.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              </dd>
            </div>
            <div className="border-b border-midnight/20 py-4">
              <dt className="t-label text-teal-deep">সময়</dt>
              <dd className="t-body mt-1">{b.hours}</dd>
            </div>
          </dl>
        </div>
      </Band>
    </div>
  );
}
