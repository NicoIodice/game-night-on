import type { Localized } from '../../core/i18n/locales';

/**
 * What makes a charades game belong to its festivity: its words. The rules live in words.ts
 * and Charades.tsx and are the same for every skin; colours come from CSS under `.charades--<id>`.
 */
export interface CharadesSkin {
  id: string;
  title: Localized<string>;
  /** How the turn is explained on the intro screen. */
  intro: Localized<string>;
  /** Drawn on the word card. */
  icon: string;
  /** Things to act out: easy to mime, festive, and fine for all ages. Each language can have its own. */
  words: Localized<string[]>;
}
