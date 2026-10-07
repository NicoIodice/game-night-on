import { defaultRng, pickRandom, pickWeighted, type Rng } from '../../core/random';

export interface DealRules {
  cardCount: number;
  maxRepeats: number;
}

/** Random hands generated per deal; the trickiest ones are the most likely to be picked. */
const CANDIDATES = 24;

/**
 * How hard a hand is to sing. Switching words is harder than repeating one,
 * and coming back to a word you just left (bat-hat-bat) trips people up most.
 */
export function trickiness(hand: readonly string[]): number {
  let score = 0;
  for (let i = 1; i < hand.length; i++) {
    if (hand[i] !== hand[i - 1]) score++;
    if (i >= 2 && hand[i] === hand[i - 2] && hand[i] !== hand[i - 1]) score++;
  }
  return score;
}

/** A uniformly random hand that respects the max-repeats rule. */
function randomHand(types: readonly string[], rules: DealRules, rng: Rng): string[] {
  const counts = new Map<string, number>();
  const hand: string[] = [];
  for (let i = 0; i < rules.cardCount; i++) {
    const allowed = types.filter((type) => (counts.get(type) ?? 0) < rules.maxRepeats);
    const type = pickRandom(allowed, rng);
    counts.set(type, (counts.get(type) ?? 0) + 1);
    hand.push(type);
  }
  return hand;
}

/**
 * Deals one hand of card ids. Never repeats a card more than `maxRepeats` times,
 * avoids repeating the previous hand, and favours tricky hands while still
 * letting an easy one through now and then.
 */
export function dealHand(
  types: readonly string[],
  rules: DealRules,
  previous: readonly string[] = [],
  rng: Rng = defaultRng,
): string[] {
  if (types.length * rules.maxRepeats < rules.cardCount) {
    throw new Error(`Cannot deal ${rules.cardCount} cards from ${types.length} types with max ${rules.maxRepeats} repeats`);
  }

  const isPrevious = (hand: string[]) => hand.join() === previous.join();
  const candidates = Array.from({ length: CANDIDATES }, () => randomHand(types, rules, rng));
  const fresh = candidates.filter((hand) => !isPrevious(hand));
  return pickWeighted(fresh.length > 0 ? fresh : candidates, (hand) => 1 + trickiness(hand) ** 2, rng);
}

/** Deals a hand for every round, each one different from the round before. */
export function dealRounds(types: readonly string[], rules: DealRules, rounds: number, rng: Rng = defaultRng): string[][] {
  const hands: string[][] = [];
  for (let i = 0; i < rounds; i++) hands.push(dealHand(types, rules, hands[i - 1], rng));
  return hands;
}
