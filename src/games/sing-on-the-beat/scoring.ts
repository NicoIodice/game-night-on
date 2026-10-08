import type { Card } from '../../core/types';

export type Mark = 'pending' | 'correct' | 'wrong' | 'missed';

export const POINTS_PER_CARD = 100;
export const PERFECT_ROUND_BONUS = 50;

/** True when a heard word names the card ("bat", "bats", or one of its `sayAs` variants). */
export function saysCard(card: Card, word: string): boolean {
  const names = [card.id, card.label.toLowerCase(), ...(card.sayAs ?? [])];
  return names.some((name) => word === name || word === `${name}s`);
}

/**
 * Lines up the words heard with the cards, in order. A word that matches the next
 * card instead means the current card was skipped. Until `final`, cards nobody has
 * said yet stay pending; after that they count as missed.
 */
export function judgeHand(hand: readonly Card[], heard: readonly string[], final: boolean): Mark[] {
  let next = 0;
  return hand.map((card, i) => {
    const word = heard[next];
    if (word === undefined) return final ? 'missed' : 'pending';
    if (saysCard(card, word)) {
      next++;
      return 'correct';
    }
    const following = hand[i + 1];
    if (following && saysCard(following, word)) return 'missed';
    next++;
    return 'wrong';
  });
}

export function scoreHand(marks: readonly Mark[]): number {
  const correct = marks.filter((mark) => mark === 'correct').length;
  const perfect = marks.length > 0 && correct === marks.length;
  return correct * POINTS_PER_CARD + (perfect ? PERFECT_ROUND_BONUS : 0);
}
