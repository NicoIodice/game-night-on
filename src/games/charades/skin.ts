/**
 * What makes a charades game belong to its festivity: its words. The rules live in words.ts
 * and Charades.tsx and are the same for every skin; colours come from CSS under `.charades--<id>`.
 */
export interface CharadesSkin {
  id: string;
  title: string;
  /** How the turn is explained on the intro screen. */
  intro: string;
  /** Drawn on the word card. */
  icon: string;
  /** Things to act out: easy to mime, festive, and fine for all ages. */
  words: string[];
}
