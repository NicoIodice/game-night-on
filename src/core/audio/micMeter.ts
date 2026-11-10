import * as Tone from 'tone';

/** Reads how loud the microphone is right now, in decibels (−Infinity for silence). */
export interface MicMeter {
  readDb(): number;
  close(): void;
}

export type MicResult = MicMeter | 'unsupported' | 'denied';

/**
 * Raw microphone: no automatic gain control, noise suppression or echo cancellation.
 * Chrome's gain control turns the system microphone level down when it hears shouting
 * (on Windows the change sticks for every app, speech recognition included), and it
 * would flatten the very loudness being measured.
 */
const RAW_AUDIO: MediaTrackConstraints = { autoGainControl: false, echoCancellation: false, noiseSuppression: false };

/** Opens the microphone for level readings. Must follow a click (audio unlock); the browser may ask first. */
export async function openMicMeter(): Promise<MicResult> {
  if (!navigator.mediaDevices?.getUserMedia) return 'unsupported';
  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: RAW_AUDIO });
  } catch {
    return 'denied';
  }
  const meter = new Tone.Meter({ smoothing: 0.5 });
  const source = Tone.getContext().createMediaStreamSource(stream);
  Tone.connect(source, meter);
  return {
    readDb() {
      const value = meter.getValue();
      return Array.isArray(value) ? Math.max(...value) : value;
    },
    close() {
      source.disconnect();
      stream.getTracks().forEach((track) => track.stop());
      meter.dispose();
    },
  };
}
