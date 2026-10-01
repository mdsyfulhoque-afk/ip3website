import type { Engagement } from '../../content';
import { engagementMeta } from './serviceUtils';
import { toneStyle, type BandTone } from './tones';

/**
 * Related engagements as a record: client, place and period in the margin, then title and summary.
 * Anything still "to be confirmed" is left out, so an entry without a nameable client never mentions one.
 */
export function ServiceWork({ engagements, tone }: { engagements: Engagement[]; tone: BandTone }) {
  const t = toneStyle(tone);
  return (
    <ul className={`border-t ${t.rule}`}>
      {engagements.map((e) => {
        const meta = engagementMeta(e);
        return (
          <li key={e.id} className={`grid gap-x-8 gap-y-2 border-b py-8 md:grid-cols-12 ${t.rule}`}>
            {meta.length ? (
              <div className={`t-ui md:col-span-3 ${t.mute}`}>
                {meta.map((m) => (
                  <p key={m}>{m}</p>
                ))}
              </div>
            ) : null}
            <div className="md:col-span-8 md:col-start-4 lg:col-span-7 lg:col-start-4">
              <h3 className="t-h3">{e.title}</h3>
              <p className={`t-ui mt-3 max-w-[62ch] ${t.mute}`}>{e.summary}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
