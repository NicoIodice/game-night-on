import * as Tone from 'tone';

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
