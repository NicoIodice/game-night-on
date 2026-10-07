import { useCallback, useEffect, useRef } from 'react';
import { BeatClock, type BeatListener, type BeatTrack } from './BeatClock';

/** A BeatClock owned by a component: a fresh track per start, cleaned up on unmount. */
export function useBeatClock(createTrack: () => BeatTrack) {
  const clockRef = useRef<BeatClock | null>(null);

  useEffect(
    () => () => {
      clockRef.current?.dispose();
      clockRef.current = null;
    },
    [],
  );

  const start = useCallback(
    (bpm: number, onBeat: BeatListener) => {
      clockRef.current?.dispose();
      clockRef.current = new BeatClock(createTrack());
      return clockRef.current.start(bpm, onBeat);
    },
    [createTrack],
  );

  const stop = useCallback(() => clockRef.current?.stop(), []);

  return { start, stop };
}
