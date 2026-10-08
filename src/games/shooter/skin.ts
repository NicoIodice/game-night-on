import * as Tone from 'tone';
import type { Cue } from '../../core/audio/beeper';
import type { TargetKind } from './hunt';

/** The sounds of a shooting game. Each skin makes its own. */
export interface Sfx {
  hit(kind: TargetKind): void;
  miss(): void;
  cue(cue: Cue): void;
  timeUp(): void;
  dispose(): void;
}

/**
 * Everything that makes a shooting game look and sound like its festivity; the mechanics
 * live in hunt.ts and are the same for every skin. The arena's background and the targets'
 * colours come from CSS under `.shooter--<id>`.
 */
export interface ShooterSkin {
  id: string;
  title: string;
  /** How the turn is explained on the intro screen. */
  intro: string;
  kinds: Record<TargetKind, { name: string; image: string }>;
  /** What a hit is counted as in the turn summary, one and many: ['bat', 'bats']. */
  hitNoun: [string, string];
  createSfx: () => Sfx;
}

/**
 * Start times for sounds triggered by taps. Taps can land in the same audio frame, and
 * Tone needs each start time to be later than the last.
 */
export function createStartTimes() {
  let last = 0;
  return {
    next: () => (last = Math.max(Tone.now(), last + 0.01)),
    /** Keeps the next sound from starting before `time`, e.g. while a jingle plays out. */
    holdUntil(time: number) {
      last = Math.max(last, time);
    },
  };
}
