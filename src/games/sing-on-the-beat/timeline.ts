import type { Cue } from '../../core/audio/beeper';
import type { Level } from './levels';

/** "Get ready", 3, 2, 1. */
const COUNTDOWN = [null, 3, 2, 1] as const;
/** Beats after singing: the first ones still listen for late words, the rest show the result. */
const RESULT_BEATS = 6;
const LISTENING_BEATS = 3;

/** What the screen shows on a given beat. */
export type Step =
  | { phase: 'countdown'; round: number; count: number | null }
  | { phase: 'sing'; round: number; active: number }
  | { phase: 'result'; round: number; final: boolean }
  | { phase: 'done' };

export function roundBeats(level: Level): number {
  return COUNTDOWN.length + level.cardCount + RESULT_BEATS;
}

/**
 * Maps a beat number to a step. Every round: countdown with blank cards, then all
 * cards appear at once with one beat per card to say it, then a pause showing the
 * result before the next round.
 */
export function stepAt(beat: number, level: Level): Step {
  const round = Math.floor(beat / roundBeats(level));
  if (round >= level.rounds) return { phase: 'done' };

  let i = beat % roundBeats(level);
  if (i < COUNTDOWN.length) return { phase: 'countdown', round, count: COUNTDOWN[i] };
  i -= COUNTDOWN.length;
  if (i < level.cardCount) return { phase: 'sing', round, active: i };
  i -= level.cardCount;
  return { phase: 'result', round, final: i >= LISTENING_BEATS };
}

/** The sound for a step: beeps on the counters, "go" on the first card, a soft tick on the rest. No music. */
export function cueFor(step: Step): Cue | null {
  switch (step.phase) {
    case 'countdown':
      return step.count === null ? null : 'count';
    case 'sing':
      return step.active === 0 ? 'go' : 'tick';
    default:
      return null;
  }
}
