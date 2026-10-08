import * as Tone from 'tone';
import type { BeatTrack, Music } from '../../core/audio/BeatClock';

/** A disco tune with a shiny synth lead, one note per beat, looping every two bars. */
const LEAD = ['A4', 'C5', 'E5', 'C5', 'G4', 'B4', 'D5', 'B4'];
/** Octave-jumping disco bass on the off-beats. */
const BASS = ['A2', 'A2', 'A2', 'A2', 'G2', 'G2', 'G2', 'G2'];

function createTrack(): BeatTrack {
  const kick = new Tone.MembraneSynth({ volume: -8 }).toDestination();
  const hat = new Tone.MetalSynth({
    volume: -32,
    envelope: { attack: 0.001, decay: 0.04, release: 0.01 },
  }).toDestination();
  const bass = new Tone.Synth({
    volume: -16,
    oscillator: { type: 'square' },
    envelope: { attack: 0.005, decay: 0.12, sustain: 0, release: 0.05 },
  }).toDestination();
  const reverb = new Tone.Reverb({ decay: 1.5, wet: 0.25 }).toDestination();
  const lead = new Tone.Synth({
    volume: -18,
    oscillator: { type: 'fatsawtooth', count: 3, spread: 18 },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.2 },
  }).connect(reverb);

  return {
    play(time, beat) {
      const eighth = Tone.Time('8n').toSeconds();
      const root = BASS[beat % BASS.length];
      kick.triggerAttackRelease('C1', '8n', time);
      hat.triggerAttackRelease('C6', '32n', time + eighth);
      bass.triggerAttackRelease(root, '16n', time);
      bass.triggerAttackRelease(Tone.Frequency(root).transpose(12).toNote(), '16n', time + eighth);
      lead.triggerAttackRelease(LEAD[beat % LEAD.length], '8n', time);
    },
    dispose() {
      [kick, hat, bass, lead, reverb].forEach((node) => node.dispose());
    },
  };
}

/** Party menu loop: four-on-the-floor disco with an octave bass and a shiny lead. */
export const newYearMusic: Music = { bpm: 120, createTrack };
