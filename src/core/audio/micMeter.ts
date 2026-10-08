import * as Tone from 'tone';

/** Reads how loud the microphone is right now, in decibels (−Infinity for silence). */
export interface MicMeter {
  readDb(): number;
  close(): void;
}

export type MicResult = MicMeter | 'unsupported' | 'denied';

/** Opens the microphone for level readings. Must follow a click (audio unlock); the browser may ask first. */
export async function openMicMeter(): Promise<MicResult> {
  if (!Tone.UserMedia.supported) return 'unsupported';
  const meter = new Tone.Meter({ smoothing: 0.5 });
  const mic = new Tone.UserMedia();
  mic.connect(meter);
  try {
    await mic.open();
  } catch {
    mic.dispose();
    meter.dispose();
    return 'denied';
  }
  return {
    readDb() {
      const value = meter.getValue();
      return Array.isArray(value) ? Math.max(...value) : value;
    },
    close() {
      mic.close();
      mic.dispose();
      meter.dispose();
    },
  };
}
