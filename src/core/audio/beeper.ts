import * as Tone from 'tone';

/** Short UI sounds games can schedule on the beat. */
export type Cue = 'count' | 'go' | 'tick';

const CUES: Record<Cue, { note: string; duration: string; velocity: number }> = {
  count: { note: 'A5', duration: '16n', velocity: 0.8 },
  go: { note: 'A6', duration: '8n', velocity: 0.9 },
  tick: { note: 'E5', duration: '64n', velocity: 0.25 },
};

export interface Beeper {
  play(cue: Cue, time: number): void;
  dispose(): void;
}

export function createBeeper(): Beeper {
  const synth = new Tone.Synth({
    volume: -8,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.002, decay: 0.08, sustain: 0.2, release: 0.05 },
  }).toDestination();

  return {
    play(cue, time) {
      const { note, duration, velocity } = CUES[cue];
      synth.triggerAttackRelease(note, duration, time, velocity);
    },
    dispose: () => synth.dispose(),
  };
}
