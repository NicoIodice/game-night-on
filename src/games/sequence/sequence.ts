import type { Rng } from '../../core/random';

/**
 * State of a repeat-the-sequence game (Witch's Cauldron, Bell Choir), kept pure so it can be tested.
 * The game plays a sequence of pads; the player presses them back in order. Each time they
 * get it right the sequence grows by one.
 */

export const START_LENGTH = 2;
/** Repeating a sequence this long ends the turn as a win. */
export const MAX_LENGTH = 25;
export const POINTS_PER_STEP = 10;
export const DEFAULT_PADS = 4;
export const DEFAULT_LIVES = 2;
/** Milliseconds each pad lights up for at the start; the sequence speeds up as it grows. */
export const DEFAULT_STEP_MS = 650;

export interface Sequence {
  /** Pads to press, in order. */
  steps: number[];
  /** How many of the steps the player has pressed right this time. */
  entered: number;
  pads: number;
  score: number;
  /** Mistakes the player can still afford; the turn ends when a mistake happens with none left. */
  lives: number;
  /** Mistakes made. */
  slips: number;
  /** Length of the longest sequence repeated correctly. */
  best: number;
}

export type PressOutcome = 'step' | 'repeated' | 'slip' | 'out' | 'won';

function randomPad(pads: number, rng: Rng): number {
  return Math.floor(rng() * pads);
}

export function createSequence(pads: number, lives: number, rng: Rng): Sequence {
  const steps = Array.from({ length: START_LENGTH }, () => randomPad(pads, rng));
  return { steps, entered: 0, pads, score: 0, lives: Math.max(0, lives - 1), slips: 0, best: 0 };
}

/** Adds one more pad to the end and starts the player over from the first step. */
export function extend(sequence: Sequence, rng: Rng): Sequence {
  return { ...sequence, steps: [...sequence.steps, randomPad(sequence.pads, rng)], entered: 0 };
}

/**
 * The player presses `pad`. Outcomes:
 * - 'step': right pad, more to go
 * - 'repeated': the whole sequence is done (points scored); call `extend` for the next round
 * - 'won': the longest sequence is done
 * - 'slip': wrong pad, but a life was spent; the same sequence is played again
 * - 'out': wrong pad and no lives left, the turn is over
 */
export function press(sequence: Sequence, pad: number): { sequence: Sequence; outcome: PressOutcome } {
  if (sequence.steps[sequence.entered] !== pad) {
    const slips = sequence.slips + 1;
    if (sequence.lives === 0) return { sequence: { ...sequence, slips }, outcome: 'out' };
    return { sequence: { ...sequence, slips, lives: sequence.lives - 1, entered: 0 }, outcome: 'slip' };
  }

  const entered = sequence.entered + 1;
  if (entered < sequence.steps.length) return { sequence: { ...sequence, entered }, outcome: 'step' };

  const length = sequence.steps.length;
  const done = {
    ...sequence,
    entered,
    score: sequence.score + length * POINTS_PER_STEP,
    best: Math.max(sequence.best, length),
  };
  return { sequence: done, outcome: length >= MAX_LENGTH ? 'won' : 'repeated' };
}

/** How long each pad lights up when the sequence is shown: quicker as it grows, never below half. */
export function stepMs(length: number, baseMs: number = DEFAULT_STEP_MS): number {
  return Math.max(baseMs / 2, baseMs - (length - START_LENGTH) * 20);
}
