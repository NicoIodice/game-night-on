import * as Tone from 'tone';
import { createBeeper } from '../../core/audio/beeper';
import { createStartTimes } from '../../core/audio/startTimes';
import type { Strength, ThemeSounds } from '../../core/audio/themeSounds';

/** Steel-drum runs for good moments: a whole calypso lick for the best ones. */
const LICKS: Record<Strength, string[]> = {
  0: ['G5'],
  1: ['E5', 'C6'],
  2: ['C5', 'E5', 'G5', 'C6'],
};

/** Beach sounds: a splash and a steel drum when it goes well, a sad slide whistle when it doesn't. */
export function createSummerSounds(): ThemeSounds {
  const splashFilter = new Tone.Filter(2600, 'bandpass').toDestination();
  const splash = new Tone.NoiseSynth({
    volume: -12,
    noise: { type: 'white' },
    envelope: { attack: 0.005, decay: 0.15, sustain: 0 },
  }).connect(splashFilter);
  const steel = new Tone.PolySynth(Tone.FMSynth, {
    volume: -12,
    harmonicity: 1.5,
    modulationIndex: 3,
    envelope: { attack: 0.002, decay: 0.4, sustain: 0.05, release: 0.4 },
  }).toDestination();
  const slide = new Tone.Synth({
    volume: -16,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.01, decay: 0.35, sustain: 0, release: 0.1 },
  }).toDestination();
  const beeper = createBeeper();
  const times = createStartTimes();

  return {
    good(strength = 0) {
      const time = times.next();
      splash.triggerAttackRelease('16n', time);
      LICKS[strength].forEach((note, i) => steel.triggerAttackRelease(note, '16n', time + 0.02 + i * 0.07));
      times.holdUntil(time + LICKS[strength].length * 0.07);
    },
    bad() {
      const time = times.next();
      slide.triggerAttackRelease('C5', '8n', time);
      slide.frequency.rampTo('F4', 0.3, time + 0.02);
    },
    tap: () => steel.triggerAttackRelease('C6', '64n', times.next(), 0.4),
    note: (note, seconds = 0.35) => steel.triggerAttackRelease(note, seconds, times.next()),
    cue: (cue) => beeper.play(cue, times.next()),
    timeUp() {
      const time = times.next();
      ['G5', 'E5', 'C5'].forEach((note, i) => steel.triggerAttackRelease(note, '8n', time + i * 0.15));
      times.holdUntil(time + 0.3);
    },
    dispose() {
      [splash, splashFilter, steel, slide, beeper].forEach((node) => node.dispose());
    },
  };
}
