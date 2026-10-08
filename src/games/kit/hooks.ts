import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { Cue } from '../../core/audio/beeper';
import { unlockAudio } from '../../core/audio/sound';
import type { ThemeSounds } from '../../core/audio/themeSounds';
import type { Theme } from '../../core/types';

/** The usual life of a turn: rules, 3-2-1, play, then a moment on the result before the match moves on. */
export type TurnPhase = 'intro' | 'countdown' | 'playing' | 'over';

export const COUNTDOWN_FROM = 3;
const COUNT_MS = 700;
/** How long the result ("Time's up!") stays on screen before the turn ends. */
export const OVER_MS = 2000;

/**
 * The theme's sound effects for this turn, created on first use (after a click, so audio is
 * allowed) and cleaned up when the turn ends.
 */
export function useThemeSounds(theme: Theme) {
  const ref = useRef<ThemeSounds | null>(null);
  useEffect(() => () => ref.current?.dispose(), []);
  return () => {
    void unlockAudio();
    ref.current ??= theme.createSounds();
    return ref.current;
  };
}

/** Counts down from 3 while `active`, calling `onCue` per number (to beep), then calls `onGo`. Returns the number to show. */
export function useCountdown(active: boolean, onGo: () => void, onCue?: (cue: Cue) => void): number {
  const [count, setCount] = useState(COUNTDOWN_FROM);
  const go = useEffectEvent(onGo);
  const beep = useEffectEvent((cue: Cue) => onCue?.(cue));

  useEffect(() => {
    if (!active) return;
    let remaining = COUNTDOWN_FROM;
    beep('count');
    const timer = setInterval(() => {
      remaining--;
      if (remaining > 0) {
        setCount(remaining);
        beep('count');
      } else {
        clearInterval(timer);
        setCount(COUNTDOWN_FROM); // ready for the next countdown
        beep('go');
        go();
      }
    }, COUNT_MS);
    return () => clearInterval(timer);
  }, [active]);

  return count;
}

/**
 * Calls `tick` with the seconds since the last frame, once per animation frame, while `active`.
 * Return false from `tick` to stop. The step is capped so a hidden tab doesn't jump the game forward.
 */
export function useFrameLoop(active: boolean, tick: (dt: number) => boolean | void) {
  const onFrame = useEffectEvent(tick);
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (onFrame(dt) === false) return;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [active]);
}

/** Calls `onDone` once, `ms` after `active` turns true (e.g. to end the turn after showing the result). */
export function useAfter(active: boolean, ms: number, onDone: () => void) {
  const done = useEffectEvent(onDone);
  useEffect(() => {
    if (!active) return;
    const timer = setTimeout(done, ms);
    return () => clearTimeout(timer);
  }, [active, ms]);
}

/** The whole seconds left if a countdown clock just passed a second (from `before` to `after` seconds left), else null. */
export function secondsCrossed(before: number, after: number): number | null {
  const was = Math.ceil(before);
  const now = Math.ceil(after);
  return now < was ? now : null;
}
