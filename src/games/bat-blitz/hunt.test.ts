import { describe, expect, it } from 'vitest';
import { createSeededRng } from '../../core/random';
import {
  BAT_KINDS,
  createHunt,
  EFFECT_SECONDS,
  isOver,
  MAX_BATS,
  MAX_MULTIPLIER,
  multiplier,
  shoot,
  spawnInterval,
  stepHunt,
  STREAK_STEP,
  TURN_SECONDS,
  type Bat,
  type Hunt,
} from './hunt';

const arena = { width: 1000, height: 500 };

const bat = (id: number, x: number, y: number, kind: Bat['kind'] = 'bat'): Bat => ({
  id,
  kind,
  x,
  y,
  vx: 0.2,
  baseY: y,
  swoop: 0,
  frequency: 0,
  phase: 0,
});

const withBats = (...bats: Bat[]): Hunt => ({ ...createHunt(), bats, nextId: 100 });

/** Runs the hunt at 60fps for `seconds`. */
function run(hunt: Hunt, seconds: number, seed = 1): Hunt {
  const rng = createSeededRng(seed);
  for (let t = 0; t < seconds; t += 1 / 60) hunt = stepHunt(hunt, 1 / 60, rng);
  return hunt;
}

describe('stepHunt', () => {
  it('lets bats in over time, but never too many at once', () => {
    let hunt = createHunt();
    let most = 0;
    const rng = createSeededRng(7);
    for (let t = 0; t < TURN_SECONDS; t += 1 / 60) {
      hunt = stepHunt(hunt, 1 / 60, rng);
      most = Math.max(most, hunt.bats.length);
    }
    expect(most).toBeGreaterThan(3);
    expect(most).toBeLessThanOrEqual(MAX_BATS);
  });

  it('sends bats faster as the turn goes on', () => {
    expect(spawnInterval(TURN_SECONDS)).toBeLessThan(spawnInterval(0));
  });

  it('removes bats that fly out of the cave', () => {
    const hunt = run(withBats(bat(1, 1.05, 0.5)), 0.5);
    expect(hunt.bats.find((b) => b.id === 1)).toBeUndefined();
  });

  it('ends after the turn time, without overshooting', () => {
    const hunt = run(createHunt(), TURN_SECONDS + 1);
    expect(isOver(hunt)).toBe(true);
    expect(hunt.time).toBe(TURN_SECONDS);
  });

  it('clears shot effects after a moment', () => {
    const { hunt } = shoot(createHunt(), { x: 0.5, y: 0.5 }, arena);
    expect(hunt.effects).toHaveLength(1);
    expect(run(hunt, EFFECT_SECONDS + 0.1).effects).toHaveLength(0);
  });
});

describe('shoot', () => {
  it('hits a bat under the pointer and scores its points', () => {
    const { hunt, hit, points } = shoot(withBats(bat(1, 0.5, 0.5, 'swift')), { x: 0.51, y: 0.5 }, arena);
    expect(hit?.id).toBe(1);
    expect(points).toBe(BAT_KINDS.swift.points);
    expect(hunt.bats).toHaveLength(0);
    expect(hunt).toMatchObject({ score: points, hits: 1, shots: 1, streak: 1 });
  });

  it('picks the closest bat when two overlap', () => {
    const { hit } = shoot(withBats(bat(1, 0.5, 0.5), bat(2, 0.52, 0.5)), { x: 0.515, y: 0.5 }, arena);
    expect(hit?.id).toBe(2);
  });

  it('misses empty air and breaks the streak', () => {
    const start = { ...withBats(bat(1, 0.2, 0.2)), streak: 3 };
    const { hunt, hit } = shoot(start, { x: 0.8, y: 0.8 }, arena);
    expect(hit).toBeNull();
    expect(hunt).toMatchObject({ score: 0, shots: 1, hits: 0, streak: 0 });
    expect(hunt.bats).toHaveLength(1);
  });

  it('multiplies points for hits in a row, up to a cap', () => {
    expect(multiplier(0)).toBe(1);
    expect(multiplier(STREAK_STEP)).toBe(2);
    expect(multiplier(1000)).toBe(MAX_MULTIPLIER);

    const onAStreak = { ...withBats(bat(1, 0.5, 0.5)), streak: STREAK_STEP, bestStreak: STREAK_STEP };
    const { hunt, points } = shoot(onAStreak, { x: 0.5, y: 0.5 }, arena);
    expect(points).toBe(BAT_KINDS.bat.points * 2);
    expect(hunt.bestStreak).toBe(STREAK_STEP + 1);
  });
});
