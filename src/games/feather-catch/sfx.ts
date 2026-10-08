import * as Tone from 'tone';
import { createStartTimes } from '../../core/audio/startTimes';
import type { Strength } from '../../core/audio/themeSounds';
import { createCarnivalSounds } from '../../themes/carnival/sounds';
import type { TargetKind } from '../shooter/hunt';
import type { Sfx } from '../shooter/skin';

const STRENGTH: Record<TargetKind, Strength> = { common: 0, swift: 1, golden: 2 };

/** Feather Catch: a drum and a samba whistle for every catch, a rattle of the shaker for a miss. */
export function createSfx(): Sfx {
  const sounds = createCarnivalSounds();
  const rattle = new Tone.NoiseSynth({
    volume: -22,
    noise: { type: 'white' },
    envelope: { attack: 0.002, decay: 0.06, sustain: 0 },
  }).toDestination();
  const times = createStartTimes();

  return {
    hit: (kind) => sounds.good(STRENGTH[kind]),
    miss: () => rattle.triggerAttackRelease('32n', times.next()),
    cue: sounds.cue,
    timeUp: sounds.timeUp,
    dispose() {
      rattle.dispose();
      sounds.dispose();
    },
  };
}
