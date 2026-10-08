import * as Tone from 'tone';
import { createStartTimes } from '../../core/audio/startTimes';
import type { Strength } from '../../core/audio/themeSounds';
import { createSpaceSounds } from '../../themes/space/sounds';
import type { TargetKind } from '../shooter/hunt';
import type { Sfx } from '../shooter/skin';

const STRENGTH: Record<TargetKind, Strength> = { common: 0, swift: 1, golden: 2 };

/** Alien Zapper: a laser zap for every hit, a fizzle of static into empty space for a miss. */
export function createSfx(): Sfx {
  const sounds = createSpaceSounds();
  const staticFilter = new Tone.Filter(3000, 'bandpass').toDestination();
  const fizzle = new Tone.NoiseSynth({
    volume: -20,
    noise: { type: 'white' },
    envelope: { attack: 0.002, decay: 0.07, sustain: 0 },
  }).connect(staticFilter);
  const times = createStartTimes();

  return {
    hit: (kind) => sounds.good(STRENGTH[kind]),
    miss: () => fizzle.triggerAttackRelease('32n', times.next()),
    cue: sounds.cue,
    timeUp: sounds.timeUp,
    dispose() {
      [fizzle, staticFilter].forEach((node) => node.dispose());
      sounds.dispose();
    },
  };
}
