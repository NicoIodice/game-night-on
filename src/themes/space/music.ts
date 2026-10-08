import * as Tone from 'tone';
import type { BeatTrack, Music } from '../../core/audio/BeatClock';

/** A floaty arpeggio on a bright synth, one note per beat, looping every two bars. */
const ARPEGGIO = ['A4', 'E5', 'B5', 'E5', 'F4', 'C5', 'G5', 'C5'];
/** A deep pad that holds each chord for a bar. */
const PADS = [
  ['A2', 'E3'],
  ['F2', 'C3'],
];

function createTrack(): BeatTrack {
  const delay = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.35, wet: 0.3 }).toDestination();
  const arp = new Tone.Synth({
    volume: -16,
    oscillator: { type: 'square' },
    envelope: { attack: 0.005, decay: 0.15, sustain: 0.1, release: 0.2 },
  }).connect(delay);
  const pad = new Tone.PolySynth(Tone.Synth, {
    volume: -24,
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.6, decay: 0.4, sustain: 0.7, release: 1.2 },
  }).toDestination();
  const blip = new Tone.Synth({
    volume: -28,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.02 },
  }).toDestination();

  return {
    play(time, beat) {
      arp.triggerAttackRelease(ARPEGGIO[beat % ARPEGGIO.length], '16n', time);
      if (beat % 4 === 0) pad.triggerAttackRelease(PADS[(beat / 4) % 2], '1n', time);
      // A radio blip from mission control every other bar.
      if (beat % 8 === 6) blip.triggerAttackRelease('C7', '64n', time + Tone.Time('8n').toSeconds());
    },
    dispose() {
      [arp, pad, blip, delay].forEach((node) => node.dispose());
    },
  };
}

/** Cosmic menu loop: an echoing arpeggio over a deep pad, with the odd radio blip. */
export const spaceMusic: Music = { bpm: 96, createTrack };
