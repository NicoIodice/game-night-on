import type { Card } from '../../core/types';

export type Mark = 'pending' | 'correct' | 'wrong' | 'missed';

export const POINTS_PER_CARD = 100;
/** Bonus for a perfect round, multiplied by the streak: 50 for the first in a row, 100 for the second… */
export const PERFECT_ROUND_BONUS = 50;

/** True when a heard word names the card ("bat", "bats", or one of its `sayAs` variants). */
export function saysCard(card: Card, word: string): boolean {
  const names = [card.id, card.label.toLowerCase(), ...(card.sayAs ?? [])];
  return names.some((name) => word === name || word === `${name}s`);
}

/** A word heard during a round, stamped with when it arrived. */
export interface HeardWord {
  word: string;
  /** The card lit when the word arrived; the hand's length once singing is over. */
  card: number;
  /** How long after that card lit up the word arrived. */
  lateMs: number;
}

/**
 * How long after the next card lights up a word still counts for the previous one.
 * Speech recognition reports words a little after they are said, so a word said right on
 * the beat often arrives once the next card is already lit.
 */
export const LATE_WORD_GRACE_MS = 350;

/** How a card went: its mark, and the word shown under it. */
export interface CardResult {
  mark: Mark;
  word?: string;
}

/** Sorts the words into the cards they were said for. */
function wordsPerCard(hand: readonly Card[], heard: readonly HeardWord[]): string[][] {
  const slots = hand.map((): string[] => []);
  for (const { word, card, lateMs } of heard) {
    // Words after the last card's beat are still for the last card.
    const lit = Math.min(card, hand.length - 1);
    const previous = card - 1;
    const late =
      card < hand.length &&
      previous >= 0 &&
      lateMs <= LATE_WORD_GRACE_MS &&
      saysCard(hand[previous], word) &&
      !slots[previous].some((said) => saysCard(hand[previous], said));
    slots[late ? previous : lit].push(word);
  }
  return slots;
}

/**
 * Judges each card by the words said while it was lit (see LATE_WORD_GRACE_MS for words
 * that arrive late). A card is right if any of its words names it. A card with no words
 * stays pending until its time is up, given as the number of cards already `passed`.
 */
export function judgeHand(hand: readonly Card[], heard: readonly HeardWord[], passed: number): CardResult[] {
  return wordsPerCard(hand, heard).map((words, i) => {
    const match = words.find((word) => saysCard(hand[i], word));
    if (match) return { mark: 'correct', word: match };
    if (words.length > 0) return { mark: 'wrong', word: words[words.length - 1] };
    return { mark: i < passed ? 'missed' : 'pending' };
  });
}

export interface RoundScore {
  points: number;
  /** Perfect rounds in a row, ending with this one; 0 when this round wasn't perfect. */
  streak: number;
}

export function isPerfect(marks: readonly Mark[]): boolean {
  return marks.length > 0 && marks.every((mark) => mark === 'correct');
}

/**
 * Scores each round in order: points per correct card, plus a bonus for a perfect round
 * that grows with every perfect round in a row. A miss resets the streak.
 */
export function scoreRounds(rounds: readonly (readonly Mark[])[]): RoundScore[] {
  let streak = 0;
  return rounds.map((marks) => {
    streak = isPerfect(marks) ? streak + 1 : 0;
    const correct = marks.filter((mark) => mark === 'correct').length;
    return { points: correct * POINTS_PER_CARD + streak * PERFECT_ROUND_BONUS, streak };
  });
}

export function totalScore(rounds: readonly (readonly Mark[])[]): number {
  return scoreRounds(rounds).reduce((sum, round) => sum + round.points, 0);
}
