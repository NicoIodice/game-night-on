import { describe, expect, it } from 'vitest';
import { createSeededRng } from '../../core/random';
import {
  createDash,
  DEFAULT_SECONDS,
  isOver,
  isSafe,
  jump,
  LIVES,
  onGround,
  POINTS_PER_SCREEN,
  POINTS_PER_TREAT,
  RUNNER_X,
  SAFE_SECONDS,
  scoreDash,
  speedAt,
  stepDash,
  type Dash,
} from './dash';

const rng = () => createSeededRng(3);

/** Nothing will appear for a long while. */
const empty = (): Dash => ({ ...createDash(), nextObstacle: 999, nextTreat: 999 });

function run(dash: Dash, seconds: number, eachFrame?: (d: Dash) => Dash): Dash {
  const random = rng();
  for (let t = 0; t < seconds; t += 1 / 60) {
    dash = stepDash(dash, 1 / 60, random);
    if (eachFrame) dash = eachFrame(dash);
  }
  return dash;
}

describe('jump', () => {
  it('goes up and comes back down to the ground', () => {
    const up = run(jump(empty()), 0.3);
    expect(up.y).toBeGreaterThan(0.2);
    expect(onGround(run(up, 1))).toBe(true);
  });

  it('only jumps from the ground, but remembers a press just before landing', () => {
    let dash = run(jump(empty()), 0.7);
    expect(onGround(dash)).toBe(false);
    dash = jump(dash);
    // Lands, then bounces straight back up thanks to the remembered press.
    dash = run(dash, 0.15);
    expect(dash.vy).toBeGreaterThan(0);
  });
});

describe('stepDash', () => {
  it('scrolls the world and speeds up over time', () => {
    const dash = run(empty(), 2);
    expect(dash.distance).toBeCloseTo(speedAt(0) * 2, 1);
    expect(speedAt(40)).toBeGreaterThan(speedAt(0));
  });

  it('costs a life when running into an obstacle, then gives a moment of safety', () => {
    const start: Dash = { ...empty(), obstacles: [{ id: 1, x: RUNNER_X + 0.01, kind: 'low' }] };
    const bumped = stepDash(start, 1 / 60, rng());
    expect(bumped.lives).toBe(LIVES - 1);
    expect(isSafe(bumped)).toBe(true);
    // Still overlapping on the next frame, but safe.
    expect(stepDash(bumped, 1 / 60, rng()).lives).toBe(LIVES - 1);
    expect(isSafe(run(bumped, SAFE_SECONDS + 0.1))).toBe(false);
  });

  it('clears an obstacle with a well-timed jump', () => {
    // About a third of a second away: a comfortable time to jump.
    const start: Dash = { ...empty(), obstacles: [{ id: 1, x: RUNNER_X + speedAt(0) * 0.35, kind: 'tall' }] };
    const after = run(jump(start), 1);
    expect(after.lives).toBe(LIVES);
  });

  it('picks up treats on the way', () => {
    const start: Dash = { ...empty(), treats: [{ id: 1, x: RUNNER_X + 0.01, height: 0.04, taken: false }] };
    const after = stepDash(start, 1 / 60, rng());
    expect(after.treatsTaken).toBe(1);
  });

  it('ends after the time limit or when the lives run out', () => {
    expect(isOver(run(empty(), DEFAULT_SECONDS + 1), DEFAULT_SECONDS)).toBe(true);
    expect(isOver({ ...createDash(), lives: 0 }, DEFAULT_SECONDS)).toBe(true);
  });

  it('keeps a whole run playable: obstacles never come too close together to jump', () => {
    // Jump whenever an obstacle is just ahead: a perfect player should never get bumped.
    const dash = run(createDash(), DEFAULT_SECONDS, (d) =>
      d.obstacles.some((o) => o.x > RUNNER_X && o.x - RUNNER_X < speedAt(d.time) * 0.35) ? jump(d) : d,
    );
    expect(dash.bumps).toBe(0);
    expect(dash.obstacles.length + dash.distance).toBeGreaterThan(10);
  });
});

describe('scoreDash', () => {
  it('pays for distance and treats', () => {
    expect(scoreDash({ ...createDash(), distance: 10.6, treatsTaken: 3 })).toBe(Math.floor(10.6 * POINTS_PER_SCREEN) + 3 * POINTS_PER_TREAT);
  });
});
