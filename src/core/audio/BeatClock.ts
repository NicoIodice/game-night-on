import * as Tone from 'tone';

/** The music a theme plays: called once per beat with the exact audio time. */
export interface BeatTrack {
  play(time: number, beat: number): void;
  dispose(): void;
}

export type BeatListener = (beat: number) => void;

/**
 * Sample-accurate beat scheduler. Audio is scheduled on the audio clock and
 * listeners are called in sync with it on the next animation frame, so the UI
 * never drifts from the music (unlike setTimeout/setInterval).
 */
export class BeatClock {
  private readonly track: BeatTrack;
  private beat = 0;

  constructor(track: BeatTrack) {
    this.track = track;
  }

  /** Must be called from a user gesture (click/tap): browsers block audio otherwise. */
  async start(bpm: number, onBeat: BeatListener): Promise<void> {
    await Tone.start();
    this.stop();

    const transport = Tone.getTransport();
    transport.bpm.value = bpm;
    this.beat = 0;
    transport.scheduleRepeat((time) => {
      const beat = this.beat++;
      this.track.play(time, beat);
      Tone.getDraw().schedule(() => onBeat(beat), time);
    }, '4n');
    transport.start('+0.1');
  }

  setBpm(bpm: number): void {
    Tone.getTransport().bpm.value = bpm;
  }

  stop(): void {
    const transport = Tone.getTransport();
    transport.stop();
    transport.cancel();
    Tone.getDraw().cancel();
  }

  dispose(): void {
    this.stop();
    this.track.dispose();
  }
}
