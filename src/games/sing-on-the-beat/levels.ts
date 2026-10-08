export interface Level {
  number: number;
  /** Beats per minute added to the base tempo, so the hardest levels go faster. */
  faster: number;
  /**
   * Which of the theme's decks the cards come from, easiest first: rhymes from a small deck
   * (bat, rat…), then rhymes from a bigger deck of trickier words, then words of different lengths.
   */
  deck: number;
  /** Cards to sing per round. */
  cardCount: number;
  /** Max times the same card may appear in one hand. */
  maxRepeats: number;
}

/** Rounds per level unless changed in the game night settings. Each round deals a fresh hand. */
export const DEFAULT_ROUNDS = 3;

/** Base tempo in beats per minute unless changed in the game night settings. */
export const DEFAULT_TEMPO = 80;

/** Every deck is played with 3, then 4, then 5 cards per round. The last deck also speeds up the beat. */
export const LEVELS: Level[] = [
  { number: 1, faster: 0, deck: 0, cardCount: 3, maxRepeats: 2 },
  { number: 2, faster: 0, deck: 0, cardCount: 4, maxRepeats: 2 },
  { number: 3, faster: 0, deck: 0, cardCount: 5, maxRepeats: 2 },
  { number: 4, faster: 0, deck: 1, cardCount: 3, maxRepeats: 2 },
  { number: 5, faster: 0, deck: 1, cardCount: 4, maxRepeats: 2 },
  { number: 6, faster: 0, deck: 1, cardCount: 5, maxRepeats: 2 },
  { number: 7, faster: 10, deck: 2, cardCount: 3, maxRepeats: 2 },
  { number: 8, faster: 10, deck: 2, cardCount: 4, maxRepeats: 2 },
  { number: 9, faster: 10, deck: 2, cardCount: 5, maxRepeats: 2 },
];
