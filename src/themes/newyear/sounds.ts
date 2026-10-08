import * as Tone from 'tone';
import { createBeeper } from '../../core/audio/beeper';
import { createStartTimes } from '../../core/audio/startTimes';
import type { Strength, ThemeSounds } from '../../core/audio/themeSounds';

/** Sparkles for good moments: a whole cascade for the best ones. */
const SPARKLES: Record<Strength, string[]> = {
  0: ['A6'],
  1: ['E6', 'A6'],
  2: ['A5', 'C#6', 'E6', 'A6', 'E7'],
};

/** Fireworks: a bang and a sparkle when it goes well, a fizzling dud when it doesn't, a glassy synth for tunes. */
export function createNewYearSounds(): ThemeSounds {
  const bang = new Tone.MembraneSynth({
    volume: -10,
    pitchDecay: 0.05,
    octaves: 6,
    envelope: { attack: 0.001, decay: 0.25, sustain: 0 },
  }).toDestination();
  const crackleFilter = new Tone.Filter(5000, 'highpass').toDestination();
  const crackle = new Tone.NoiseSynth({
    volume: -18,
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.2, sustain: 0 },
  }).connect(crackleFilter);
  const sparkle = new Tone.Synth({
    volume: -18,
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.05 },
  }).toDestination();
  const glass = new Tone.PolySynth(Tone.FMSynth, {
    volume: -14,
    harmonicity: 3,
    modulationIndex: 6,
    envelope: { attack: 0.002, decay: 0.5, sustain: 0.05, release: 0.6 },
  }).toDestination();
  const fizzFilter = new Tone.Filter(1200, 'lowpass').toDestination();
  const fizz = new Tone.NoiseSynth({
    volume: -14,
    noise: { type: 'pink' },
    envelope: { attack: 0.02, decay: 0.35, sustain: 0 },
  }).connect(fizzFilter);
  const beeper = createBeeper();
  const times = createStartTimes();

  return {
    good(strength = 0) {
      const time = times.next();
      bang.triggerAttackRelease('G2', '16n', time);
      crackle.triggerAttackRelease('8n', time + 0.03);
      SPARKLES[strength].forEach((note, i) => sparkle.triggerAttackRelease(note, '32n', time + 0.05 + i * 0.05));
      times.holdUntil(time + SPARKLES[strength].length * 0.05);
    },
    bad() {
      const time = times.next();
      fizz.triggerAttackRelease('8n', time);
      fizzFilter.frequency.rampTo(300, 0.3, time);
      fizzFilter.frequency.setValueAtTime(1200, time + 0.4);
    },
    tap: () => sparkle.triggerAttackRelease('E7', '64n', times.next(), 0.5),
    note: (note, seconds = 0.35) => glass.triggerAttackRelease(note, seconds, times.next()),
    cue: (cue) => beeper.play(cue, times.next()),
    timeUp() {
      const time = times.next();
      ['G5', 'E5', 'C5'].forEach((note, i) => glass.triggerAttackRelease(note, '8n', time + i * 0.15));
      times.holdUntil(time + 0.3);
    },
    dispose() {
      [bang, crackle, crackleFilter, sparkle, glass, fizz, fizzFilter, beeper].forEach((node) => node.dispose());
    },
  };
}
