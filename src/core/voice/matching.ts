import type { Card } from '../types';

/** Extra words accepted for a card on this device, by card id (learned in the voice check). */
export type Aliases = Readonly<Record<string, readonly string[]>>;

/** Every word that counts as saying a card: its id, label, `sayAs` variants and learned aliases. */
export function namesOf(card: Card, aliases?: Aliases): string[] {
  return [card.id, card.label.toLowerCase(), ...(card.sayAs ?? []), ...(aliases?.[card.id] ?? [])];
}

/** True when a heard word names the card exactly, or as a plural ("bat", "bats", "kat"…). */
export function saysExactly(card: Card, word: string, aliases?: Aliases): boolean {
  return namesOf(card, aliases).some((name) => word === name || word === `${name}s`);
}

/** Letters to add, remove or change to turn one word into the other (Levenshtein distance). */
export function editDistance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(previous[j] + 1, row[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    previous = row;
  }
  return previous[b.length];
}

/** How far a word is from a card: the closest of its names, ignoring a plural "s". */
function distanceTo(card: Card, word: string, aliases?: Aliases): number {
  const singular = word.endsWith('s') ? word.slice(0, -1) : word;
  return Math.min(...namesOf(card, aliases).flatMap((name) => [editDistance(word, name), editDistance(singular, name)]));
}

/**
 * Relaxed hearing: the exact word, or a near miss ("bel" for bell, "gingerbred" for gingerbread)
 * that is closer to this card than to any other card in play, so rhymes like cat/hat never mix up.
 * Short words may be off by one letter, longer ones (7+ letters) by two.
 */
export function soundsLike(card: Card, word: string, deck: readonly Card[], aliases?: Aliases): boolean {
  if (saysExactly(card, word, aliases)) return true;
  if (word.length < 3) return false;
  const distance = distanceTo(card, word, aliases);
  const allowed = card.label.length >= 7 ? 2 : 1;
  if (distance > allowed) return false;
  return deck.every((other) => other.id === card.id || distanceTo(other, word, aliases) > distance);
}

/** The card a word names exactly, if any. */
export function cardNamed(word: string, deck: readonly Card[], aliases?: Aliases): Card | undefined {
  return deck.find((card) => saysExactly(card, word, aliases));
}
