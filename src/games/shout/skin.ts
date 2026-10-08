/**
 * What makes a shouting game belong to its festivity; the scoring lives in loudness.ts and is the
 * same for every skin. The meter's colours and scenery come from CSS under `.shout--<id>`.
 */
export interface ShoutSkin {
  id: string;
  title: string;
  /** How the turn is explained on the intro screen. */
  intro: string;
  /** Rides up the meter as the player gets louder. */
  mascot: string;
  /** Shown big while the player shouts, e.g. "SCREAM!". */
  call: string;
  /** How a score is described, loudest last: the last rank whose `from` the score reaches is used. */
  ranks: { from: number; label: string }[];
}

export function rankFor(skin: ShoutSkin, score: number): string {
  return skin.ranks.filter((rank) => score >= rank.from).at(-1)?.label ?? '';
}
