import { describe, expect, it } from 'vitest';
import type { Card } from '../../src/core/types';
import { isProblem, judgeSequence, judgeWord } from './judge';

const card = (id: string, label: string, sayAs?: string[]): Card => ({ id, label, image: '', sayAs });
const [vela, estrela, janela, panela] = [
  card('vela', 'Vela', ['bela']),
  card('estrela', 'Estrela'),
  card('janela', 'Janela'),
  card('panela', 'Panela'),
];
const deck = [vela, estrela, janela, panela];

describe('judgeWord', () => {
  it('counts the word, its variants and missing accents as exact', () => {
    expect(judgeWord(vela, deck, 'Vela').verdict).toBe('exact');
    expect(judgeWord(vela, deck, 'bela').verdict).toBe('exact');
    expect(judgeWord(card('caixao', 'Caixão'), [], 'caixao').verdict).toBe('exact');
  });

  it('flags a word taken for another card of the deck', () => {
    expect(judgeWord(janela, deck, 'panela')).toEqual({ verdict: 'other-card', heard: 'panela', other: 'Panela' });
  });

  it('tells near misses from words that are just wrong', () => {
    expect(judgeWord(estrela, deck, 'estrella').verdict).toBe('relaxed');
    expect(judgeWord(estrela, deck, 'cadeira').verdict).toBe('missed');
    expect(judgeWord(estrela, deck, '').verdict).toBe('missed');
  });
});

describe('judgeSequence', () => {
  it('follows the cards in order', () => {
    expect(judgeSequence(deck, 'vela estrela janela panela')).toEqual([true, true, true, true]);
    expect(judgeSequence(deck, 'vela janela panela')).toEqual([true, false, true, true]);
    // Out of order: once panela is heard, the janela before it can't count.
    expect(judgeSequence([panela, janela], 'janela panela')).toEqual([true, false]);
  });
});

describe('isProblem', () => {
  const exact = { verdict: 'exact', heard: 'vela' } as const;
  const missed = { verdict: 'missed', heard: '' } as const;
  const other = { verdict: 'other-card', heard: 'panela', other: 'Panela' } as const;

  it('is fine once a voice gets it right, alone or in a round', () => {
    expect(isProblem([exact, missed], [false, false])).toBe(false);
    expect(isProblem([missed, missed], [false, true])).toBe(false);
  });

  it('flags cards never heard right, and cards taken for another card', () => {
    expect(isProblem([missed, missed], [false, false])).toBe(true);
    expect(isProblem([exact, other], [true, true])).toBe(true);
  });
});
