export interface Level {
  number: number;
  /** Tempo of the beat; later levels go faster. */
  bpm: number;
  /** Each round deals a fresh hand of cards. */
  rounds: number;
  /** Cards to sing per round. */
  cardCount: number;
  /** How many card types from the theme's deck are in play. */
  cardTypes: number;
  /** Max times the same card may appear in one hand. */
  maxRepeats: number;
}

export const LEVELS: Level[] = [
  { number: 1, bpm: 90, rounds: 4, cardCount: 3, cardTypes: 4, maxRepeats: 2 },
];
