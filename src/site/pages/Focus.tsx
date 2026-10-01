import { useContent } from '../../content';
import { Seo } from '../Seo';
import { HomeClosing } from '../home/HomeClosing';
import { PageHero } from '../components/ui';
import { FocusEntry, type EntryTone } from '../focus/FocusEntries';
import { countWord, describe } from '../focus/data';

const TONES: EntryTone[] = ['paper', 'stone', 'night'];

/** The domains of work as one long page. Each entry is composed differently so they do not read as three copies of a card. */
export function Focus() {
  const { domains } = useContent();
  const n = domains.length;
  const lead =
    n > 1
      ? `${countWord(n)} focus areas, each described by the questions clients bring to IP3.`
      : n === 1
        ? 'The questions clients bring to IP3, and the work we do on them.'
        : undefined;
  const description = describe(
    n > 0
      ? `IP3 focus areas: ${domains.map((d) => d.title).join('; ')}. The questions clients bring and the work behind them.`
      : 'The questions clients bring to IP3 and the areas of work behind them.',
    240,
  );

  return (
    <>
      <Seo title="Focus areas" description={description} path="/focus" />
      <PageHero title="Focus areas" lead={lead} trail={[{ label: 'Home', to: '/' }, { label: 'Focus areas' }]} anchor="12% 70%" />
      {domains.map((d, i) => {
        // The closing band is stone, so the last entry never is.
        let tone = TONES[i % TONES.length] ?? 'paper';
        if (i === n - 1 && tone === 'stone') tone = 'night';
        return <FocusEntry key={d.slug} domain={d} tone={tone} variant={i} />;
      })}
      <HomeClosing />
    </>
  );
}
