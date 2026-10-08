import * as Tone from 'tone';
import { createStartTimes } from '../../core/audio/startTimes';
import type { Strength } from '../../core/audio/themeSounds';
import { createEasterSounds } from '../../themes/easter/sounds';
import type { TargetKind } from '../shooter/hunt';
import type { Sfx } from '../shooter/skin';

const STRENGTH: Record<TargetKind, Strength> = { common: 0, swift: 1, golden: 2 };

/** Egg Catch: a knock and birdsong for every catch, a soft rustle in the grass for a miss. */
export function createSfx(): Sfx {
  const sounds = createEasterSounds();
  const rustleFilter = new Tone.Filter(1400, 'lowpass').toDestination();
  const rustle = new Tone.NoiseSynth({
    volume: -18,
    noise: { type: 'pink' },
    envelope: { attack: 0.01, decay: 0.09, sustain: 0 },
  }).connect(rustleFilter);
  const times = createStartTimes();

  return {
    hit: (kind) => sounds.good(STRENGTH[kind]),
    miss: () => rustle.triggerAttackRelease('32n', times.next()),
    cue: sounds.cue,
    timeUp: sounds.timeUp,
    dispose() {
      [rustle, rustleFilter].forEach((node) => node.dispose());
      sounds.dispose();
    },
  };
}
