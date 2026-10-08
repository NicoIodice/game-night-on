import * as Tone from 'tone';
import { createStartTimes } from '../../core/audio/startTimes';
import type { Strength } from '../../core/audio/themeSounds';
import { createNewYearSounds } from '../../themes/newyear/sounds';
import type { TargetKind } from '../shooter/hunt';
import type { Sfx } from '../shooter/skin';

const STRENGTH: Record<TargetKind, Strength> = { common: 0, swift: 1, golden: 2 };

/** Firework Frenzy: a bang and a sparkle cascade for every firework, a little puff of smoke for a miss. */
export function createSfx(): Sfx {
  const sounds = createNewYearSounds();
  const puffFilter = new Tone.Filter(700, 'lowpass').toDestination();
  const puff = new Tone.NoiseSynth({
    volume: -14,
    noise: { type: 'brown' },
    envelope: { attack: 0.005, decay: 0.08, sustain: 0 },
  }).connect(puffFilter);
  const times = createStartTimes();

  return {
    hit: (kind) => sounds.good(STRENGTH[kind]),
    miss: () => puff.triggerAttackRelease('32n', times.next()),
    cue: sounds.cue,
    timeUp: sounds.timeUp,
    dispose() {
      [puff, puffFilter].forEach((node) => node.dispose());
      sounds.dispose();
    },
  };
}
