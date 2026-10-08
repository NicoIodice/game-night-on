import { describe, expect, it } from 'vitest';
import { createSeededRng } from '../../core/random';
import {
  createSequence,
  DEFAULT_STEP_MS,
  extend,
  MAX_LENGTH,
  POINTS_PER_STEP,
  press,
  START_LENGTH,
  stepMs,
  type Sequence,
} from './sequence';

const sequence = (steps: number[], lives = 0): Sequence => ({ steps, entered: 0, pads: 4, score: 0, lives, slips: 0, best: 0 });

const pressAll = (start: Sequence, pads: number[]) => pads.reduce((s, pad) => press(s, pad).sequence, start);

describe('createSequence', () => {
  it('starts short, using only the pads in play', () => {
    const created = createSequence(3, 2, createSeededRng(5));
    expect(created.steps).toHaveLength(START_LENGTH);
    expect(created.steps.every((pad) => pad >= 0 && pad < 3)).toBe(true);
    // Two lives = one mistake allowed.
    expect(created.lives).toBe(1);
  });
});

describe('press', () => {
  it('moves along the sequence while the pads are right', () => {
    const { sequence: after, outcome } = press(sequence([2, 0, 1]), 2);
    expect(outcome).toBe('step');
    expect(after.entered).toBe(1);
  });

  it('scores the whole sequence once it is repeated', () => {
    const start = pressAll(sequence([2, 0, 1]), [2, 0]);
    const { sequence: after, outcome } = press(start, 1);
    expect(outcome).toBe('repeated');
    expect(after.score).toBe(3 * POINTS_PER_STEP);
    expect(after.best).toBe(3);
  });

  it('spends a life on a mistake and starts the sequence over', () => {
    const { sequence: after, outcome } = press(pressAll(sequence([2, 0, 1], 1), [2]), 3);
    expect(outcome).toBe('slip');
    expect(after).toMatchObject({ lives: 0, slips: 1, entered: 0 });
  });

  it('ends the turn on a mistake with no lives left', () => {
    const { outcome } = press(sequence([2, 0]), 1);
    expect(outcome).toBe('out');
  });

  it('is won by repeating the longest sequence', () => {
    const steps = Array.from({ length: MAX_LENGTH }, (_, i) => i % 4);
    const start = pressAll(sequence(steps), steps.slice(0, -1));
    expect(press(start, steps[steps.length - 1]).outcome).toBe('won');
  });
});

describe('extend', () => {
  it('adds one pad and starts over', () => {
    const repeated = pressAll(sequence([1, 1]), [1, 1]);
    const longer = extend(repeated, createSeededRng(1));
    expect(longer.steps).toHaveLength(3);
    expect(longer.steps.slice(0, 2)).toEqual([1, 1]);
    expect(longer.entered).toBe(0);
  });
});

describe('stepMs', () => {
  it('speeds up as the sequence grows, but not past half speed', () => {
    expect(stepMs(START_LENGTH)).toBe(DEFAULT_STEP_MS);
    expect(stepMs(10)).toBeLessThan(DEFAULT_STEP_MS);
    expect(stepMs(1000)).toBe(DEFAULT_STEP_MS / 2);
  });
});
