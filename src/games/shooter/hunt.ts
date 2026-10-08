import { pickWeighted, type Rng } from '../../core/random';

/**
 * State of a shooting game (Bat Blitz, Snowball Showdown), kept pure so it can be tested and replayed with a seeded RNG.
 * Positions are fractions of the arena: x and y go from 0 (left/top) to 1 (right/bottom).
 */

export type TargetKind = 'common' | 'swift' | 'golden';

interface TargetSpec {
  points: number;
  /** Horizontal speed range, in arena widths per second. */
  speed: [number, number];
  /** Size as a fraction of the arena's shorter side. */
  size: number;
  /** How likely this kind is to show up, relative to the others. */
  weight: number;
  /** How far it swoops up and down, as a fraction of the arena height. */
  swoop: number;
}

export const TARGET_KINDS: Record<TargetKind, TargetSpec> = {
  common: { points: 10, speed: [0.16, 0.26], size: 0.14, weight: 75, swoop: 0.06 },
  swift: { points: 25, speed: [0.38, 0.52], size: 0.1, weight: 20, swoop: 0.1 },
  golden: { points: 50, speed: [0.26, 0.34], size: 0.13, weight: 5, swoop: 0.16 },
};

export const TURN_SECONDS = 30;
export const MAX_TARGETS = 12;
/** Hits in a row needed to raise the points multiplier by one. */
export const STREAK_STEP = 5;
export const MAX_MULTIPLIER = 4;
/** How long a hit/miss effect stays on screen. */
export const EFFECT_SECONDS = 0.6;
/** Targets start and end this far outside the arena so they fly in and out smoothly. */
const OFFSCREEN = 0.1;
/** Extra pixels around a target that still count as a hit, so fingers aren't punished. */
const TOUCH_SLACK = 10;

export interface Target {
  id: number;
  kind: TargetKind;
  x: number;
  y: number;
  /** Arena widths per second; negative flies left. */
  vx: number;
  baseY: number;
  swoop: number;
  /** Radians per second of the up-and-down swoop. */
  frequency: number;
  phase: number;
}

/** A shot's mark on screen: points for a hit, null for a miss. */
export interface Effect {
  id: number;
  x: number;
  y: number;
  points: number | null;
  time: number;
}

export interface Hunt {
  /** Seconds since the hunt began. */
  time: number;
  targets: Target[];
  effects: Effect[];
  nextId: number;
  nextSpawn: number;
  score: number;
  shots: number;
  hits: number;
  /** Hits in a row without missing. */
  streak: number;
  bestStreak: number;
}

export interface Arena {
  width: number;
  height: number;
}

export function createHunt(): Hunt {
  return { time: 0, targets: [], effects: [], nextId: 1, nextSpawn: 0.3, score: 0, shots: 0, hits: 0, streak: 0, bestStreak: 0 };
}

export function isOver(hunt: Hunt): boolean {
  return hunt.time >= TURN_SECONDS;
}

export function timeLeft(hunt: Hunt): number {
  return Math.max(0, TURN_SECONDS - hunt.time);
}

/** Targets come faster as the turn goes on: from about one per second to almost three. */
export function spawnInterval(time: number): number {
  const progress = Math.min(1, time / TURN_SECONDS);
  return 0.9 - (0.9 - 0.35) * progress;
}

export function multiplier(streak: number): number {
  return Math.min(MAX_MULTIPLIER, 1 + Math.floor(streak / STREAK_STEP));
}

/** Target size in pixels for an arena of the given size. */
export function targetSize(kind: TargetKind, arena: Arena): number {
  return TARGET_KINDS[kind].size * Math.min(arena.width, arena.height);
}

export function accuracy(hunt: Hunt): number {
  return hunt.shots === 0 ? 0 : Math.round((hunt.hits / hunt.shots) * 100);
}

function between(rng: Rng, [min, max]: readonly [number, number]): number {
  return min + rng() * (max - min);
}

function spawnTarget(id: number, rng: Rng): Target {
  const kinds = Object.keys(TARGET_KINDS) as TargetKind[];
  const kind = pickWeighted(kinds, (k) => TARGET_KINDS[k].weight, rng);
  const spec = TARGET_KINDS[kind];
  const fromLeft = rng() < 0.5;
  const speed = between(rng, spec.speed);
  const baseY = between(rng, [0.25, 0.75]);
  return {
    id,
    kind,
    x: fromLeft ? -OFFSCREEN : 1 + OFFSCREEN,
    y: baseY,
    vx: fromLeft ? speed : -speed,
    baseY,
    swoop: spec.swoop * between(rng, [0.5, 1]),
    frequency: between(rng, [2, 4]),
    phase: rng() * Math.PI * 2,
  };
}

function hasEscaped(target: Target): boolean {
  return target.vx > 0 ? target.x > 1 + OFFSCREEN : target.x < -OFFSCREEN;
}

/** Moves the hunt forward by `dt` seconds: targets fly, escape and appear. */
export function stepHunt(hunt: Hunt, dt: number, rng: Rng): Hunt {
  const time = Math.min(TURN_SECONDS, hunt.time + dt);
  const targets = hunt.targets
    .map((target) => ({
      ...target,
      x: target.x + target.vx * dt,
      y: target.baseY + Math.sin(time * target.frequency + target.phase) * target.swoop,
    }))
    .filter((target) => !hasEscaped(target));

  let { nextId, nextSpawn } = hunt;
  while (nextSpawn <= time) {
    if (targets.length < MAX_TARGETS) targets.push(spawnTarget(nextId++, rng));
    nextSpawn += spawnInterval(nextSpawn);
  }

  const effects = hunt.effects.filter((effect) => time - effect.time < EFFECT_SECONDS);
  return { ...hunt, time, targets, effects, nextId, nextSpawn };
}

export interface ShotResult {
  hunt: Hunt;
  /** The target that was hit, if any. */
  hit: Target | null;
  points: number;
}

/** Fires at a point in the arena (fractions, like target positions). Hits the closest target in reach. */
export function shoot(hunt: Hunt, point: { x: number; y: number }, arena: Arena): ShotResult {
  let hit: Target | null = null;
  let closest = Infinity;
  for (const target of hunt.targets) {
    const distance = Math.hypot((target.x - point.x) * arena.width, (target.y - point.y) * arena.height);
    const reach = targetSize(target.kind, arena) / 2 + TOUCH_SLACK;
    if (distance <= reach && distance < closest) {
      hit = target;
      closest = distance;
    }
  }

  const shots = hunt.shots + 1;
  const id = hunt.nextId;
  if (!hit) {
    const effects = [...hunt.effects, { id, x: point.x, y: point.y, points: null, time: hunt.time }];
    return { hunt: { ...hunt, shots, streak: 0, effects, nextId: id + 1 }, hit: null, points: 0 };
  }

  const points = TARGET_KINDS[hit.kind].points * multiplier(hunt.streak);
  const streak = hunt.streak + 1;
  const target = hit;
  return {
    hunt: {
      ...hunt,
      shots,
      hits: hunt.hits + 1,
      score: hunt.score + points,
      streak,
      bestStreak: Math.max(hunt.bestStreak, streak),
      targets: hunt.targets.filter((other) => other !== target),
      effects: [...hunt.effects, { id, x: target.x, y: target.y, points, time: hunt.time }],
      nextId: id + 1,
    },
    hit,
    points,
  };
}
