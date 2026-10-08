import * as Tone from 'tone';
import { createBeeper } from '../../core/audio/beeper';
import { createStartTimes } from '../../core/audio/startTimes';
import type { Strength, ThemeSounds } from '../../core/audio/themeSounds';

/** Squeaks for good moments, higher and longer the better it was. */
const SQUEAKS: Record<Strength, string[]> = {
  0: ['E6'],
  1: ['G6', 'B6'],
  2: ['C6', 'E6', 'G6', 'C7'],
};

/** Spooky sounds: a thump and a squeak when it goes well, a whoosh when it doesn't, an eerie organ for tunes. */
export function createHalloweenSounds(): ThemeSounds {
  const thump = new Tone.MembraneSynth({
    volume: -6,
    pitchDecay: 0.02,
    octaves: 4,
    envelope: { attack: 0.001, decay: 0.15, sustain: 0 },
  }).toDestination();
  const squeak = new Tone.Synth({
    volume: -16,
    oscillator: { type: 'square' },
    envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.02 },
  }).toDestination();
  const whoosh = new Tone.NoiseSynth({
    volume: -22,
    noise: { type: 'pink' },
    envelope: { attack: 0.001, decay: 0.07, sustain: 0 },
  }).toDestination();
  const groan = new Tone.Synth({
    volume: -14,
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.1 },
  }).toDestination();
  const organReverb = new Tone.Reverb({ decay: 2.5, wet: 0.4 }).toDestination();
  const organ = new Tone.PolySynth(Tone.Synth, {
    volume: -14,
    oscillator: { type: 'fatsawtooth', count: 3, spread: 20 },
    envelope: { attack: 0.02, decay: 0.2, sustain: 0.5, release: 0.4 },
  }).connect(organReverb);
  const beeper = createBeeper();
  const times = createStartTimes();

  return {
    good(strength = 0) {
      const time = times.next();
      thump.triggerAttackRelease('C2', '16n', time);
      SQUEAKS[strength].forEach((note, i) => squeak.triggerAttackRelease(note, '32n', time + 0.02 + i * 0.05));
      times.holdUntil(time + SQUEAKS[strength].length * 0.05);
    },
    bad() {
      const time = times.next();
      whoosh.triggerAttackRelease('32n', time);
      groan.triggerAttackRelease('A2', '8n', time);
      groan.frequency.rampTo('E2', 0.25, time + 0.02);
    },
    tap: () => squeak.triggerAttackRelease('A5', '64n', times.next()),
    note: (note, seconds = 0.35) => organ.triggerAttackRelease(note, seconds, times.next()),
    cue: (cue) => beeper.play(cue, times.next()),
    timeUp() {
      const time = times.next();
      ['E5', 'C5', 'A4'].forEach((note, i) => squeak.triggerAttackRelease(note, '8n', time + i * 0.15));
      times.holdUntil(time + 0.3);
    },
    dispose() {
      [thump, squeak, whoosh, groan, organ, organReverb, beeper].forEach((node) => node.dispose());
    },
  };
}
