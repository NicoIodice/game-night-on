import { shuffle, type Rng } from '../../core/random';

/**
 * State of a memory game (Pumpkin Patch Memory, Present Pairs), kept pure so it can be tested.
 * Cards lie face down; flip two at a time and keep the pairs you find.
 */

export interface MemoryLevel {
  pairs: number;
  /** Columns of the grid on a wide screen (laptop, TV). */
  columns: number;
  /** Columns on a tall screen (phone held upright). */
  tallColumns: number;
}

/** Each level is a bigger board. */
export const LEVELS: MemoryLevel[] = [
  { pairs: 6, columns: 6, tallColumns: 3 },
  { pairs: 8, columns: 6, tallColumns: 4 },
  { pairs: 10, columns: 7, tallColumns: 4 },
];

export const POINTS_PER_PAIR = 100;
/** Extra points for each pair found right after another, without a miss in between. */
export const STREAK_BONUS = 50;
/** The streak bonus stops growing after this many pairs in a row. */
export const MAX_STREAK_STEPS = 3;
/** Points per second left on the clock when the board is cleared. */
export const POINTS_PER_SECOND_LEFT = 10;
export const DEFAULT_SECONDS = 60;

export interface Board {
  /** The face (card id) of each position on the board. */
  faces: string[];
  /** Positions that are face up and not yet matched: none, one, or a pair being looked at. */
  open: number[];
  matched: boolean[];
  score: number;
  /** Cards turned over so far. */
  flips: number;
  /** Pairs found in a row. */
  streak: number;
  bestStreak: number;
}

export type FlipOutcome = 'ignored' | 'flip' | 'match' | 'mismatch';

/** Deals `pairs` random faces, each twice, shuffled. */
export function dealBoard(faces: readonly string[], pairs: number, rng: Rng): Board {
  if (faces.length < pairs) throw new Error(`dealBoard: need ${pairs} faces, got ${faces.length}`);
  const chosen = shuffle(faces, rng).slice(0, pairs);
  const dealt = shuffle([...chosen, ...chosen], rng);
  return { faces: dealt, open: [], matched: dealt.map(() => false), score: 0, flips: 0, streak: 0, bestStreak: 0 };
}

export function pairsFound(board: Board): number {
  return board.matched.filter(Boolean).length / 2;
}

export function isCleared(board: Board): boolean {
  return board.matched.every(Boolean);
}

/** True while two different cards are shown, before they're turned back. */
export function isShowingMismatch(board: Board): boolean {
  return board.open.length === 2;
}

/** Turns the shown mismatched pair face down again. */
export function hideMismatch(board: Board): Board {
  return board.open.length === 2 ? { ...board, open: [] } : board;
}

/**
 * Turns over the card at `index`. A second card either makes a pair (kept face up) or a
 * mismatch (shown until `hideMismatch`, or until the next card is flipped).
 */
export function flip(board: Board, index: number): { board: Board; outcome: FlipOutcome } {
  const ready = hideMismatch(board);
  if (index < 0 || index >= ready.faces.length || ready.matched[index] || ready.open.includes(index)) {
    return { board, outcome: 'ignored' };
  }

  const flips = ready.flips + 1;
  if (ready.open.length === 0) return { board: { ...ready, open: [index], flips }, outcome: 'flip' };

  const [first] = ready.open;
  if (ready.faces[first] !== ready.faces[index]) {
    return { board: { ...ready, open: [first, index], flips, streak: 0 }, outcome: 'mismatch' };
  }

  const streak = ready.streak + 1;
  const matched = ready.matched.map((m, i) => m || i === first || i === index);
  return {
    board: {
      ...ready,
      open: [],
      matched,
      flips,
      streak,
      bestStreak: Math.max(ready.bestStreak, streak),
      score: ready.score + POINTS_PER_PAIR + STREAK_BONUS * Math.min(streak - 1, MAX_STREAK_STEPS),
    },
    outcome: 'match',
  };
}

/** Bonus for clearing the board with time to spare. */
export function clearBonus(secondsLeft: number): number {
  return Math.floor(Math.max(0, secondsLeft)) * POINTS_PER_SECOND_LEFT;
}
