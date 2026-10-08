import { describe, expect, it } from 'vitest';
import type { Card } from '../../core/types';
import { judgeHand, scoreHand } from './scoring';

const card = (id: string, sayAs?: string[]): Card => ({ id, label: id[0].toUpperCase() + id.slice(1), image: '', sayAs });
const [cat, rat, bat, hat] = [card('cat', ['kat']), card('rat'), card('bat'), card('hat')];

describe('judgeHand', () => {
  it('scores nothing when nothing was said', () => {
    expect(judgeHand([cat, rat, bat], [], false)).toEqual(['pending', 'pending', 'pending']);
    expect(judgeHand([cat, rat, bat], [], true)).toEqual(['missed', 'missed', 'missed']);
  });

  it('marks correct words, accepting plurals and variants', () => {
    expect(judgeHand([cat, rat, bat], ['kat', 'rats', 'bat'], true)).toEqual(['correct', 'correct', 'correct']);
  });

  it('marks wrong words', () => {
    expect(judgeHand([cat, rat, bat], ['cat', 'hat', 'bat'], true)).toEqual(['correct', 'wrong', 'correct']);
  });

  it('marks a skipped card as missed without shifting the rest', () => {
    expect(judgeHand([bat, hat, bat], ['bat', 'bat'], true)).toEqual(['correct', 'missed', 'correct']);
  });

  it('keeps unsaid cards pending until the round is final', () => {
    expect(judgeHand([cat, hat, rat], ['cat'], false)).toEqual(['correct', 'pending', 'pending']);
  });
});

describe('scoreHand', () => {
  it('gives points per correct card plus a bonus for a perfect round', () => {
    expect(scoreHand(['missed', 'missed', 'missed'])).toBe(0);
    expect(scoreHand(['correct', 'wrong', 'correct'])).toBe(200);
    expect(scoreHand(['correct', 'correct', 'correct'])).toBe(350);
  });
});
