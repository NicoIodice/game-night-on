import { describe, expect, it } from 'vitest';
import type { Card } from '../types';
import { cardNamed, editDistance, saysExactly, soundsLike } from './matching';

const card = (id: string, sayAs?: string[]): Card => ({ id, label: id[0].toUpperCase() + id.slice(1), image: '', sayAs });
const [cat, rat, bat, hat] = [card('cat', ['kat']), card('rat'), card('bat'), card('hat')];
const rhymes = [cat, rat, bat, hat];
const [bell, gingerbread, star] = [card('bell'), card('gingerbread'), card('star')];

describe('saysExactly', () => {
  it('accepts the name, plurals, variants and learned words', () => {
    expect(saysExactly(cat, 'cat')).toBe(true);
    expect(saysExactly(cat, 'cats')).toBe(true);
    expect(saysExactly(cat, 'kat')).toBe(true);
    expect(saysExactly(cat, 'cap')).toBe(false);
    expect(saysExactly(cat, 'cap', { cat: ['cap'] })).toBe(true);
  });
});

describe('editDistance', () => {
  it('counts the letters to change', () => {
    expect(editDistance('cat', 'cat')).toBe(0);
    expect(editDistance('cat', 'hat')).toBe(1);
    expect(editDistance('bel', 'bell')).toBe(1);
    expect(editDistance('', 'abc')).toBe(3);
  });
});

describe('soundsLike', () => {
  it('accepts a near miss that only sounds like one card', () => {
    expect(soundsLike(bell, 'bel', [bell, star])).toBe(true);
    expect(soundsLike(gingerbread, 'gingerbred', [gingerbread, star])).toBe(true);
  });

  it('never mixes up rhymes: a word as close to another card does not count', () => {
    // "mat" is one letter from cat, rat, bat and hat alike, so it can't count for any of them.
    expect(soundsLike(cat, 'mat', rhymes)).toBe(false);
    expect(soundsLike(cat, 'hat', rhymes)).toBe(false);
    // "cap" is closest to cat alone, so relaxed hearing lets it count.
    expect(soundsLike(cat, 'cap', rhymes)).toBe(true);
  });

  it('still rejects words that are too different or too short', () => {
    expect(soundsLike(star, 'stone', [star, bell])).toBe(false);
    expect(soundsLike(star, 'st', [star, bell])).toBe(false);
  });
});

describe('cardNamed', () => {
  it('finds the card a word names', () => {
    expect(cardNamed('rats', rhymes)?.id).toBe('rat');
    expect(cardNamed('dog', rhymes)).toBeUndefined();
  });
});
