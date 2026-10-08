import { describe, expect, it } from 'vitest';
import { aboveFloor, MAX_POINTS, meterFill, noiseFloor, scoreShout, toLevel, type Reading } from './loudness';

/** `seconds` of readings at a steady `level`, 60 per second. */
const steady = (level: number, seconds: number): Reading[] =>
  Array.from({ length: Math.round(seconds * 60) }, () => ({ level, dt: 1 / 60 }));

describe('toLevel', () => {
  it('maps decibels to 0..1', () => {
    expect(toLevel(-Infinity)).toBe(0);
    expect(toLevel(-80)).toBe(0);
    expect(toLevel(-30)).toBeCloseTo(0.5);
    expect(toLevel(0)).toBe(1);
    expect(toLevel(6)).toBe(1);
  });
});

describe('noiseFloor', () => {
  it('averages the level over time', () => {
    expect(noiseFloor([...steady(0.1, 1), ...steady(0.3, 1)])).toBeCloseTo(0.2);
    expect(noiseFloor([])).toBe(0);
  });
});

describe('scoreShout', () => {
  it('scores nothing for silence or plain room noise', () => {
    expect(scoreShout(steady(0.12, 4), 0.12, 4).score).toBe(0);
  });

  it('gives full marks for a loud shout the whole time', () => {
    expect(scoreShout(steady(0.9, 4), 0.1, 4).score).toBe(MAX_POINTS);
  });

  it('scores a longer shout higher than a short one', () => {
    const short = scoreShout([...steady(0.7, 1), ...steady(0.1, 3)], 0.1, 4);
    const long = scoreShout([...steady(0.7, 3), ...steady(0.1, 1)], 0.1, 4);
    expect(long.score).toBeGreaterThan(short.score);
    expect(short.score).toBeGreaterThan(0);
    expect(long.loudSeconds).toBeCloseTo(3);
  });

  it('scores a louder shout higher, measured above the room noise', () => {
    const quiet = scoreShout(steady(0.35, 4), 0.1, 4);
    const loud = scoreShout(steady(0.55, 4), 0.1, 4);
    expect(loud.score).toBeGreaterThan(quiet.score);
    // The same shout in a noisy room counts for less.
    expect(scoreShout(steady(0.55, 4), 0.3, 4).score).toBeLessThan(loud.score);
    expect(loud.peak).toBeCloseTo(aboveFloor(0.55, 0.1));
  });
});

describe('meterFill', () => {
  it('stays between empty and full', () => {
    expect(meterFill(0, 0.2)).toBe(0);
    expect(meterFill(1, 0)).toBe(1);
  });
});
