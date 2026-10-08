import * as Tone from 'tone';
import { createBeeper, type Cue } from '../../core/audio/beeper';
import type { BatKind } from './hunt';

const SQUEAKS: Record<BatKind, string[]> = {
  bat: ['E6'],
  swift: ['G6', 'B6'],
  golden: ['C6', 'E6', 'G6', 'C7'],
};

export interface Sfx {
  hit(kind: BatKind): void;
  miss(): void;
  cue(cue: Cue): void;
  timeUp(): void;
  dispose(): void;
}

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

  // Taps can land in the same audio frame; Tone needs each start time to be later than the last.
  let last = 0;
  const now = () => (last = Math.max(Tone.now(), last + 0.01));

  return {
    hit(kind) {
      const time = now();
      thump.triggerAttackRelease('C2', '16n', time);
      SQUEAKS[kind].forEach((note, i) => squeak.triggerAttackRelease(note, '32n', time + 0.02 + i * 0.05));
      last = time + SQUEAKS[kind].length * 0.05;
    },
    miss: () => whoosh.triggerAttackRelease('32n', now()),
    cue: (cue) => beeper.play(cue, now()),
    timeUp() {
      const time = now();
      ['E5', 'C5', 'A4'].forEach((note, i) => squeak.triggerAttackRelease(note, '8n', time + i * 0.15));
      last = time + 0.3;
    },
    dispose() {
      [thump, squeak, whoosh, beeper].forEach((node) => node.dispose());
    },
  };
}
