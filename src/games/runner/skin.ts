import type { Localized } from '../../core/i18n/locales';
import type { ObstacleKind } from './dash';

/**
 * What makes a running game look like its festivity; the physics live in dash.ts and are the
 * same for every skin. Sky, hills and ground come from CSS under `.runner--<id>`.
 */
export interface RunnerSkin {
  id: string;
  title: Localized<string>;
  /** How the turn is explained on the intro screen. */
  intro: Localized<string>;
  /** The character who runs. */
  runner: string;
  obstacles: Record<ObstacleKind, { name: Localized<string>; image: string }>;
  /** What there is to grab on the way. */
  treat: { name: Localized<string>; image: string };
  /** Treats in the turn summary, one and many: ['sweet', 'sweets']. */
  treatNoun: Localized<[string, string]>;
}
