import * as Tone from 'tone';
import { createBeeper } from '../../core/audio/beeper';
import type { TargetKind } from '../shooter/hunt';
import { createStartTimes, type Sfx } from '../shooter/skin';

const SQUEAKS: Record<TargetKind, string[]> = {
  common: ['E6'],
  swift: ['G6', 'B6'],
  golden: ['C6', 'E6', 'G6', 'C7'],
};

/** Bat Blitz: a thump and a squeak for every bat zapped. */
export function createSfx(): Sfx {
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
  const beeper = createBeeper();
  const times = createStartTimes();

  return {
    hit(kind) {
      const time = times.next();
      thump.triggerAttackRelease('C2', '16n', time);
      SQUEAKS[kind].forEach((note, i) => squeak.triggerAttackRelease(note, '32n', time + 0.02 + i * 0.05));
      times.holdUntil(time + SQUEAKS[kind].length * 0.05);
    },
    miss: () => whoosh.triggerAttackRelease('32n', times.next()),
    cue: (cue) => beeper.play(cue, times.next()),
    timeUp() {
      const time = times.next();
      ['E5', 'C5', 'A4'].forEach((note, i) => squeak.triggerAttackRelease(note, '8n', time + i * 0.15));
      times.holdUntil(time + 0.3);
    },
    dispose() {
      [thump, squeak, whoosh, beeper].forEach((node) => node.dispose());
    },
  };
}
