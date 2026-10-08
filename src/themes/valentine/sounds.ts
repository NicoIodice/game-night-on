import * as Tone from 'tone';
import { createBeeper } from '../../core/audio/beeper';
import { createStartTimes } from '../../core/audio/startTimes';
import type { Strength, ThemeSounds } from '../../core/audio/themeSounds';

/** Harp glissandos for good moments: a whole sweep for the best ones. */
const HARPS: Record<Strength, string[]> = {
  0: ['E6'],
  1: ['C6', 'G6'],
  2: ['C6', 'E6', 'G6', 'B6', 'E7'],
};

/** Sweet sounds: a harp pluck when it goes well, a heartbroken sigh when it doesn't, a dreamy harp for tunes. */
export function createValentineSounds(): ThemeSounds {
  const reverb = new Tone.Reverb({ decay: 2, wet: 0.35 }).toDestination();
  const harp = new Tone.PluckSynth({ volume: -4, attackNoise: 0.6, dampening: 3600, resonance: 0.92 }).connect(reverb);
  const strings = new Tone.PolySynth(Tone.Synth, {
    volume: -12,
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.005, decay: 0.6, sustain: 0.1, release: 0.8 },
  }).connect(reverb);
  const sigh = new Tone.Synth({
    volume: -16,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.05, decay: 0.4, sustain: 0, release: 0.2 },
  }).toDestination();
  const beeper = createBeeper();
  const times = createStartTimes();

  return {
    good(strength = 0) {
      const time = times.next();
      HARPS[strength].forEach((note, i) => harp.triggerAttack(note, time + i * 0.05));
      times.holdUntil(time + HARPS[strength].length * 0.05);
    },
    bad() {
      const time = times.next();
      sigh.triggerAttackRelease('A4', '8n', time);
      sigh.frequency.rampTo('E4', 0.35, time + 0.05);
    },
    tap: () => harp.triggerAttack('A6', times.next()),
    note: (note, seconds = 0.35) => strings.triggerAttackRelease(note, seconds, times.next()),
    cue: (cue) => beeper.play(cue, times.next()),
    timeUp() {
      const time = times.next();
      ['G5', 'E5', 'C5'].forEach((note, i) => strings.triggerAttackRelease(note, '8n', time + i * 0.15));
      times.holdUntil(time + 0.3);
    },
    dispose() {
      [reverb, harp, strings, sigh, beeper].forEach((node) => node.dispose());
    },
  };
}
