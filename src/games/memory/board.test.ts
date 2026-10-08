import { describe, expect, it } from 'vitest';
import { createSeededRng } from '../../core/random';
import {
  clearBonus,
  dealBoard,
  flip,
  hideMismatch,
  isCleared,
  isShowingMismatch,
  LEVELS,
  MAX_STREAK_STEPS,
  pairsFound,
  POINTS_PER_PAIR,
  STREAK_BONUS,
  type Board,
} from './board';

const FACES = ['cat', 'rat', 'bat', 'hat', 'snake', 'cake', 'grave', 'cave', 'witch', 'ghost'];

/** A board laid out in a known order. */
const board = (...faces: string[]): Board => ({
  faces,
  open: [],
  matched: faces.map(() => false),
  score: 0,
  flips: 0,
  streak: 0,
  bestStreak: 0,
});

const play = (start: Board, ...indexes: number[]) => indexes.reduce((b, i) => flip(b, i).board, start);

describe('dealBoard', () => {
  it('deals every chosen face exactly twice', () => {
    const dealt = dealBoard(FACES, 6, createSeededRng(3));
    expect(dealt.faces).toHaveLength(12);
    const counts = new Map<string, number>();
    dealt.faces.forEach((face) => counts.set(face, (counts.get(face) ?? 0) + 1));
    expect([...counts.values()].every((n) => n === 2)).toBe(true);
    expect(counts.size).toBe(6);
  });

  it('has enough faces for every level in both themes', () => {
    // Halloween has 16 picture cards and Christmas 15.
    expect(Math.max(...LEVELS.map((l) => l.pairs))).toBeLessThanOrEqual(15);
  });

  it('refuses to deal more pairs than there are faces', () => {
    expect(() => dealBoard(['a', 'b'], 3, createSeededRng(1))).toThrow();
  });
});

describe('flip', () => {
  it('keeps a pair face up and scores it', () => {
    const { board: after, outcome } = flip(play(board('cat', 'rat', 'cat', 'rat'), 0), 2);
    expect(outcome).toBe('match');
    expect(after.matched).toEqual([true, false, true, false]);
    expect(after.score).toBe(POINTS_PER_PAIR);
    expect(pairsFound(after)).toBe(1);
  });

  it('shows a mismatch until it is hidden, and breaks the streak', () => {
    const start = { ...board('cat', 'rat', 'cat', 'rat'), streak: 2 };
    const { board: after, outcome } = flip(play(start, 0), 1);
    expect(outcome).toBe('mismatch');
    expect(isShowingMismatch(after)).toBe(true);
    expect(after.streak).toBe(0);
    expect(hideMismatch(after).open).toEqual([]);
  });

  it('turns a shown mismatch back when the next card is flipped', () => {
    const after = play(board('cat', 'rat', 'cat', 'rat'), 0, 1, 2);
    expect(after.open).toEqual([2]);
  });

  it('ignores cards already matched or already face up', () => {
    const matched = play(board('cat', 'rat', 'cat', 'rat'), 0, 2);
    expect(flip(matched, 0).outcome).toBe('ignored');
    const oneUp = play(board('cat', 'rat', 'cat', 'rat'), 1);
    expect(flip(oneUp, 1).outcome).toBe('ignored');
    expect(flip(oneUp, 9).outcome).toBe('ignored');
  });

  it('adds a bonus for pairs found in a row', () => {
    const after = play(board('cat', 'cat', 'rat', 'rat'), 0, 1, 2, 3);
    expect(after.score).toBe(2 * POINTS_PER_PAIR + STREAK_BONUS);
    expect(after.bestStreak).toBe(2);
    expect(isCleared(after)).toBe(true);
    expect(after.flips).toBe(4);
  });

  it('stops growing the streak bonus after a few pairs in a row', () => {
    const start = { ...board('cat', 'cat'), streak: 10 };
    expect(flip(flip(start, 0).board, 1).board.score).toBe(POINTS_PER_PAIR + STREAK_BONUS * MAX_STREAK_STEPS);
  });
});

describe('clearBonus', () => {
  it('pays for whole seconds left, never negative', () => {
    expect(clearBonus(12.7)).toBe(120);
    expect(clearBonus(-3)).toBe(0);
  });
});
