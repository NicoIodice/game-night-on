import * as Tone from 'tone';

const MUTED_KEY = 'game-night-on:muted';

/** Unlocks audio. Must run inside a click/tap/key handler. */
export function unlockAudio(): Promise<void> {
  return Tone.start();
}

export function setMuted(muted: boolean): void {
  Tone.getDestination().mute = muted;
  try {
    localStorage.setItem(MUTED_KEY, muted ? '1' : '0');
  } catch {
    // Storage can be unavailable (private mode); muting still works for this visit.
  }
}

export function loadMuted(): boolean {
  try {
    return localStorage.getItem(MUTED_KEY) === '1';
  } catch {
    return false;
  }
}
