import * as Tone from 'tone';
import { createStartTimes } from '../../core/audio/startTimes';
import type { Strength } from '../../core/audio/themeSounds';
import { createSummerSounds } from '../../themes/summer/sounds';
import type { TargetKind } from '../shooter/hunt';
import type { Sfx } from '../shooter/skin';

const STRENGTH: Record<TargetKind, Strength> = { common: 0, swift: 1, golden: 2 };

/** Splash Attack: a splash and a steel drum for every hit, a water squirt into the sand for a miss. */
export function createSfx(): Sfx {
  const sounds = createSummerSounds();
  const squirtFilter = new Tone.Filter(4000, 'highpass').toDestination();
  const squirt = new Tone.NoiseSynth({
    volume: -20,
    noise: { type: 'white' },
    envelope: { attack: 0.005, decay: 0.07, sustain: 0 },
  }).connect(squirtFilter);
  const times = createStartTimes();

  return {
    hit: (kind) => sounds.good(STRENGTH[kind]),
    miss: () => squirt.triggerAttackRelease('32n', times.next()),
    cue: sounds.cue,
    timeUp: sounds.timeUp,
    dispose() {
      [squirt, squirtFilter].forEach((node) => node.dispose());
      sounds.dispose();
    },
  };
}
