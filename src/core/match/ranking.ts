import type { Player } from '../types';

export interface Standing {
  player: Player;
  score: number;
  /** 1 for the winner. Tied scores share a place and the next place is skipped (1, 1, 3). */
  place: number;
}

/** Orders players by score, highest first; ties keep seating order. */
export function rankPlayers(players: readonly Player[], scores: Readonly<Record<string, number>>): Standing[] {
  const sorted = players
    .map((player, seat) => ({ player, seat, score: scores[player.id] ?? 0 }))
    .sort((a, b) => b.score - a.score || a.seat - b.seat);

  return sorted.map(({ player, score }) => ({
    player,
    score,
    place: sorted.findIndex((other) => other.score === score) + 1,
  }));
}

/** Everyone sharing first place. */
export function winners(standings: readonly Standing[]): Standing[] {
  return standings.filter((standing) => standing.place === 1);
}

/** Adds up each player's scores over several games; games not played yet are skipped. */
export function sumScores(rounds: readonly (Readonly<Record<string, number>> | undefined)[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const round of rounds) {
    for (const [id, score] of Object.entries(round ?? {})) totals[id] = (totals[id] ?? 0) + score;
  }
  return totals;
}
