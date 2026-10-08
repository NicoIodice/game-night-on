import * as Tone from 'tone';
import { createStartTimes } from '../../core/audio/startTimes';
import type { Strength } from '../../core/audio/themeSounds';
import { createValentineSounds } from '../../themes/valentine/sounds';
import type { TargetKind } from '../shooter/hunt';
import type { Sfx } from '../shooter/skin';

const STRENGTH: Record<TargetKind, Strength> = { common: 0, swift: 1, golden: 2 };

/** Cupid's Arrows: a harp for every heart hit, an arrow whooshing past for a miss. */
export function createSfx(): Sfx {
  const sounds = createValentineSounds();
  const whooshFilter = new Tone.Filter(2200, 'bandpass').toDestination();
  const whoosh = new Tone.NoiseSynth({
    volume: -16,
    noise: { type: 'pink' },
    envelope: { attack: 0.02, decay: 0.12, sustain: 0 },
  }).connect(whooshFilter);
  const times = createStartTimes();

  return {
    hit: (kind) => sounds.good(STRENGTH[kind]),
    miss: () => whoosh.triggerAttackRelease('16n', times.next()),
    cue: sounds.cue,
    timeUp: sounds.timeUp,
    dispose() {
      [whoosh, whooshFilter].forEach((node) => node.dispose());
      sounds.dispose();
    },
  };
}
