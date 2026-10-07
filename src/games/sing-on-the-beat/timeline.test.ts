import { describe, expect, it } from 'vitest';
import type { Level } from './levels';
import { stepAt } from './timeline';

const LEVEL: Level = { number: 1, bpm: 100, rounds: 2, cardCount: 3, cardTypes: 4, maxRepeats: 2 };

describe('stepAt', () => {
  it('counts down during the first bar', () => {
    expect([0, 1, 2, 3].map((beat) => stepAt(beat, LEVEL))).toEqual([4, 3, 2, 1].map((countdown) => ({ phase: 'intro', countdown })));
  });

  it('reveals one card per beat, then rests until the bar ends', () => {
    expect(stepAt(4, LEVEL)).toEqual({ phase: 'reveal', round: 0, revealed: 1 });
    expect(stepAt(6, LEVEL)).toEqual({ phase: 'reveal', round: 0, revealed: 3 });
    expect(stepAt(7, LEVEL)).toEqual({ phase: 'reveal', round: 0, revealed: 3 });
  });

  it('highlights one card per beat while singing', () => {
    expect(stepAt(8, LEVEL)).toEqual({ phase: 'sing', round: 0, active: 0 });
    expect(stepAt(10, LEVEL)).toEqual({ phase: 'sing', round: 0, active: 2 });
    expect(stepAt(11, LEVEL)).toEqual({ phase: 'sing', round: 0, active: null });
  });

  it('moves to the next round and finishes after the last one', () => {
    expect(stepAt(12, LEVEL)).toEqual({ phase: 'reveal', round: 1, revealed: 1 });
    expect(stepAt(20, LEVEL)).toEqual({ phase: 'done' });
  });
});
