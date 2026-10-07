import type { Level } from './levels';

export const INTRO_BEATS = 4;
const BEATS_PER_BAR = 4;

/** What the screen shows on a given beat. */
export type Step =
  | { phase: 'intro'; countdown: number }
  | { phase: 'reveal'; round: number; revealed: number }
  | { phase: 'sing'; round: number; active: number | null }
  | { phase: 'done' };

/** Each phase fills whole bars so the music stays on the downbeat. */
function phaseBeats(level: Level): number {
  return Math.ceil(level.cardCount / BEATS_PER_BAR) * BEATS_PER_BAR;
}

/**
 * Maps a beat number to a step. A game is: a one-bar count-in, then per round
 * the cards appear one per beat (reveal) and are then sung one per beat (sing).
 */
export function stepAt(beat: number, level: Level): Step {
  if (beat < INTRO_BEATS) return { phase: 'intro', countdown: INTRO_BEATS - beat };

  const perPhase = phaseBeats(level);
  const sinceIntro = beat - INTRO_BEATS;
  const round = Math.floor(sinceIntro / (perPhase * 2));
  if (round >= level.rounds) return { phase: 'done' };

  const inRound = sinceIntro % (perPhase * 2);
  if (inRound < perPhase) return { phase: 'reveal', round, revealed: Math.min(inRound + 1, level.cardCount) };

  const index = inRound - perPhase;
  return { phase: 'sing', round, active: index < level.cardCount ? index : null };
}
