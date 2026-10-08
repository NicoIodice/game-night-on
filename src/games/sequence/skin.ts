/** One pad of a sequence game: what it shows and the note it plays. */
export interface Pad {
  name: string;
  image: string;
  color: string;
  /** Played on the theme's instrument, e.g. 'A4'. */
  note: string;
}

/**
 * What makes a sequence game look like its festivity; the rules live in sequence.ts and are
 * the same for every skin. The stage's scenery comes from CSS under `.sequence--<id>`.
 */
export interface SequenceSkin {
  id: string;
  title: string;
  /** How the turn is explained on the intro screen. */
  intro: string;
  /** The big picture in the middle of the pads, e.g. a cauldron. */
  center: string;
  /** Up to six pads; the game night setting picks how many are used. */
  pads: Pad[];
  /** The caption when a wrong pad ends the turn, e.g. "Wrong ingredient!". */
  outTitle: string;
}
