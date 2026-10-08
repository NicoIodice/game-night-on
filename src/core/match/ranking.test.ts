import { describe, expect, it } from 'vitest';
import type { Player } from '../types';
import { rankPlayers, sumScores, winners } from './ranking';

const player = (id: string): Player => ({ id, name: id, color: '#fff' });
const [ana, bo, cy, di] = ['ana', 'bo', 'cy', 'di'].map(player);

describe('rankPlayers', () => {
  it('orders by score, highest first', () => {
    const standings = rankPlayers([ana, bo, cy], { ana: 10, bo: 30, cy: 20 });
    expect(standings.map((s) => [s.player.id, s.place])).toEqual([
      ['bo', 1],
      ['cy', 2],
      ['ana', 3],
    ]);
  });

  it('gives tied players the same place and skips the next one', () => {
    const standings = rankPlayers([ana, bo, cy, di], { ana: 50, bo: 50, cy: 20, di: 20 });
    expect(standings.map((s) => [s.player.id, s.place])).toEqual([
      ['ana', 1],
      ['bo', 1],
      ['cy', 3],
      ['di', 3],
    ]);
    expect(winners(standings).map((s) => s.player.id)).toEqual(['ana', 'bo']);
  });

  it('counts players without a score as zero', () => {
    const standings = rankPlayers([ana, bo], { bo: 5 });
    expect(standings.map((s) => [s.player.id, s.score])).toEqual([
      ['bo', 5],
      ['ana', 0],
    ]);
  });
});

describe('sumScores', () => {
  it('adds up each player over the games played so far', () => {
    expect(sumScores([{ ana: 10, bo: 5 }, undefined, { bo: 7, cy: 1 }])).toEqual({ ana: 10, bo: 12, cy: 1 });
    expect(sumScores([])).toEqual({});
  });
});
