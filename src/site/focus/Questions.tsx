/** Questions set as large statements. Ruled lists and columns, never boxes. */

export const pullLg = 'font-serif font-[350] text-[clamp(1.5rem,1.1rem+1.7vw,2.375rem)] leading-[1.18] tracking-[-0.016em] text-balance';
export const pullMd = 'font-serif font-[350] text-[clamp(1.375rem,1.05rem+1.3vw,2rem)] leading-[1.22] tracking-[-0.012em] text-balance';
export const pullSm = 'font-serif font-[360] text-[clamp(1.1875rem,1rem+0.9vw,1.5rem)] leading-[1.3] tracking-[-0.008em] text-pretty';

type Tone = 'paper' | 'stone' | 'night';

const rule = (tone: Tone) => (tone === 'night' ? 'border-midnight-rule' : 'border-midnight/20');

/** One question per ruled row. */
export function QuestionsRuled({ questions, tone = 'paper', size = 'md' }: { questions: string[]; tone?: Tone; size?: 'md' | 'lg' }) {
  return (
    <ul className={`border-t ${rule(tone)}`}>
      {questions.map((q) => (
        <li key={q} className={`gs-card border-b ${rule(tone)} py-6 md:py-8`}>
          <p className={size === 'lg' ? pullLg : pullMd}>{q}</p>
        </li>
      ))}
    </ul>
  );
}

/** Questions side by side, each under a short heavy rule. Three fit as three columns. */
export function QuestionsColumns({ questions }: { questions: string[] }) {
  const cols = questions.length === 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2';
  return (
    <ul className={`grid gap-x-12 gap-y-10 ${cols}`}>
      {questions.map((q) => (
        <li key={q} className="gs-card border-t-2 border-teal-deep pt-5">
          <p className={pullMd}>{q}</p>
        </li>
      ))}
    </ul>
  );
}
