import { describe, expect, it } from 'vitest';
import { cueFor, roundBeats, stepAt, type Plan } from './timeline';

const LEVEL: Plan = { rounds: 2, cardCount: 3 };
const steps = (from: number, to: number) => Array.from({ length: to - from }, (_, i) => stepAt(from + i, LEVEL));

describe('stepAt', () => {
  it('starts every round with "get ready" then 3, 2, 1', () => {
    expect(steps(0, 4).map((s) => s.phase === 'countdown' && s.count)).toEqual([null, 3, 2, 1]);
  });

  it('goes straight from the countdown to one beat per card to sing', () => {
    expect(steps(4, 7)).toEqual([0, 1, 2].map((active) => ({ phase: 'sing', round: 0, active })));
  });

  it('pauses on the result, still listening first, before the next round', () => {
    expect(steps(7, 13).map((s) => s.phase === 'result' && s.final)).toEqual([false, false, false, true, true, true]);
    expect(roundBeats(LEVEL)).toBe(13);
    expect(stepAt(13, LEVEL)).toEqual({ phase: 'countdown', round: 1, count: null });
  });

  it('finishes after the last round', () => {
    expect(stepAt(26, LEVEL)).toEqual({ phase: 'done' });
  });
});

describe('cueFor', () => {
  it('beeps on the counters, "go" on the first card, and stays quiet on "get ready" and results', () => {
    expect(steps(0, 13).map(cueFor)).toEqual([
      null, 'count', 'count', 'count',
      'go', 'tick', 'tick',
      null, null, null, null, null, null,
    ]);
  });
});
