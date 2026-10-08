import * as Tone from 'tone';
import type { BeatTrack, Music } from '../../core/audio/BeatClock';

/** Spooky minor bass line, one note per beat, looping every two bars. */
const BASS_LINE = ['A1', 'A1', 'C2', 'E2', 'A1', 'A1', 'G1', 'E1'];
/** Eerie bell that marks the start of every bar. */
const BELL_NOTES = ['E5', 'C5'];

function createTrack(): BeatTrack {
  const kick = new Tone.MembraneSynth({ volume: -4 }).toDestination();
  const snare = new Tone.NoiseSynth({
    volume: -16,
    envelope: { attack: 0.001, decay: 0.15, sustain: 0 },
  }).toDestination();
  const hat = new Tone.MetalSynth({
    volume: -30,
    envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
  }).toDestination();
  const bassFilter = new Tone.Filter(600, 'lowpass').toDestination();
  const bass = new Tone.MonoSynth({
    volume: -12,
    oscillator: { type: 'sawtooth' },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.2 },
  }).connect(bassFilter);
  const bellReverb = new Tone.Reverb({ decay: 3, wet: 0.5 }).toDestination();
  const bell = new Tone.FMSynth({ volume: -22, modulationIndex: 12 }).connect(bellReverb);

  const instruments = [kick, snare, hat, bass, bassFilter, bell, bellReverb];

  return {
    play(time, beat) {
      const beatInBar = beat % 4;
      const eighth = Tone.Time('8n').toSeconds();
      kick.triggerAttackRelease('C1', '8n', time);
      if (beatInBar === 1 || beatInBar === 3) snare.triggerAttackRelease('16n', time);
      hat.triggerAttackRelease('C6', '32n', time + eighth);
      bass.triggerAttackRelease(BASS_LINE[beat % BASS_LINE.length], '8n', time);
      if (beatInBar === 0) bell.triggerAttackRelease(BELL_NOTES[(beat / 4) % 2], '2n', time);
    },
    dispose() {
      instruments.forEach((instrument) => instrument.dispose());
    },
  };
}

/** Spooky menu loop: thumping beat, minor bass and an eerie bell. */
export const halloweenMusic: Music = { bpm: 100, createTrack };
