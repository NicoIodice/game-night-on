import * as Tone from 'tone';

/** Sounds played on the beat: called once per beat with the exact audio time. */
export interface BeatTrack {
  play(time: number, beat: number): void;
  dispose(): void;
}

/** A looping piece of background music. */
export interface Music {
  bpm: number;
  createTrack: () => BeatTrack;
}

export type BeatListener = (beat: number) => void;

/** The clock currently driving Tone's single shared transport. */
let owner: symbol | null = null;

/**
 * Sample-accurate beat scheduler. Audio is scheduled on the audio clock and
 * listeners are called in sync with it on the next animation frame, so the UI
 * never drifts from the sound (unlike setTimeout/setInterval).
 *
 * All clocks share Tone's single transport, so only one may run at a time.
 */
export class BeatClock {
  private readonly track: BeatTrack;
  private readonly id = Symbol('BeatClock');
  private beat = 0;
  /** Bumped on every start/stop so a start still awaiting audio unlock can tell it was cancelled. */
  private run = 0;

  constructor(track: BeatTrack) {
    this.track = track;
  }

  /** Browsers only allow audio after a user gesture (click/tap/key) has happened on the page. */
  async start(bpm: number, onBeat?: BeatListener): Promise<void> {
    const run = ++this.run;
    await Tone.start();
    if (run !== this.run) return;

    const transport = Tone.getTransport();
    resetTransport();
    owner = this.id;
    transport.bpm.value = bpm;
    this.beat = 0;
    transport.scheduleRepeat((time) => {
      const beat = this.beat++;
      this.track.play(time, beat);
      if (onBeat) Tone.getDraw().schedule(() => onBeat(beat), time);
    }, '4n');
    transport.start('+0.1');
  }

  /** Only resets the shared transport if this clock owns it, so it never stops another clock. */
  stop(): void {
    this.run++;
    if (owner !== this.id) return;
    owner = null;
    resetTransport();
  }

  dispose(): void {
    this.stop();
    this.track.dispose();
  }
}

function resetTransport(): void {
  const transport = Tone.getTransport();
  transport.stop();
  transport.cancel();
  Tone.getDraw().cancel();
}
