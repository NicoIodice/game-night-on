import { pickRandom, type Rng } from '../../core/random';

/**
 * State of a running game (Trick or Treat Dash, Gingerbread Dash), kept pure so it can be tested.
 * The runner stays put on the left while the world scrolls past. Positions: x in screen widths
 * (0 = left edge, 1 = right edge), heights in screen heights above the ground.
 */

export type ObstacleKind = 'low' | 'tall';

interface ObstacleSpec {
  /** Height in screen heights. */
  height: number;
  /** Width in screen widths. */
  width: number;
}

export const OBSTACLES: Record<ObstacleKind, ObstacleSpec> = {
  low: { height: 0.11, width: 0.05 },
  tall: { height: 0.17, width: 0.045 },
};

/** Where the runner stands, across the screen. */
export const RUNNER_X = 0.18;
const RUNNER_WIDTH = 0.04;
const RUNNER_HEIGHT = 0.14;
/** Jumping: about a third of the screen high, three quarters of a second in the air. */
const JUMP_SPEED = 1.7;
const GRAVITY = 4.5;
/** A jump pressed this long before landing still happens, as soon as the runner lands. */
const JUMP_BUFFER = 0.12;
export const LIVES = 3;
/** After a bump the runner blinks and can't be hurt for a moment. */
export const SAFE_SECONDS = 1.3;
/** Screen widths per second: picks up speed as the run goes on. */
const START_SPEED = 0.42;
const TOP_SPEED = 0.9;
const SPEED_UP_SECONDS = 50;
const TREAT_SIZE = 0.05;
/** Treats float at one of these heights: grab low ones on the run, high ones with a jump. */
const TREAT_HEIGHTS = [0.04, 0.26];

export const POINTS_PER_SCREEN = 20;
export const POINTS_PER_TREAT = 25;
export const DEFAULT_SECONDS = 45;

export interface Thing {
  id: number;
  x: number;
}

export interface Obstacle extends Thing {
  kind: ObstacleKind;
}

export interface Treat extends Thing {
  height: number;
  taken: boolean;
}

export interface Dash {
  time: number;
  /** Screens run so far. */
  distance: number;
  /** Runner's height above the ground, and upward speed. */
  y: number;
  vy: number;
  /** When a jump was pressed in the air, so it can happen on landing. */
  jumpPressedAt: number | null;
  obstacles: Obstacle[];
  treats: Treat[];
  /** Distance at which the next obstacle / treat appears at the right edge. */
  nextObstacle: number;
  nextTreat: number;
  nextId: number;
  lives: number;
  /** Bumped into something: safe until this time. */
  safeUntil: number;
  bumps: number;
  treatsTaken: number;
}

export function createDash(): Dash {
  return {
    time: 0,
    distance: 0,
    y: 0,
    vy: 0,
    jumpPressedAt: null,
    obstacles: [],
    treats: [],
    nextObstacle: 0.6,
    nextTreat: 0.9,
    nextId: 1,
    lives: LIVES,
    safeUntil: 0,
    bumps: 0,
    treatsTaken: 0,
  };
}

export function speedAt(time: number): number {
  return START_SPEED + (TOP_SPEED - START_SPEED) * Math.min(1, time / SPEED_UP_SECONDS);
}

export function onGround(dash: Dash): boolean {
  return dash.y <= 0 && dash.vy <= 0;
}

export function isSafe(dash: Dash): boolean {
  return dash.time < dash.safeUntil;
}

export function isOver(dash: Dash, seconds: number): boolean {
  return dash.lives <= 0 || dash.time >= seconds;
}

export function scoreDash(dash: Dash): number {
  return Math.floor(dash.distance * POINTS_PER_SCREEN) + dash.treatsTaken * POINTS_PER_TREAT;
}

/** Jumps if on the ground; in the air, remembers the press for a moment so it happens on landing. */
export function jump(dash: Dash): Dash {
  if (dash.lives <= 0) return dash;
  if (onGround(dash)) return { ...dash, vy: JUMP_SPEED, jumpPressedAt: null };
  return { ...dash, jumpPressedAt: dash.time };
}

function overlaps(x: number, width: number, bottom: number, height: number, dash: Dash): boolean {
  const apart = Math.abs(x - RUNNER_X) < (width + RUNNER_WIDTH) / 2;
  const touching = dash.y < bottom + height && dash.y + RUNNER_HEIGHT > bottom;
  return apart && touching;
}

/** Moves the run forward by `dt` seconds: the world scrolls, the runner falls, things appear and get hit. */
export function stepDash(dash: Dash, dt: number, rng: Rng, seconds: number = DEFAULT_SECONDS): Dash {
  if (isOver(dash, seconds)) return dash;
  const time = Math.min(seconds, dash.time + dt);
  const move = speedAt(dash.time) * (time - dash.time);
  const distance = dash.distance + move;

  // Up and down.
  let vy = dash.vy - GRAVITY * dt;
  let y = dash.y + vy * dt;
  let { jumpPressedAt } = dash;
  if (y <= 0) {
    y = 0;
    vy = 0;
    if (jumpPressedAt !== null && time - jumpPressedAt <= JUMP_BUFFER) vy = JUMP_SPEED;
    jumpPressedAt = null;
  }

  // Everything scrolls left, and drops off once it's past the left edge.
  let obstacles = dash.obstacles.map((o) => ({ ...o, x: o.x - move })).filter((o) => o.x > -0.1);
  let treats = dash.treats.map((t) => ({ ...t, x: t.x - move })).filter((t) => t.x > -0.1 && !t.taken);

  let { nextObstacle, nextTreat, nextId } = dash;
  while (nextObstacle <= distance) {
    obstacles = [...obstacles, { id: nextId++, x: 1.05 + (distance - nextObstacle), kind: pickRandom(['low', 'low', 'tall'] as const, rng) }];
    // Gaps shrink as the run speeds up, but always leave time to land and jump again.
    const gap = speedAt(time) * (0.95 + rng() * 0.9);
    nextObstacle += Math.max(gap, 0.45);
  }
  while (nextTreat <= distance) {
    treats = [...treats, { id: nextId++, x: 1.05 + (distance - nextTreat), height: pickRandom(TREAT_HEIGHTS, rng), taken: false }];
    nextTreat += 0.5 + rng() * 0.8;
  }

  let { lives, safeUntil, bumps, treatsTaken } = dash;
  const moved = { ...dash, y };

  if (time >= safeUntil) {
    const hit = obstacles.find((o) => overlaps(o.x, OBSTACLES[o.kind].width, 0, OBSTACLES[o.kind].height, moved));
    if (hit) {
      lives--;
      bumps++;
      safeUntil = time + SAFE_SECONDS;
    }
  }

  treats = treats.map((t) => {
    if (!t.taken && overlaps(t.x, TREAT_SIZE, t.height, TREAT_SIZE, moved)) {
      treatsTaken++;
      return { ...t, taken: true };
    }
    return t;
  });

  return { ...dash, time, distance, y, vy, jumpPressedAt, obstacles, treats, nextObstacle, nextTreat, nextId, lives, safeUntil, bumps, treatsTaken };
}
