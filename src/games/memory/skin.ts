import type { Card, Theme } from '../../core/types';

/**
 * What makes a memory game look like its festivity; the rules live in board.ts and are the
 * same for every skin. Card backs and the table's colours come from CSS under `.memory--<id>`.
 */
export interface MemorySkin {
  id: string;
  title: string;
  /** How the turn is explained on the intro screen. */
  intro: string;
  /** Drawn on the back of every card. */
  back: string;
  /** Theme cards left out of the game, e.g. the picture used on the backs. */
  skip?: string[];
}

/** The pictures to find: every picture card in the theme's decks, minus the skipped ones. */
export function memoryFaces(theme: Theme, skin: MemorySkin): Card[] {
  return theme.decks.flat().filter((card) => !skin.skip?.includes(card.id));
}
