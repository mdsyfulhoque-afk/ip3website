import { Link } from 'react-router-dom';
import type { AboutContent } from '../../content';
import { TextLink } from '../components/ui';
import { ChairmanVideo } from './ChairmanVideo';
import { PersonPortrait } from './PersonPortrait';

/** The chairman's note from the About content: one sentence set large, with the role, summary and video message beside it. */
export function ChairmanNote({ chairman, profileTo, portrait = '' }: { chairman: AboutContent['chairman']; profileTo?: string; portrait?: string }) {
  if (!chairman.name) return null;
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-16">
      <div className="lg:col-span-4">
        <h2 id="chairman-title" className="sr-only">
          From the chairman
        </h2>
        <div className="flex items-center gap-5 lg:items-start">
          <PersonPortrait person={{ name: chairman.name, portrait }} size="lg" />
          <div>
            <p className="font-serif text-[1.375rem] font-[420] leading-snug">
              {profileTo ? (
                <Link to={profileTo} className="underline decoration-1 underline-offset-[5px] hover:text-teal-deep">
                  {chairman.name}
                </Link>
              ) : (
                chairman.name
              )}
            </p>
            <p className="t-ui mt-1 text-ink-soft">{chairman.role}</p>
          </div>
        </div>
      </div>
      <div className="lg:col-span-8">
        {chairman.quote ? (
          <blockquote>
            <p className="font-serif text-[clamp(1.75rem,1.2rem+2.4vw,3.25rem)] font-[350] leading-[1.12] tracking-[-0.02em] text-balance">“{chairman.quote}”</p>
          </blockquote>
        ) : null}
        {chairman.summary ? <p className="t-body mt-8 text-ink-soft">{chairman.summary}</p> : null}
        <ChairmanVideo chairman={chairman} className="mt-10" />
        {profileTo ? (
          <p className="t-ui mt-6">
            <TextLink to={profileTo} className="min-h-11 text-teal-deep">
              Read the profile
            </TextLink>
          </p>
        ) : null}
      </div>
    </div>
  );
}
