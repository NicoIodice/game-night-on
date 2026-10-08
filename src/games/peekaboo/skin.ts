import type { PeekKind } from './peek';

/**
 * What makes a pop-up game look like its festivity; the rules live in peek.ts and are the same
 * for every skin. The holes (windows, doors…) and the scenery come from CSS under `.peek--<id>`.
 */
export interface PeekSkin {
  id: string;
  title: string;
  /** How the turn is explained on the intro screen. */
  intro: string;
  kinds: Record<PeekKind, { name: string; image: string }>;
  /** What a catch is counted as in the turn summary, one and many: ['ghost', 'ghosts']. */
  caughtNoun: [string, string];
  /** Shown on a hole when nobody is in it, e.g. advent calendar numbers. */
  holeLabel?: (hole: number) => string;
}
