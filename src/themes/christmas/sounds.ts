import * as Tone from 'tone';
import { createBeeper } from '../../core/audio/beeper';
import { createStartTimes } from '../../core/audio/startTimes';
import type { Strength, ThemeSounds } from '../../core/audio/themeSounds';

/** Jingles for good moments: a whole sleigh-bell run for the best ones. */
const JINGLES: Record<Strength, string[]> = {
  0: ['G6'],
  1: ['E6', 'B6'],
  2: ['C6', 'E6', 'G6', 'C7'],
};

/** Festive sounds: sleigh bells when it goes well, a soft flump in the snow when it doesn't, chimes for tunes. */
export function createChristmasSounds(): ThemeSounds {
  const reverb = new Tone.Reverb({ decay: 1.5, wet: 0.3 }).toDestination();
  const bell = new Tone.FMSynth({
    volume: -14,
    harmonicity: 3.01,
    modulationIndex: 14,
    envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.4 },
    modulationEnvelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 },
  }).connect(reverb);
  const chime = new Tone.PolySynth(Tone.FMSynth, {
    volume: -12,
    harmonicity: 2,
    modulationIndex: 4,
    envelope: { attack: 0.002, decay: 0.6, sustain: 0.1, release: 0.8 },
  }).connect(reverb);
  const flumpFilter = new Tone.Filter(500, 'lowpass').toDestination();
  const flump = new Tone.NoiseSynth({
    volume: -10,
    noise: { type: 'brown' },
    envelope: { attack: 0.005, decay: 0.12, sustain: 0 },
  }).connect(flumpFilter);
  const honk = new Tone.Synth({
    volume: -18,
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.01, decay: 0.25, sustain: 0, release: 0.1 },
  }).toDestination();
  const beeper = createBeeper();
  const times = createStartTimes();

  return {
    good(strength = 0) {
      const time = times.next();
      JINGLES[strength].forEach((note, i) => bell.triggerAttackRelease(note, '16n', time + i * 0.06));
      times.holdUntil(time + JINGLES[strength].length * 0.06);
    },
    bad() {
      const time = times.next();
      flump.triggerAttackRelease('16n', time);
      honk.triggerAttackRelease('D4', '8n', time);
      honk.triggerAttackRelease('A3', '8n', time + 0.12);
      times.holdUntil(time + 0.12);
    },
    tap: () => bell.triggerAttackRelease('C7', '64n', times.next(), 0.4),
    note: (note, seconds = 0.35) => chime.triggerAttackRelease(note, seconds, times.next()),
    cue: (cue) => beeper.play(cue, times.next()),
    timeUp() {
      const time = times.next();
      ['G5', 'E5', 'C5'].forEach((note, i) => bell.triggerAttackRelease(note, '8n', time + i * 0.15));
      times.holdUntil(time + 0.3);
    },
    dispose() {
      [reverb, bell, chime, flump, flumpFilter, honk, beeper].forEach((node) => node.dispose());
    },
  };
}
