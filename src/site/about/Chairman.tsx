import { isTbc, type AboutContent, type Person } from '../../content';
import { TextLink } from '../components/ui';
import { ChairmanVideo } from '../team/ChairmanVideo';
import { PersonPortrait } from '../team/PersonPortrait';

/**
 * The chairman as a calm reading section: portrait (or monogram), name and role, then the quote (only when
 * there is a real one), the summary and the video message once one is uploaded. Anything empty or
 * "to be confirmed" is left out.
 */
export function Chairman({ chairman, people }: { chairman: AboutContent['chairman']; people: Person[] }) {
  if (isTbc(chairman.name)) return null;
  const role = isTbc(chairman.role) ? '' : chairman.role;
  const quote = isTbc(chairman.quote) ? '' : chairman.quote;
  const summary = isTbc(chairman.summary) ? '' : chairman.summary;
  const partners = chairman.partners.filter((p) => !isTbc(p));
  const profile = people.find((p) => p.status === 'published' && p.name === chairman.name);

  return (
    <section aria-labelledby="leadership-title" className="on-paper band border-t border-midnight/10">
      <div className="wrap">
        <h2 id="leadership-title" className="t-h2">
          Leadership
        </h2>
        <div className="mt-12 grid gap-10 border-t border-midnight/20 pt-10 lg:mt-16 lg:grid-cols-12 lg:gap-14 lg:pt-14">
          <div className="flex items-center gap-5 lg:col-span-4 lg:flex-col lg:items-start">
            <PersonPortrait person={{ name: chairman.name, portrait: profile?.portrait ?? '' }} size="lg" />
            <div>
              <h3 className="t-h3">{chairman.name}</h3>
              {role ? <p className="t-ui mt-1 text-ink-soft">{role}</p> : null}
            </div>
          </div>
          <div className="lg:col-span-8">
            {quote ? (
              <blockquote className="max-w-[26em] font-serif text-[clamp(1.5rem,1.05rem+1.4vw,2.125rem)] font-[350] leading-[1.32] tracking-[-0.012em] text-pretty">
                <p>
                  <span aria-hidden="true">“</span>
                  {quote}
                  <span aria-hidden="true">”</span>
                </p>
              </blockquote>
            ) : null}
            {summary ? <p className={`t-body ${quote ? 'mt-8' : ''}`}>{summary}</p> : null}
            <ChairmanVideo chairman={chairman} className="mt-10 max-w-[44rem]" />
            {partners.length ? (
              <div className="mt-8">
                <p className="t-label text-teal-deep">Partners</p>
                <ul role="list" className="t-ui mt-2 grid gap-1">
                  {partners.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <p className="mt-6 flex flex-wrap gap-x-8">
              {profile ? (
                <TextLink to={`/people/${profile.slug}`} className="min-h-11 text-teal-deep">
                  {`${profile.name}’s profile`}
                </TextLink>
              ) : null}
              <TextLink to="/people" className="min-h-11 text-teal-deep">
                See our people
              </TextLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
