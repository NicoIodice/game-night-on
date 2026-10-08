import * as Tone from 'tone';
import { createBeeper } from '../../core/audio/beeper';
import type { TargetKind } from '../shooter/hunt';
import { createStartTimes, type Sfx } from '../shooter/skin';

/** Jingle bells for each kind hit: a rescued present gets a whole sleigh-bell run. */
const JINGLES: Record<TargetKind, string[]> = {
  common: ['G6'],
  swift: ['E6', 'B6'],
  golden: ['C6', 'E6', 'G6', 'C7'],
};

/** Snowball Showdown: a snowy splat and a jingle for every hit, a soft flump in the snow for a miss. */
export function createSfx(): Sfx {
  const splatFilter = new Tone.Filter(2400, 'lowpass').toDestination();
  const splat = new Tone.NoiseSynth({
    volume: -8,
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.12, sustain: 0 },
  }).connect(splatFilter);
  const reverb = new Tone.Reverb({ decay: 1.5, wet: 0.3 }).toDestination();
  const bell = new Tone.FMSynth({
    volume: -14,
    harmonicity: 3.01,
    modulationIndex: 14,
    envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.4 },
    modulationEnvelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 },
  }).connect(reverb);
  const flumpFilter = new Tone.Filter(500, 'lowpass').toDestination();
  const flump = new Tone.NoiseSynth({
    volume: -12,
    noise: { type: 'brown' },
    envelope: { attack: 0.005, decay: 0.1, sustain: 0 },
  }).connect(flumpFilter);
  const beeper = createBeeper();
  const times = createStartTimes();

  return {
    hit(kind) {
      const time = times.next();
      splat.triggerAttackRelease('16n', time);
      JINGLES[kind].forEach((note, i) => bell.triggerAttackRelease(note, '16n', time + 0.03 + i * 0.06));
      times.holdUntil(time + JINGLES[kind].length * 0.06);
    },
    miss: () => flump.triggerAttackRelease('32n', times.next()),
    cue: (cue) => beeper.play(cue, times.next()),
    timeUp() {
      const time = times.next();
      ['G5', 'E5', 'C5'].forEach((note, i) => bell.triggerAttackRelease(note, '8n', time + i * 0.15));
      times.holdUntil(time + 0.3);
    },
    dispose() {
      [splat, splatFilter, bell, reverb, flump, flumpFilter, beeper].forEach((node) => node.dispose());
    },
  };
}
