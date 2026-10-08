import * as Tone from 'tone';
import type { BeatTrack, Music } from '../../core/audio/BeatClock';

/** A light pentatonic tune on a woody marimba, one note per beat, looping every two bars. */
const MELODY = ['G5', 'E5', 'D5', 'E5', 'G5', 'A5', 'G5', null];
const BASS = ['C3', 'G3', 'C3', 'G3', 'A2', 'E3', 'G2', 'D3'];
/** Birdsong on some beats: a quick high chirp. */
const CHIRPS = [false, false, true, false, false, false, true, true];

function createTrack(): BeatTrack {
  const marimba = new Tone.Synth({
    volume: -12,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 0.35, sustain: 0, release: 0.2 },
  }).toDestination();
  const bass = new Tone.Synth({
    volume: -20,
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.2 },
  }).toDestination();
  const chirp = new Tone.Synth({
    volume: -26,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 },
  }).toDestination();

  return {
    play(time, beat) {
      const note = MELODY[beat % MELODY.length];
      if (note) marimba.triggerAttackRelease(note, '8n', time);
      bass.triggerAttackRelease(BASS[beat % BASS.length], '8n', time);
      if (CHIRPS[beat % CHIRPS.length]) {
        const eighth = Tone.Time('8n').toSeconds();
        chirp.triggerAttackRelease('E7', '64n', time + eighth);
        chirp.triggerAttackRelease('G7', '64n', time + eighth + 0.06);
      }
    },
    dispose() {
      [marimba, bass, chirp].forEach((node) => node.dispose());
    },
  };
}

/** Gentle spring menu loop: marimba, a soft bass and birds chirping between the notes. */
export const easterMusic: Music = { bpm: 104, createTrack };
