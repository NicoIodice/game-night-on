import * as Tone from 'tone';
import { createBeeper } from '../../core/audio/beeper';
import { createStartTimes } from '../../core/audio/startTimes';
import type { Strength, ThemeSounds } from '../../core/audio/themeSounds';

/** Chirps for good moments: a whole little birdsong for the best ones. */
const CHIRPS: Record<Strength, string[]> = {
  0: ['E7'],
  1: ['C7', 'G7'],
  2: ['C7', 'E7', 'G7', 'C8'],
};

/** Spring sounds: a woody knock and a chirp when it goes well, a cracked egg when it doesn't, a marimba for tunes. */
export function createEasterSounds(): ThemeSounds {
  const knock = new Tone.MembraneSynth({
    volume: -10,
    pitchDecay: 0.01,
    octaves: 2,
    envelope: { attack: 0.001, decay: 0.08, sustain: 0 },
  }).toDestination();
  const chirp = new Tone.Synth({
    volume: -18,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.02 },
  }).toDestination();
  const marimba = new Tone.PolySynth(Tone.Synth, {
    volume: -10,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.3 },
  }).toDestination();
  const crackFilter = new Tone.Filter(3000, 'bandpass').toDestination();
  const crack = new Tone.NoiseSynth({
    volume: -8,
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0 },
  }).connect(crackFilter);
  const droop = new Tone.Synth({
    volume: -18,
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.1 },
  }).toDestination();
  const beeper = createBeeper();
  const times = createStartTimes();

  return {
    good(strength = 0) {
      const time = times.next();
      knock.triggerAttackRelease('G3', '16n', time);
      CHIRPS[strength].forEach((note, i) => chirp.triggerAttackRelease(note, '32n', time + 0.03 + i * 0.06));
      times.holdUntil(time + CHIRPS[strength].length * 0.06);
    },
    bad() {
      const time = times.next();
      crack.triggerAttackRelease('32n', time);
      crack.triggerAttackRelease('32n', time + 0.05);
      droop.triggerAttackRelease('E4', '8n', time);
      droop.frequency.rampTo('B3', 0.2, time + 0.02);
    },
    tap: () => knock.triggerAttackRelease('D4', '64n', times.next(), 0.5),
    note: (note, seconds = 0.35) => marimba.triggerAttackRelease(note, seconds, times.next()),
    cue: (cue) => beeper.play(cue, times.next()),
    timeUp() {
      const time = times.next();
      ['G5', 'E5', 'C5'].forEach((note, i) => marimba.triggerAttackRelease(note, '8n', time + i * 0.15));
      times.holdUntil(time + 0.3);
    },
    dispose() {
      [knock, chirp, marimba, crack, crackFilter, droop, beeper].forEach((node) => node.dispose());
    },
  };
}
