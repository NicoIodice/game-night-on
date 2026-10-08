import { describe, expect, it } from 'vitest';
import { createSeededRng } from '../../core/random';
import {
  BONK_SECONDS,
  createPeek,
  freeHoles,
  HOLES,
  isOver,
  multiplier,
  PEEK_KINDS,
  spawnInterval,
  stayFor,
  stepPeek,
  STREAK_STEP,
  tap,
  TURN_SECONDS,
  type Peek,
  type Peeker,
  type PeekKind,
} from './peek';

const peeker = (id: number, hole: number, kind: PeekKind, leavesAt = 5): Peeker => ({
  id,
  hole,
  kind,
  shownAt: 0,
  leavesAt,
  tappedAt: null,
  points: 0,
});

const withPeekers = (...peekers: Peeker[]): Peek => ({ ...createPeek(), peekers, nextSpawn: 99 });

function run(peek: Peek, seconds: number, seed = 1): Peek {
  const rng = createSeededRng(seed);
  for (let t = 0; t < seconds; t += 1 / 60) peek = stepPeek(peek, 1 / 60, rng);
  return peek;
}

describe('stepPeek', () => {
  it('pops characters out of free holes only, one per hole', () => {
    let peek = createPeek();
    const rng = createSeededRng(4);
    for (let t = 0; t < TURN_SECONDS; t += 1 / 60) {
      peek = stepPeek(peek, 1 / 60, rng);
      const holes = peek.peekers.map((p) => p.hole);
      expect(new Set(holes).size).toBe(holes.length);
      expect(holes.every((h) => h >= 0 && h < HOLES)).toBe(true);
    }
    expect(peek.nextId).toBeGreaterThan(30);
    expect(isOver(peek)).toBe(true);
  });

  it('gets quicker as the turn goes on', () => {
    expect(spawnInterval(TURN_SECONDS)).toBeLessThan(spawnInterval(0));
    expect(stayFor('rascal', TURN_SECONDS)).toBeLessThan(stayFor('rascal', 0));
  });

  it('counts rascals that duck back in untapped as escaped, but not friends', () => {
    const peek = run(withPeekers(peeker(1, 0, 'rascal', 0.5), peeker(2, 1, 'friend', 0.5)), 1);
    expect(peek.peekers).toHaveLength(0);
    expect(peek.escaped).toBe(1);
  });

  it('keeps a tapped character on screen for a moment', () => {
    const tapped = tap(withPeekers(peeker(1, 3, 'rascal')), 3).peek;
    expect(run(tapped, BONK_SECONDS / 2).peekers).toHaveLength(1);
    expect(run(tapped, BONK_SECONDS * 2).peekers).toHaveLength(0);
  });
});

describe('tap', () => {
  it('catches a rascal for points', () => {
    const { peek, outcome, points } = tap(withPeekers(peeker(1, 3, 'rascal')), 3);
    expect(outcome).toBe('caught');
    expect(points).toBe(PEEK_KINDS.rascal.points);
    expect(peek).toMatchObject({ score: points, caught: 1, streak: 1 });
  });

  it('catches a boss for more', () => {
    expect(tap(withPeekers(peeker(1, 2, 'boss')), 2)).toMatchObject({ outcome: 'boss', points: PEEK_KINDS.boss.points });
  });

  it('takes points for tapping the friend, never below zero', () => {
    const start = { ...withPeekers(peeker(1, 2, 'friend')), score: 50, streak: 4 };
    const { peek, outcome } = tap(start, 2);
    expect(outcome).toBe('friend');
    expect(peek).toMatchObject({ score: 50 + PEEK_KINDS.friend.points, oops: 1, streak: 0 });
    expect(tap(withPeekers(peeker(1, 2, 'friend')), 2).peek.score).toBe(0);
  });

  it('breaks the streak on an empty hole, and cannot tap the same character twice', () => {
    const start = { ...withPeekers(peeker(1, 2, 'rascal')), streak: 3 };
    expect(tap(start, 7)).toMatchObject({ outcome: 'empty', peek: { streak: 0 } });
    const once = tap(start, 2).peek;
    expect(tap(once, 2).outcome).toBe('empty');
  });

  it('multiplies points on a streak', () => {
    expect(multiplier(STREAK_STEP)).toBe(2);
    const start = { ...withPeekers(peeker(1, 0, 'rascal')), streak: STREAK_STEP };
    expect(tap(start, 0).points).toBe(PEEK_KINDS.rascal.points * 2);
  });

  it('frees the hole once the character is gone', () => {
    const peek = withPeekers(peeker(1, 0, 'rascal'));
    expect(freeHoles(peek)).not.toContain(0);
    expect(freeHoles(peek)).toHaveLength(HOLES - 1);
  });
});
