import * as Tone from 'tone';
import type { BeatTrack, Music } from '../core/audio/BeatClock';

/** Dreamy arpeggio over a soft pad, one chord per bar. */
const CHORDS = [
  ['C4', 'E4', 'G4', 'B4'],
  ['A3', 'C4', 'E4', 'G4'],
  ['F3', 'A3', 'C4', 'E4'],
  ['G3', 'B3', 'D4', 'F4'],
];

function createTrack(): BeatTrack {
  const delay = new Tone.FeedbackDelay({ delayTime: '8n.', feedback: 0.3, wet: 0.25 }).toDestination();
  const pluck = new Tone.Synth({
    volume: -16,
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.005, decay: 0.3, sustain: 0, release: 0.3 },
  }).connect(delay);
  const pad = new Tone.PolySynth(Tone.Synth, {
    volume: -26,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.8, decay: 0.5, sustain: 0.6, release: 1.5 },
  }).toDestination();

  return {
    play(time, beat) {
      const chord = CHORDS[Math.floor(beat / 4) % CHORDS.length];
      const eighth = Tone.Time('8n').toSeconds();
      pluck.triggerAttackRelease(chord[beat % 4], '16n', time);
      pluck.triggerAttackRelease(chord[(beat + 2) % 4], '16n', time + eighth);
      if (beat % 4 === 0) pad.triggerAttackRelease(chord.slice(0, 3), '1m', time);
    },
    dispose() {
      [pluck, pad, delay].forEach((node) => node.dispose());
    },
  };
}

/** Plays on the festivity picker. */
export const lobbyMusic: Music = { bpm: 84, createTrack };
