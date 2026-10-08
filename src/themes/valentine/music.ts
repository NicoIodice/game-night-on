import * as Tone from 'tone';
import type { BeatTrack, Music } from '../../core/audio/BeatClock';

/** A slow, sweet waltz-like tune on an electric piano, one note per beat, looping every two bars. */
const MELODY = ['A4', 'C5', 'E5', 'D5', 'C5', 'B4', 'A4', 'E5'];
/** Warm chords under the tune: one per bar. */
const CHORDS = [
  ['F3', 'A3', 'C4'],
  ['E3', 'G#3', 'B3'],
];

function createTrack(): BeatTrack {
  const reverb = new Tone.Reverb({ decay: 2.5, wet: 0.35 }).toDestination();
  const keys = new Tone.FMSynth({
    volume: -14,
    harmonicity: 2,
    modulationIndex: 2,
    envelope: { attack: 0.01, decay: 0.6, sustain: 0.2, release: 0.6 },
  }).connect(reverb);
  const pad = new Tone.PolySynth(Tone.Synth, {
    volume: -24,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.3, decay: 0.5, sustain: 0.6, release: 1 },
  }).connect(reverb);

  return {
    play(time, beat) {
      keys.triggerAttackRelease(MELODY[beat % MELODY.length], '4n', time);
      if (beat % 4 === 0) pad.triggerAttackRelease(CHORDS[(beat / 4) % 2], '1n', time);
    },
    dispose() {
      [keys, pad, reverb].forEach((node) => node.dispose());
    },
  };
}

/** Sweet menu loop: a soft electric piano over warm chords. */
export const valentineMusic: Music = { bpm: 88, createTrack };
