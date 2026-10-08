import * as Tone from 'tone';
import { createStartTimes } from '../../core/audio/startTimes';
import type { Strength } from '../../core/audio/themeSounds';
import { createBirthdaySounds } from '../../themes/birthday/sounds';
import type { TargetKind } from '../shooter/hunt';
import type { Sfx } from '../shooter/skin';

const STRENGTH: Record<TargetKind, Strength> = { common: 0, swift: 1, golden: 2 };

/** Balloon Pop: the party's pop and "ta-da!" for every balloon, a soft whiff of air for a miss. */
export function createSfx(): Sfx {
  const sounds = createBirthdaySounds();
  const whiffFilter = new Tone.Filter(900, 'lowpass').toDestination();
  const whiff = new Tone.NoiseSynth({
    volume: -16,
    noise: { type: 'pink' },
    envelope: { attack: 0.01, decay: 0.08, sustain: 0 },
  }).connect(whiffFilter);
  const times = createStartTimes();

  return {
    hit: (kind) => sounds.good(STRENGTH[kind]),
    miss: () => whiff.triggerAttackRelease('32n', times.next()),
    cue: sounds.cue,
    timeUp: sounds.timeUp,
    dispose() {
      [whiff, whiffFilter].forEach((node) => node.dispose());
      sounds.dispose();
    },
  };
}
