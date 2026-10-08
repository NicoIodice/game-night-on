import { useEffect } from 'react';
import { BeatClock, type Music } from './BeatClock';

/** Loops `music` while mounted; switching or passing null stops the previous piece. */
export function useMusic(music: Music | null) {
  useEffect(() => {
    if (!music) return;
    const clock = new BeatClock(music.createTrack());
    void clock.start(music.bpm);
    return () => clock.dispose();
  }, [music]);
}
