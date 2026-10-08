import type { Cue } from '../../core/audio/beeper';
import type { Localized } from '../../core/i18n/locales';
import type { TargetKind } from './hunt';

/** The sounds of a shooting game. Each skin makes its own. */
export interface Sfx {
  hit(kind: TargetKind): void;
  miss(): void;
  cue(cue: Cue): void;
  timeUp(): void;
  dispose(): void;
}

/**
 * Everything that makes a shooting game look and sound like its festivity; the mechanics
 * live in hunt.ts and are the same for every skin. The arena's background and the targets'
 * colours come from CSS under `.shooter--<id>`.
 */
export interface ShooterSkin {
  id: string;
  title: Localized<string>;
  /** How the turn is explained on the intro screen. */
  intro: Localized<string>;
  kinds: Record<TargetKind, { name: Localized<string>; image: string }>;
  /** What a hit is counted as in the turn summary, one and many: ['bat', 'bats']. */
  hitNoun: Localized<[string, string]>;
  createSfx: () => Sfx;
}
