import * as Tone from 'tone';
import { createBeeper } from '../../core/audio/beeper';
import { createStartTimes } from '../../core/audio/startTimes';
import type { Strength, ThemeSounds } from '../../core/audio/themeSounds';

/** Samba whistle blasts for good moments: the full "apito" call for the best ones. */
const WHISTLES: Record<Strength, number> = { 0: 1, 1: 2, 2: 4 };

/** Carnival sounds: a drum hit and a samba whistle when it goes well, a sad trombone when it doesn't, brass for tunes. */
export function createCarnivalSounds(): ThemeSounds {
  const drum = new Tone.MembraneSynth({ volume: -8, octaves: 3, pitchDecay: 0.03 }).toDestination();
  const whistleTrill = new Tone.Vibrato({ frequency: 30, depth: 0.4 }).toDestination();
  const whistle = new Tone.Synth({
    volume: -20,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.005, decay: 0.05, sustain: 0.6, release: 0.02 },
  }).connect(whistleTrill);
  const brass = new Tone.PolySynth(Tone.Synth, {
    volume: -14,
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.03, decay: 0.2, sustain: 0.4, release: 0.2 },
  }).toDestination();
  const trombone = new Tone.Synth({
    volume: -16,
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.05, decay: 0.3, sustain: 0.3, release: 0.1 },
  }).toDestination();
  const beeper = createBeeper();
  const times = createStartTimes();

  return {
    good(strength = 0) {
      const time = times.next();
      drum.triggerAttackRelease('C2', '16n', time);
      for (let i = 0; i < WHISTLES[strength]; i++) whistle.triggerAttackRelease('B6', 0.05, time + 0.02 + i * 0.08);
      times.holdUntil(time + WHISTLES[strength] * 0.08);
    },
    bad() {
      const time = times.next();
      trombone.triggerAttackRelease('D3', '8n', time);
      trombone.frequency.rampTo('A2', 0.3, time + 0.05);
    },
    tap: () => drum.triggerAttackRelease('A3', '64n', times.next(), 0.5),
    note: (note, seconds = 0.35) => brass.triggerAttackRelease(note, seconds, times.next()),
    cue: (cue) => beeper.play(cue, times.next()),
    timeUp() {
      const time = times.next();
      ['G5', 'E5', 'C5'].forEach((note, i) => brass.triggerAttackRelease(note, '8n', time + i * 0.15));
      times.holdUntil(time + 0.3);
    },
    dispose() {
      [drum, whistle, whistleTrill, brass, trombone, beeper].forEach((node) => node.dispose());
    },
  };
}
