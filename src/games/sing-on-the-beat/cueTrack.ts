import type { BeatTrack } from '../../core/audio/BeatClock';
import { createBeeper } from '../../core/audio/beeper';
import { cueFor, stepAt, type Plan } from './timeline';

/** Plays the game's beeps and ticks, scheduled on the audio clock for exact timing. */
export function createCueTrack(plan: Plan): BeatTrack {
  const beeper = createBeeper();
  return {
    play(time, beat) {
      const cue = cueFor(stepAt(beat, plan));
      if (cue) beeper.play(cue, time);
    },
    dispose: () => beeper.dispose(),
  };
}
