/**
 * Scoring for a shouting game (Scream Meter, Ho Ho Holler), kept pure so it can be tested.
 * The microphone level is read every frame as a number from 0 (silence) to 1 (as loud as it gets).
 * The room's background noise is measured first, so only the shout itself counts.
 */

export const DEFAULT_SECONDS = 4;
/** Below this many decibels counts as silence; 0 dB is as loud as the microphone goes. */
const QUIETEST_DB = -60;
/** How far above the room's noise the voice has to be before it counts. */
const NOISE_MARGIN = 0.05;
/** A shout this loud (above the room's noise) for the whole time scores full marks. */
const FULL_MARKS_LEVEL = 0.6;
export const MAX_POINTS = 1000;
/** Level above the room's noise that counts as "loud" for the summary. */
const LOUD_LEVEL = 0.25;

/** Turns a microphone reading in decibels into a level from 0 to 1. */
export function toLevel(db: number): number {
  if (!Number.isFinite(db)) return 0;
  return Math.min(1, Math.max(0, (db - QUIETEST_DB) / -QUIETEST_DB));
}

/** Readings taken while measuring something: level and how long it lasted. */
export interface Reading {
  level: number;
  dt: number;
}

/** The room's background noise: the average level heard while nobody shouts. */
export function noiseFloor(readings: readonly Reading[]): number {
  const time = readings.reduce((sum, r) => sum + r.dt, 0);
  if (time === 0) return 0;
  return readings.reduce((sum, r) => sum + r.level * r.dt, 0) / time;
}

/** How loud a reading is above the room's noise, from 0 to 1. */
export function aboveFloor(level: number, floor: number): number {
  return Math.max(0, level - floor - NOISE_MARGIN);
}

export interface ShoutResult {
  score: number;
  /** Loudest moment, from 0 to 1, above the room's noise. */
  peak: number;
  /** Seconds spent shouting loudly. */
  loudSeconds: number;
}

/**
 * Scores a shout: louder and longer is better. Holding a loud shout for the whole time
 * scores `MAX_POINTS`; a short yelp scores a bit; silence scores nothing.
 */
export function scoreShout(readings: readonly Reading[], floor: number, seconds: number): ShoutResult {
  let area = 0;
  let peak = 0;
  let loudSeconds = 0;
  for (const { level, dt } of readings) {
    const loudness = aboveFloor(level, floor);
    area += Math.min(loudness, FULL_MARKS_LEVEL) * dt;
    peak = Math.max(peak, loudness);
    if (loudness >= LOUD_LEVEL) loudSeconds += dt;
  }
  const score = Math.round(Math.min(1, area / (FULL_MARKS_LEVEL * seconds)) * MAX_POINTS);
  return { score, peak, loudSeconds };
}

/** How full the meter looks for a reading, from 0 to 1. */
export function meterFill(level: number, floor: number): number {
  return Math.min(1, aboveFloor(level, floor) / FULL_MARKS_LEVEL);
}
