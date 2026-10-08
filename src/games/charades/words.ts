import { shuffle, type Rng } from '../../core/random';

/** Points for each word the others guess. */
export const POINTS_PER_WORD = 100;
export const DEFAULT_SECONDS = 60;

/**
 * Hands out words in a random order without repeats until every word has been used, then
 * reshuffles. Keep one bag per game for the whole night so turns don't get the same words.
 */
export interface WordBag {
  draw(): string;
}

export function createWordBag(words: readonly string[], rng: Rng): WordBag {
  if (words.length === 0) throw new Error('createWordBag: no words');
  let pile: string[] = [];
  let last: string | undefined;
  return {
    draw() {
      if (pile.length === 0) {
        pile = shuffle(words, rng);
        // Don't start the new pile with the word that ended the old one.
        if (pile.length > 1 && pile[pile.length - 1] === last) [pile[0], pile[pile.length - 1]] = [pile[pile.length - 1], pile[0]];
      }
      last = pile.pop()!;
      return last;
    },
  };
}

export interface Tally {
  guessed: string[];
  skipped: string[];
}

export function scoreTally(tally: Tally): number {
  return tally.guessed.length * POINTS_PER_WORD;
}
