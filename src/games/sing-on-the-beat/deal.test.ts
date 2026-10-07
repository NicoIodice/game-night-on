import { describe, expect, it } from 'vitest';
import { createSeededRng } from '../../core/random';
import { dealHand, dealRounds, trickiness } from './deal';

const TYPES = ['cat', 'rat', 'bat', 'hat'];
const RULES = { cardCount: 3, maxRepeats: 2 };

const maxCount = (hand: string[]) =>
  Math.max(...TYPES.map((type) => hand.filter((card) => card === type).length));

describe('trickiness', () => {
  it('ranks coming back to a word above all-different above repeats', () => {
    expect(trickiness(['bat', 'hat', 'bat'])).toBeGreaterThan(trickiness(['bat', 'hat', 'cat']));
    expect(trickiness(['bat', 'hat', 'cat'])).toBeGreaterThan(trickiness(['bat', 'bat', 'hat']));
  });
});

describe('dealHand', () => {
  const rng = createSeededRng(42);
  const hands = Array.from({ length: 2000 }, () => dealHand(TYPES, RULES, [], rng));

  it('deals the requested number of cards from the given types', () => {
    for (const hand of hands) {
      expect(hand).toHaveLength(3);
      hand.forEach((card) => expect(TYPES).toContain(card));
    }
  });

  it('never deals the same card three times', () => {
    for (const hand of hands) expect(maxCount(hand)).toBeLessThanOrEqual(2);
  });

  it('still allows the same card twice', () => {
    expect(hands.some((hand) => maxCount(hand) === 2)).toBe(true);
  });

  it('favours tricky hands over easy ones', () => {
    const easy = hands.filter((hand) => hand[0] === hand[1] || hand[1] === hand[2]).length;
    expect(easy / hands.length).toBeLessThan(0.3);
  });

  it('rejects impossible rules', () => {
    expect(() => dealHand(['cat'], RULES)).toThrow();
  });
});

describe('dealRounds', () => {
  it('never deals the same hand twice in a row', () => {
    const rounds = dealRounds(['cat', 'rat'], { cardCount: 2, maxRepeats: 2 }, 200, createSeededRng(7));
    for (let i = 1; i < rounds.length; i++) expect(rounds[i]).not.toEqual(rounds[i - 1]);
  });
});
