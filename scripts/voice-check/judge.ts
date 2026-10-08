import type { Card } from '../../src/core/types';
import { cardNamed, saysExactly, soundsLike } from '../../src/core/voice/matching';
import { toWords } from '../../src/core/voice/SpeechListener';

/**
 * How the game would score what the browser heard for a card, with no learned words:
 * - 'exact': strict scoring counts it (the word, a plural or a `sayAs` variant).
 * - 'relaxed': only relaxed scoring counts it (a near miss).
 * - 'other-card': it names another card of the deck, so it's marked wrong, and the voice check
 *   can't fix it (it refuses to learn another card's word).
 * - 'missed': something else, or nothing. The voice check can learn it for the device.
 */
export type Verdict = 'exact' | 'relaxed' | 'other-card' | 'missed';

export interface Judgement {
  verdict: Verdict;
  /** What the browser heard, as it reported it. */
  heard: string;
  /** The card it was taken for, for 'other-card'. */
  other?: string;
}

/** Judges a card said on its own, among the cards of its deck (as in the game). */
export function judgeWord(card: Card, deck: readonly Card[], heard: string): Judgement {
  const words = toWords(heard);
  if (words.some((word) => saysExactly(card, word))) return { verdict: 'exact', heard };
  const other = words.map((word) => cardNamed(word, deck)).find((named) => named && named.id !== card.id);
  if (other) return { verdict: 'other-card', heard, other: other.label };
  if (words.some((word) => soundsLike(card, word, deck))) return { verdict: 'relaxed', heard };
  return { verdict: 'missed', heard };
}

/**
 * Judges a whole deck said in one go, like a round of the game: for each card in order, whether
 * a word heard after the previous card's names it exactly.
 */
export function judgeSequence(deck: readonly Card[], heard: string): boolean[] {
  const words = toWords(heard);
  let next = 0;
  return deck.map((card) => {
    const at = words.findIndex((word, i) => i >= next && saysExactly(card, word));
    if (at < 0) return false;
    next = at + 1;
    return true;
  });
}

/**
 * A card the game can't be trusted with: a voice saying it alone was taken for another card (the
 * voice check can't fix that), or the browser never got it right, neither alone nor in a round.
 * Being missed only when said alone is a warning: a lone short word ("bee") often gets no
 * transcript, which the in-game voice check reports as "we didn't hear anything".
 */
export function isProblem(alone: readonly Judgement[], inARound: readonly boolean[]): boolean {
  if (alone.some((j) => j.verdict === 'other-card')) return true;
  return !alone.some((j) => j.verdict === 'exact') && !inARound.some(Boolean);
}
