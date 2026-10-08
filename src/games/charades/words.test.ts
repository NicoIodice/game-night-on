import { describe, expect, it } from 'vitest';
import { createSeededRng } from '../../core/random';
import { createWordBag, POINTS_PER_WORD, scoreTally } from './words';

const WORDS = ['mummy', 'zombie', 'witch', 'ghost', 'vampire'];

describe('createWordBag', () => {
  it('uses every word once before repeating any', () => {
    const bag = createWordBag(WORDS, createSeededRng(2));
    const first = Array.from({ length: WORDS.length }, () => bag.draw());
    expect([...first].sort()).toEqual([...WORDS].sort());
  });

  it('keeps going after the words run out, without the same word twice in a row', () => {
    const bag = createWordBag(WORDS, createSeededRng(9));
    const drawn = Array.from({ length: WORDS.length * 6 }, () => bag.draw());
    expect(drawn.every((word, i) => i === 0 || word !== drawn[i - 1])).toBe(true);
  });

  it('needs at least one word', () => {
    expect(() => createWordBag([], createSeededRng(1))).toThrow();
  });
});

describe('scoreTally', () => {
  it('scores guessed words only', () => {
    expect(scoreTally({ guessed: ['mummy', 'witch'], skipped: ['ghost'] })).toBe(2 * POINTS_PER_WORD);
  });
});
