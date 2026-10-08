import type { Locale, Localized } from '../../core/i18n/locales';
import type { Card, Theme } from '../../core/types';

/**
 * What makes a memory game look like its festivity; the rules live in board.ts and are the
 * same for every skin. Card backs and the table's colours come from CSS under `.memory--<id>`.
 */
export interface MemorySkin {
  id: string;
  title: Localized<string>;
  /** How the turn is explained on the intro screen. */
  intro: Localized<string>;
  /** Drawn on the back of every card, so no card shows it on its face. */
  back: string;
}

/** The pictures to find: every picture card in the theme's decks, minus the one on the backs. */
export function memoryFaces(theme: Theme, skin: MemorySkin, locale: Locale): Card[] {
  return theme.decks[locale].flat().filter((card) => card.image !== skin.back);
}
