import type { BeatTrack } from '../../core/audio/BeatClock';
import { createBeeper } from '../../core/audio/beeper';
import type { Level } from './levels';
import { cueFor, stepAt } from './timeline';

/** Plays the game's beeps and ticks, scheduled on the audio clock for exact timing. */
export function createCueTrack(level: Level): BeatTrack {
  const beeper = createBeeper();
  return {
    play(time, beat) {
      const cue = cueFor(stepAt(beat, level));
      if (cue) beeper.play(cue, time);
    },
    dispose: () => beeper.dispose(),
  };
}
