import type { Cue } from './beeper';

/** How strong a good moment is: 0 a plain hit, 1 a better one, 2 the best (golden, perfect…). */
export type Strength = 0 | 1 | 2;

/**
 * A festivity's sound effects, so any game sounds like the theme it's played in without
 * bringing its own sounds. Each theme makes its own (see `themes/<theme>/sounds.ts`).
 */
export interface ThemeSounds {
  /** Something went right: a hit, a match, a correct answer. */
  good(strength?: Strength): void;
  /** Something went wrong: a miss, a mismatch, a wrong answer. */
  bad(): void;
  /** A soft neutral sound for flipping a card or pressing a button. */
  tap(): void;
  /** One pitched note on the theme's instrument, e.g. 'C5', for games that play tunes. */
  note(note: string, seconds?: number): void;
  /** Countdown and clock sounds. */
  cue(cue: Cue): void;
  /** The turn is over. */
  timeUp(): void;
  dispose(): void;
}
