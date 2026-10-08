import * as Tone from 'tone';
import type { BeatTrack, Music } from '../../core/audio/BeatClock';

/** A cheerful major melody on a toy piano, one note per beat, looping every two bars. */
const MELODY = ['C5', 'E5', 'G5', 'E5', 'F5', 'A5', 'G5', null];
const BASS = ['C3', 'C3', 'F2', 'G2', 'A2', 'F2', 'G2', 'G2'];

function createTrack(): BeatTrack {
  const piano = new Tone.Synth({
    volume: -14,
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.002, decay: 0.25, sustain: 0.1, release: 0.3 },
  }).toDestination();
  const bass = new Tone.Synth({ volume: -18, oscillator: { type: 'square' } }).toDestination();
  const clap = new Tone.NoiseSynth({
    volume: -26,
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.08, sustain: 0 },
  }).toDestination();

  return {
    play(time, beat) {
      const note = MELODY[beat % MELODY.length];
      if (note) piano.triggerAttackRelease(note, '8n', time);
      bass.triggerAttackRelease(BASS[beat % BASS.length], '16n', time);
      if (beat % 2 === 1) clap.triggerAttackRelease('16n', time);
    },
    dispose() {
      [piano, bass, clap].forEach((node) => node.dispose());
    },
  };
}

/** Bouncy menu loop: toy piano, a bass that hops and party claps on the off-beats. */
export const birthdayMusic: Music = { bpm: 116, createTrack };
