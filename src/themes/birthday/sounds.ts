import * as Tone from 'tone';
import { createBeeper } from '../../core/audio/beeper';
import { createStartTimes } from '../../core/audio/startTimes';
import type { Strength, ThemeSounds } from '../../core/audio/themeSounds';

/** Toy-piano arpeggios for good moments: a whole "ta-da!" for the best ones. */
const TADAS: Record<Strength, string[]> = {
  0: ['G5'],
  1: ['E5', 'C6'],
  2: ['C5', 'E5', 'G5', 'C6'],
};

/** Party sounds: a pop and a toy piano when it goes well, a deflating party blower when it doesn't. */
export function createBirthdaySounds(): ThemeSounds {
  const popFilter = new Tone.Filter(1800, 'highpass').toDestination();
  const pop = new Tone.NoiseSynth({
    volume: -10,
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.04, sustain: 0 },
  }).connect(popFilter);
  const piano = new Tone.Synth({
    volume: -12,
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.002, decay: 0.3, sustain: 0, release: 0.2 },
  }).toDestination();
  const keys = new Tone.PolySynth(Tone.Synth, {
    volume: -12,
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.005, decay: 0.4, sustain: 0.2, release: 0.5 },
  }).toDestination();
  const blower = new Tone.Synth({
    volume: -16,
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.01, decay: 0.35, sustain: 0, release: 0.1 },
  }).toDestination();
  const beeper = createBeeper();
  const times = createStartTimes();

  return {
    good(strength = 0) {
      const time = times.next();
      pop.triggerAttackRelease('32n', time);
      TADAS[strength].forEach((note, i) => piano.triggerAttackRelease(note, '16n', time + 0.02 + i * 0.07));
      times.holdUntil(time + TADAS[strength].length * 0.07);
    },
    bad() {
      const time = times.next();
      blower.triggerAttackRelease('A3', '8n', time);
      blower.frequency.rampTo('D3', 0.3, time + 0.02);
    },
    tap: () => pop.triggerAttackRelease('64n', times.next()),
    note: (note, seconds = 0.35) => keys.triggerAttackRelease(note, seconds, times.next()),
    cue: (cue) => beeper.play(cue, times.next()),
    timeUp() {
      const time = times.next();
      ['G5', 'E5', 'C5'].forEach((note, i) => piano.triggerAttackRelease(note, '8n', time + i * 0.15));
      times.holdUntil(time + 0.3);
    },
    dispose() {
      [pop, popFilter, piano, keys, blower, beeper].forEach((node) => node.dispose());
    },
  };
}
