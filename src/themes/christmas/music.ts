import * as Tone from 'tone';
import type { BeatTrack, Music } from '../../core/audio/BeatClock';

/** Bouncy major bell melody, one note per beat, looping every two bars. */
const MELODY = ['E5', 'E5', 'E5', null, 'E5', 'G5', 'C5', 'D5'];
const BASS = ['C3', 'G2', 'C3', 'G2', 'F2', 'G2', 'C3', 'G2'];

function createTrack(): BeatTrack {
  const reverb = new Tone.Reverb({ decay: 2, wet: 0.3 }).toDestination();
  const bells = new Tone.FMSynth({ volume: -16, harmonicity: 3, modulationIndex: 8 }).connect(reverb);
  const bass = new Tone.Synth({ volume: -18, oscillator: { type: 'triangle' } }).toDestination();
  const sleigh = new Tone.NoiseSynth({
    volume: -30,
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.06, sustain: 0 },
  }).toDestination();

  return {
    play(time, beat) {
      const note = MELODY[beat % MELODY.length];
      const eighth = Tone.Time('8n').toSeconds();
      if (note) bells.triggerAttackRelease(note, '8n', time);
      bass.triggerAttackRelease(BASS[beat % BASS.length], '8n', time);
      sleigh.triggerAttackRelease('16n', time);
      sleigh.triggerAttackRelease('16n', time + eighth);
    },
    dispose() {
      [bells, bass, sleigh, reverb].forEach((node) => node.dispose());
    },
  };
}

/** Jingly menu loop with sleigh bells. */
export const christmasMusic: Music = { bpm: 120, createTrack };
