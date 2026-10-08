import * as Tone from 'tone';
import type { BeatTrack, Music } from '../../core/audio/BeatClock';

/** A bright samba melody on a brassy synth, one note per beat, looping every two bars. */
const MELODY = ['C5', 'E5', 'G5', 'E5', 'F5', 'D5', 'B4', 'G4'];
/** The surdo (big samba drum) answers on the second beat of each pair. */
const SURDO = ['G1', 'C2'];

function createTrack(): BeatTrack {
  const brass = new Tone.Synth({
    volume: -18,
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.02, decay: 0.15, sustain: 0.3, release: 0.1 },
  }).toDestination();
  const surdo = new Tone.MembraneSynth({ volume: -6, octaves: 3, pitchDecay: 0.04 }).toDestination();
  const tamborim = new Tone.MembraneSynth({
    volume: -22,
    octaves: 1,
    pitchDecay: 0.005,
    envelope: { attack: 0.001, decay: 0.05, sustain: 0 },
  }).toDestination();
  const ganza = new Tone.NoiseSynth({
    volume: -30,
    noise: { type: 'white' },
    envelope: { attack: 0.002, decay: 0.03, sustain: 0 },
  }).toDestination();

  return {
    play(time, beat) {
      const sixteenth = Tone.Time('16n').toSeconds();
      brass.triggerAttackRelease(MELODY[beat % MELODY.length], '16n', time);
      surdo.triggerAttackRelease(SURDO[beat % 2], '8n', time);
      // Samba's busy shaker on every sixteenth, the tamborim on the syncopated ones.
      for (let i = 0; i < 4; i++) ganza.triggerAttackRelease('64n', time + i * sixteenth);
      tamborim.triggerAttackRelease('A4', '32n', time + 3 * sixteenth);
    },
    dispose() {
      [brass, surdo, tamborim, ganza].forEach((node) => node.dispose());
    },
  };
}

/** Samba menu loop: brass, the big surdo drum, a tamborim and a busy shaker. */
export const carnivalMusic: Music = { bpm: 108, createTrack };
