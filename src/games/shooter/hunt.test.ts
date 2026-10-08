import { describe, expect, it } from 'vitest';
import { createSeededRng } from '../../core/random';
import {
  TARGET_KINDS,
  createHunt,
  EFFECT_SECONDS,
  isOver,
  MAX_TARGETS,
  MAX_MULTIPLIER,
  multiplier,
  shoot,
  spawnInterval,
  stepHunt,
  STREAK_STEP,
  TURN_SECONDS,
  type Target,
  type Hunt,
} from './hunt';

const arena = { width: 1000, height: 500 };

const target = (id: number, x: number, y: number, kind: Target['kind'] = 'common'): Target => ({
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

const withTargets = (...targets: Target[]): Hunt => ({ ...createHunt(), targets, nextId: 100 });

/** Runs the hunt at 60fps for `seconds`. */
function run(hunt: Hunt, seconds: number, seed = 1): Hunt {
  const rng = createSeededRng(seed);
  for (let t = 0; t < seconds; t += 1 / 60) hunt = stepHunt(hunt, 1 / 60, rng);
  return hunt;
}

describe('stepHunt', () => {
  it('lets targets in over time, but never too many at once', () => {
    let hunt = createHunt();
    let most = 0;
    const rng = createSeededRng(7);
    for (let t = 0; t < TURN_SECONDS; t += 1 / 60) {
      hunt = stepHunt(hunt, 1 / 60, rng);
      most = Math.max(most, hunt.targets.length);
    }
    expect(most).toBeGreaterThan(3);
    expect(most).toBeLessThanOrEqual(MAX_TARGETS);
  });

  it('sends targets faster as the turn goes on', () => {
    expect(spawnInterval(TURN_SECONDS)).toBeLessThan(spawnInterval(0));
  });

  it('removes targets that fly out of the arena', () => {
    const hunt = run(withTargets(target(1, 1.05, 0.5)), 0.5);
    expect(hunt.targets.find((b) => b.id === 1)).toBeUndefined();
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
  it('hits a target under the pointer and scores its points', () => {
    const { hunt, hit, points } = shoot(withTargets(target(1, 0.5, 0.5, 'swift')), { x: 0.51, y: 0.5 }, arena);
    expect(hit?.id).toBe(1);
    expect(points).toBe(TARGET_KINDS.swift.points);
    expect(hunt.targets).toHaveLength(0);
    expect(hunt).toMatchObject({ score: points, hits: 1, shots: 1, streak: 1 });
  });

  it('picks the closest target when two overlap', () => {
    const { hit } = shoot(withTargets(target(1, 0.5, 0.5), target(2, 0.52, 0.5)), { x: 0.515, y: 0.5 }, arena);
    expect(hit?.id).toBe(2);
  });

  it('misses empty air and breaks the streak', () => {
    const start = { ...withTargets(target(1, 0.2, 0.2)), streak: 3 };
    const { hunt, hit } = shoot(start, { x: 0.8, y: 0.8 }, arena);
    expect(hit).toBeNull();
    expect(hunt).toMatchObject({ score: 0, shots: 1, hits: 0, streak: 0 });
    expect(hunt.targets).toHaveLength(1);
  });

  it('multiplies points for hits in a row, up to a cap', () => {
    expect(multiplier(0)).toBe(1);
    expect(multiplier(STREAK_STEP)).toBe(2);
    expect(multiplier(1000)).toBe(MAX_MULTIPLIER);

    const onAStreak = { ...withTargets(target(1, 0.5, 0.5)), streak: STREAK_STEP, bestStreak: STREAK_STEP };
    const { hunt, points } = shoot(onAStreak, { x: 0.5, y: 0.5 }, arena);
    expect(points).toBe(TARGET_KINDS.common.points * 2);
    expect(hunt.bestStreak).toBe(STREAK_STEP + 1);
  });
});
