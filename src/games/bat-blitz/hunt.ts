import { pickWeighted, type Rng } from '../../core/random';

/**
 * Bat Blitz game state, kept pure so it can be tested and replayed with a seeded RNG.
 * Positions are fractions of the cave: x and y go from 0 (left/top) to 1 (right/bottom).
 */

export type BatKind = 'bat' | 'swift' | 'golden';

interface BatSpec {
  points: number;
  /** Horizontal speed range, in cave widths per second. */
  speed: [number, number];
  /** Size as a fraction of the cave's shorter side. */
  size: number;
  /** How likely this kind is to show up, relative to the others. */
  weight: number;
  /** How far it swoops up and down, as a fraction of the cave height. */
  swoop: number;
}

export const BAT_KINDS: Record<BatKind, BatSpec> = {
  bat: { points: 10, speed: [0.16, 0.26], size: 0.14, weight: 75, swoop: 0.06 },
  swift: { points: 25, speed: [0.38, 0.52], size: 0.1, weight: 20, swoop: 0.1 },
  golden: { points: 50, speed: [0.26, 0.34], size: 0.13, weight: 5, swoop: 0.16 },
};

export const TURN_SECONDS = 30;
export const MAX_BATS = 12;
/** Hits in a row needed to raise the points multiplier by one. */
export const STREAK_STEP = 5;
export const MAX_MULTIPLIER = 4;
/** How long a hit/miss effect stays on screen. */
export const EFFECT_SECONDS = 0.6;
/** Bats start and end this far outside the cave so they fly in and out smoothly. */
const OFFSCREEN = 0.1;
/** Extra pixels around a bat that still count as a hit, so fingers aren't punished. */
const TOUCH_SLACK = 10;

export interface Bat {
  id: number;
  kind: BatKind;
  x: number;
  y: number;
  /** Cave widths per second; negative flies left. */
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
  bats: Bat[];
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
  return { time: 0, bats: [], effects: [], nextId: 1, nextSpawn: 0.3, score: 0, shots: 0, hits: 0, streak: 0, bestStreak: 0 };
}

export function isOver(hunt: Hunt): boolean {
  return hunt.time >= TURN_SECONDS;
}

export function timeLeft(hunt: Hunt): number {
  return Math.max(0, TURN_SECONDS - hunt.time);
}

/** Bats come faster as the turn goes on: from about one per second to almost three. */
export function spawnInterval(time: number): number {
  const progress = Math.min(1, time / TURN_SECONDS);
  return 0.9 - (0.9 - 0.35) * progress;
}

export function multiplier(streak: number): number {
  return Math.min(MAX_MULTIPLIER, 1 + Math.floor(streak / STREAK_STEP));
}

/** Bat size in pixels for a cave of the given size. */
export function batSize(kind: BatKind, arena: Arena): number {
  return BAT_KINDS[kind].size * Math.min(arena.width, arena.height);
}

export function accuracy(hunt: Hunt): number {
  return hunt.shots === 0 ? 0 : Math.round((hunt.hits / hunt.shots) * 100);
}

function between(rng: Rng, [min, max]: readonly [number, number]): number {
  return min + rng() * (max - min);
}

function spawnBat(id: number, rng: Rng): Bat {
  const kinds = Object.keys(BAT_KINDS) as BatKind[];
  const kind = pickWeighted(kinds, (k) => BAT_KINDS[k].weight, rng);
  const spec = BAT_KINDS[kind];
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

function hasEscaped(bat: Bat): boolean {
  return bat.vx > 0 ? bat.x > 1 + OFFSCREEN : bat.x < -OFFSCREEN;
}

/** Moves the hunt forward by `dt` seconds: bats fly, escape and appear. */
export function stepHunt(hunt: Hunt, dt: number, rng: Rng): Hunt {
  const time = Math.min(TURN_SECONDS, hunt.time + dt);
  const bats = hunt.bats
    .map((bat) => ({
      ...bat,
      x: bat.x + bat.vx * dt,
      y: bat.baseY + Math.sin(time * bat.frequency + bat.phase) * bat.swoop,
    }))
    .filter((bat) => !hasEscaped(bat));

  let { nextId, nextSpawn } = hunt;
  while (nextSpawn <= time) {
    if (bats.length < MAX_BATS) bats.push(spawnBat(nextId++, rng));
    nextSpawn += spawnInterval(nextSpawn);
  }

  const effects = hunt.effects.filter((effect) => time - effect.time < EFFECT_SECONDS);
  return { ...hunt, time, bats, effects, nextId, nextSpawn };
}

export interface ShotResult {
  hunt: Hunt;
  /** The bat that was hit, if any. */
  hit: Bat | null;
  points: number;
}

/** Fires at a point in the cave (fractions, like bat positions). Hits the closest bat in reach. */
export function shoot(hunt: Hunt, point: { x: number; y: number }, arena: Arena): ShotResult {
  let hit: Bat | null = null;
  let closest = Infinity;
  for (const bat of hunt.bats) {
    const distance = Math.hypot((bat.x - point.x) * arena.width, (bat.y - point.y) * arena.height);
    const reach = batSize(bat.kind, arena) / 2 + TOUCH_SLACK;
    if (distance <= reach && distance < closest) {
      hit = bat;
      closest = distance;
    }
  }

  const shots = hunt.shots + 1;
  const id = hunt.nextId;
  if (!hit) {
    const effects = [...hunt.effects, { id, x: point.x, y: point.y, points: null, time: hunt.time }];
    return { hunt: { ...hunt, shots, streak: 0, effects, nextId: id + 1 }, hit: null, points: 0 };
  }

  const points = BAT_KINDS[hit.kind].points * multiplier(hunt.streak);
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
      bats: hunt.bats.filter((bat) => bat !== target),
      effects: [...hunt.effects, { id, x: target.x, y: target.y, points, time: hunt.time }],
      nextId: id + 1,
    },
    hit,
    points,
  };
}
