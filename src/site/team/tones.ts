export type BandTone = 'paper' | 'stone' | 'night';

const CYCLE: BandTone[] = ['paper', 'stone', 'night'];

/**
 * Tones for `count` bands that follow the dark page hero and precede the stone closing band.
 * Neighbouring bands never share a tone, even when a band is left out because its content is empty.
 */
export function tonesFor(count: number): BandTone[] {
  const tones = Array.from({ length: count }, (_, i) => CYCLE[i % CYCLE.length] ?? 'paper');
  if (count > 0 && tones[count - 1] === 'stone') tones[count - 1] = 'night';
  return tones;
}

export interface ToneStyle {
  /** Hairline between list rows. */
  rule: string;
  /** Secondary text. */
  mute: string;
  /** Small labels and markers. */
  accent: string;
  /** Inline links. */
  link: string;
}

/** Colour classes that keep contrast on each band tone (AA on ivory, stone and midnight). */
export function toneStyle(tone: BandTone): ToneStyle {
  if (tone === 'night') {
    return { rule: 'border-midnight-rule', mute: 'text-mist', accent: 'text-signal', link: 'text-ivory' };
  }
  return { rule: 'border-midnight/20', mute: 'text-ink-soft', accent: 'text-teal-deep', link: 'text-teal-deep' };
}

/** Section heading for inner pages: a step below the page title, a step above the lead text. */
export const H2 = 'gs-reveal font-serif text-[clamp(1.875rem,1.3rem+2.2vw,2.875rem)] font-[380] leading-[1.08] tracking-[-0.02em] text-balance';
