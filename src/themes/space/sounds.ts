import * as Tone from 'tone';
import { createBeeper } from '../../core/audio/beeper';
import { createStartTimes } from '../../core/audio/startTimes';
import type { Strength, ThemeSounds } from '../../core/audio/themeSounds';

/** Laser zaps for good moments: a whole power-up sweep for the best ones. */
const ZAPS: Record<Strength, string[]> = {
  0: ['A6'],
  1: ['E6', 'A6'],
  2: ['A5', 'C#6', 'E6', 'A6'],
};

/** Space sounds: a laser zap when it goes well, a power-down when it doesn't, control-panel beeps for tunes. */
export function createSpaceSounds(): ThemeSounds {
  const laser = new Tone.Synth({
    volume: -16,
    oscillator: { type: 'square' },
    envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.02 },
  }).toDestination();
  const panel = new Tone.PolySynth(Tone.Synth, {
    volume: -14,
    oscillator: { type: 'square' },
    envelope: { attack: 0.002, decay: 0.2, sustain: 0.3, release: 0.15 },
  }).toDestination();
  const powerDown = new Tone.Synth({
    volume: -16,
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.01, decay: 0.45, sustain: 0, release: 0.1 },
  }).toDestination();
  const beeper = createBeeper();
  const times = createStartTimes();

  return {
    good(strength = 0) {
      const time = times.next();
      ZAPS[strength].forEach((note, i) => {
        const start = time + i * 0.06;
        laser.triggerAttackRelease(note, '32n', start);
        // Each zap drops in pitch, like a laser.
        laser.frequency.exponentialRampTo(Tone.Frequency(note).transpose(-12).toFrequency(), 0.06, start);
      });
      times.holdUntil(time + ZAPS[strength].length * 0.06);
    },
    bad() {
      const time = times.next();
      powerDown.triggerAttackRelease('A3', '8n', time);
      powerDown.frequency.exponentialRampTo('A1', 0.4, time + 0.02);
    },
    tap: () => laser.triggerAttackRelease('E7', '64n', times.next(), 0.4),
    note: (note, seconds = 0.35) => panel.triggerAttackRelease(note, seconds, times.next()),
    cue: (cue) => beeper.play(cue, times.next()),
    timeUp() {
      const time = times.next();
      ['G5', 'E5', 'C5'].forEach((note, i) => panel.triggerAttackRelease(note, '8n', time + i * 0.15));
      times.holdUntil(time + 0.3);
    },
    dispose() {
      [laser, panel, powerDown, beeper].forEach((node) => node.dispose());
    },
  };
}
