import { describe, expect, it } from 'vitest';
import type { Card } from '../../core/types';
import { judgeHand, LATE_WORD_GRACE_MS, placeWords, scoreRounds, totalScore, type HeardWord, type Mark } from './scoring';

const card = (id: string, sayAs?: string[]): Card => ({ id, label: id[0].toUpperCase() + id.slice(1), image: '', sayAs });
const [cat, rat, bat, hat] = [card('cat', ['kat']), card('rat'), card('bat'), card('hat')];
/** A word that arrived `lateMs` after card number `card` lit up. */
const said = (word: string, card: number, lateMs = 200): HeardWord => ({ word, card, lateMs });
const marks = (...args: Parameters<typeof judgeHand>) => judgeHand(...args).map((result) => result.mark);

describe('judgeHand', () => {
  it('scores nothing when nothing was said', () => {
    expect(marks([cat, rat, bat], [], 0)).toEqual(['pending', 'pending', 'pending']);
    expect(marks([cat, rat, bat], [], 3)).toEqual(['missed', 'missed', 'missed']);
  });

  it('marks words said while their card was lit, accepting plurals and variants', () => {
    const heard = [said('kat', 0), said('rats', 1), said('bat', 2)];
    expect(judgeHand([cat, rat, bat], heard, 3)).toEqual([
      { mark: 'correct', word: 'kat' },
      { mark: 'correct', word: 'rats' },
      { mark: 'correct', word: 'bat' },
    ]);
  });

  it('marks wrong words, showing what was heard', () => {
    expect(judgeHand([cat, rat, bat], [said('cat', 0), said('hat', 1), said('bat', 2)], 3)[1]).toEqual({
      mark: 'wrong',
      word: 'hat',
    });
  });

  it('misses a silent card without shifting the rest', () => {
    expect(marks([bat, hat, bat], [said('bat', 0), said('bat', 2)], 3)).toEqual(['correct', 'missed', 'correct']);
  });

  it('keeps filler words inside their own card', () => {
    expect(marks([cat, hat, rat], [said('um', 0), said('cat', 0), said('hat', 1), said('rat', 2)], 3)).toEqual([
      'correct',
      'correct',
      'correct',
    ]);
  });

  it('gives a word that arrives just after the next card lit up to the card it names', () => {
    const late = [said('cat', 1, 100), said('hat', 1, 500), said('rat', 2)];
    expect(marks([cat, hat, rat], late, 3)).toEqual(['correct', 'correct', 'correct']);
  });

  it('gives a word that arrives well after the next card lit up to that next card', () => {
    const tooLate = [said('cat', 1, LATE_WORD_GRACE_MS + 1)];
    expect(judgeHand([cat, hat, rat], tooLate, 3)).toEqual([
      { mark: 'missed' },
      { mark: 'wrong', word: 'cat' },
      { mark: 'missed' },
    ]);
  });

  it('does not take a late word back for a card that was already right', () => {
    expect(marks([bat, bat], [said('bat', 0), said('bat', 1, 100)], 2)).toEqual(['correct', 'correct']);
  });

  it('counts words after the last beat for the last card', () => {
    expect(marks([cat, rat], [said('cat', 0), said('rat', 2, 900)], 2)).toEqual(['correct', 'correct']);
  });

  it('keeps unsaid cards pending until their time is up', () => {
    expect(marks([cat, hat, rat], [said('cat', 0)], 1)).toEqual(['correct', 'pending', 'pending']);
    expect(marks([cat, hat, rat], [said('cat', 0)], 2)).toEqual(['correct', 'missed', 'pending']);
  });
});

describe('scoreRounds', () => {
  const perfect: Mark[] = ['correct', 'correct', 'correct'];
  const slip: Mark[] = ['correct', 'wrong', 'correct'];

  it('gives points per correct card plus a bonus for a perfect round', () => {
    expect(scoreRounds([['missed', 'missed', 'missed']])).toEqual([{ points: 0, streak: 0 }]);
    expect(scoreRounds([slip])).toEqual([{ points: 200, streak: 0 }]);
    expect(scoreRounds([perfect])).toEqual([{ points: 350, streak: 1 }]);
  });

  it('grows the bonus with every perfect round in a row, and resets it after a slip', () => {
    expect(scoreRounds([perfect, perfect, perfect]).map((r) => r.points)).toEqual([350, 400, 450]);
    expect(scoreRounds([perfect, slip, perfect]).map((r) => r.streak)).toEqual([1, 0, 1]);
    expect(totalScore([perfect, slip, perfect])).toBe(900);
  });
});

describe('hearing from the voice check', () => {
  const bell = card('bell');
  const star = card('star');

  it('accepts words learned on this device', () => {
    expect(marks([cat, rat], [said('cap', 0), said('rat', 1)], 2, { aliases: { cat: ['cap'] } })).toEqual(['correct', 'correct']);
    expect(marks([cat, rat], [said('cap', 0), said('rat', 1)], 2)).toEqual(['wrong', 'correct']);
  });

  it('accepts near misses only when relaxed, and never a rhyme of another card', () => {
    const deck = [bell, star, cat, hat];
    expect(marks([bell, star], [said('bel', 0), said('star', 1)], 2)).toEqual(['wrong', 'correct']);
    expect(marks([bell, star], [said('bel', 0), said('star', 1)], 2, { relaxed: true, deck })).toEqual(['correct', 'correct']);
    expect(marks([cat, hat], [said('hat', 0), said('hat', 1)], 2, { relaxed: true, deck })).toEqual(['wrong', 'correct']);
  });

  it("uses the device's own window for late words", () => {
    const late = [said('cat', 1, LATE_WORD_GRACE_MS + 150), said('rat', 1, LATE_WORD_GRACE_MS + 300)];
    expect(placeWords([cat, rat], late)).toEqual([1, 1]);
    expect(placeWords([cat, rat], late, { graceMs: LATE_WORD_GRACE_MS + 200 })).toEqual([0, 1]);
  });
});
