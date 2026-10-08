import * as Tone from 'tone';
import type { BeatTrack, Music } from '../../core/audio/BeatClock';

/** A sunny calypso tune on steel drums, one note per beat, looping every two bars. */
const MELODY = ['E5', 'G5', 'C6', 'G5', 'A5', 'G5', 'E5', 'D5'];
const BASS = ['C3', 'C3', 'G2', 'G2', 'F2', 'F2', 'G2', 'G2'];

function createTrack(): BeatTrack {
  const steel = new Tone.FMSynth({
    volume: -14,
    harmonicity: 1.5,
    modulationIndex: 3,
    envelope: { attack: 0.002, decay: 0.3, sustain: 0.05, release: 0.3 },
    modulationEnvelope: { attack: 0.002, decay: 0.2, sustain: 0, release: 0.2 },
  }).toDestination();
  const bass = new Tone.Synth({ volume: -18, oscillator: { type: 'triangle' } }).toDestination();
  const shaker = new Tone.NoiseSynth({
    volume: -30,
    noise: { type: 'white' },
    envelope: { attack: 0.002, decay: 0.04, sustain: 0 },
  }).toDestination();

  return {
    play(time, beat) {
      const eighth = Tone.Time('8n').toSeconds();
      steel.triggerAttackRelease(MELODY[beat % MELODY.length], '8n', time);
      // Calypso bass: on the beat, and again just before the next one.
      bass.triggerAttackRelease(BASS[beat % BASS.length], '16n', time);
      if (beat % 2 === 1) bass.triggerAttackRelease(BASS[beat % BASS.length], '16n', time + eighth);
      shaker.triggerAttackRelease('32n', time);
      shaker.triggerAttackRelease('32n', time + eighth);
    },
    dispose() {
      [steel, bass, shaker].forEach((node) => node.dispose());
    },
  };
}

/** Sunny menu loop: steel drums, a calypso bass and a shaker. */
export const summerMusic: Music = { bpm: 112, createTrack };
