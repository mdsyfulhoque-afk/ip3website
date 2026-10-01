import { isTbc, type Domain } from '../../content';
import { Band, TextLink } from '../components/ui';
import { pullMd, pullSm, QuestionsRuled } from './Questions';

export type EntryTone = 'paper' | 'stone' | 'night';

interface EntryProps {
  domain: Domain;
  tone: EntryTone;
  /** Which of the three compositions to use. Cycles if more domains are added. */
  variant: number;
}

const QUESTIONS = 'Questions clients bring';

function More({ domain, night = false }: { domain: Domain; night?: boolean }) {
  return (
    <TextLink to={`/focus/${domain.slug}`} className={`min-h-11 ${night ? 'text-signal' : 'text-teal-deep'}`}>
      Read about this focus area<span className="sr-only">: {domain.title}</span>
    </TextLink>
  );
}

/** Composition one: identity on the left and held in place, the questions as a long ruled column on the right. */
function Split({ domain, tone }: { domain: Domain; tone: EntryTone }) {
  const id = `focus-${domain.slug}`;
  return (
    <Band tone={tone} labelledBy={id}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <h2 id={id} className="t-scene">
              {domain.title}
            </h2>
            <p className="t-lead mt-6 text-ink-soft">{domain.short}</p>
            <p className="mt-8">
              <More domain={domain} />
            </p>
          </div>
        </div>
        {domain.questions.length ? (
          <div className="lg:col-span-7">
            <h3 className="t-label text-teal-deep">{QUESTIONS}</h3>
            <div className="mt-4">
              <QuestionsRuled questions={domain.questions} size="lg" />
            </div>
          </div>
        ) : null}
      </div>
    </Band>
  );
}

/** Composition two: a wide title, then the questions laid out in two columns under heavy rules. */
function Columns({ domain, tone }: { domain: Domain; tone: EntryTone }) {
  const id = `focus-${domain.slug}`;
  const night = tone === 'night';
  return (
    <Band tone={tone} labelledBy={id}>
      <h2 id={id} className="t-h2 max-w-[22ch]">
        {domain.title}
      </h2>
      <p className={`t-lead mt-6 max-w-[40rem] ${night ? 'text-mist' : 'text-ink-soft'}`}>{domain.short}</p>
      {domain.questions.length ? (
        <>
          <h3 className={`t-label mt-12 lg:mt-16 ${night ? 'text-signal' : 'text-teal-deep'}`}>{QUESTIONS}</h3>
          <ul className="mt-5 grid gap-x-14 gap-y-9 md:grid-cols-2">
            {domain.questions.map((q) => (
              <li key={q} className={`border-t-2 pt-5 ${night ? 'border-signal' : 'border-teal-deep'}`}>
                <p className={pullMd}>{q}</p>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <p className="mt-12">
        <More domain={domain} night={night} />
      </p>
    </Band>
  );
}

/** Composition three: the first question set large beside the rest, which run in a quieter column. */
function Lead({ domain, tone }: { domain: Domain; tone: EntryTone }) {
  const id = `focus-${domain.slug}`;
  const night = tone === 'night';
  const rule = night ? 'border-midnight-rule' : 'border-midnight/20';
  const [first, ...rest] = domain.questions;
  return (
    <Band tone={tone} labelledBy={id}>
      <h2 id={id} className="t-h2 max-w-[22ch]">
        {domain.title}
      </h2>
      <p className={`t-lead mt-6 max-w-[40rem] ${night ? 'text-mist' : 'text-ink-soft'}`}>{domain.short}</p>
      {first ? (
        <>
          <h3 className={`t-label mt-12 lg:mt-16 ${night ? 'text-signal' : 'text-teal-deep'}`}>{QUESTIONS}</h3>
          <ul className="mt-5 grid lg:grid-cols-12 lg:gap-x-16">
            <li
              className={`border-t py-6 lg:col-span-7 lg:pr-4 ${rule}`}
              style={rest.length > 1 ? { gridRow: `span ${rest.length}` } : undefined}
            >
              <p className="t-scene">{first}</p>
            </li>
            {rest.map((q) => (
              <li key={q} className={`border-t py-5 lg:col-span-5 lg:col-start-8 ${rule}`}>
                <p className={pullSm}>{q}</p>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <p className="mt-12">
        <More domain={domain} night={night} />
      </p>
    </Band>
  );
}

export function FocusEntry({ domain: raw, tone, variant }: EntryProps) {
  const domain = { ...raw, questions: raw.questions.filter((q) => !isTbc(q)) };
  const v = variant % 3;
  // The split composition is drawn for light backgrounds only.
  if (v === 0 && tone !== 'night') return <Split domain={domain} tone={tone} />;
  if (v === 2) return <Lead domain={domain} tone={tone} />;
  return <Columns domain={domain} tone={tone} />;
}
