import { describe, expect, it } from 'vitest';
import type { GameDefinition } from '../types';
import { defaultLineup, gameOptions, moveGame, normalizeLineup, playlist, setGameOption, toggleGame } from './lineup';

const game = (id: string) => ({ id, name: id }) as GameDefinition;
const games = ['a', 'b', 'c'].map(game);
const rounds = { id: 'rounds', label: 'Rounds', min: 1, max: 10, default: 3 };
const withOptions = { ...game('a'), options: [rounds] } as GameDefinition;
const order = (lineup: { entries: { gameId: string }[] }) => lineup.entries.map((e) => e.gameId);

describe('lineup', () => {
  it('defaults to every game, in menu order, scored on its own', () => {
    const lineup = defaultLineup(games);
    expect(lineup.mode).toBe('single');
    expect(playlist(lineup, games).map((g) => g.id)).toEqual(['a', 'b', 'c']);
  });

  it('moves games up and down, ignoring moves off the ends', () => {
    const lineup = defaultLineup(games);
    expect(order(moveGame(lineup, 2, -1))).toEqual(['a', 'c', 'b']);
    expect(order(moveGame(lineup, 0, 1))).toEqual(['b', 'a', 'c']);
    expect(moveGame(lineup, 0, -1)).toBe(lineup);
    expect(moveGame(lineup, 2, 1)).toBe(lineup);
  });

  it('leaves switched-off games out of the playlist, but never the last one', () => {
    let lineup = toggleGame(toggleGame(defaultLineup(games), 0), 2);
    expect(playlist(lineup, games).map((g) => g.id)).toEqual(['b']);
    lineup = toggleGame(lineup, 1);
    expect(playlist(lineup, games).map((g) => g.id)).toEqual(['b']);
  });

  it('fits a saved lineup to the games that exist now', () => {
    const saved = {
      mode: 'tournament',
      entries: [
        { gameId: 'c', enabled: true },
        { gameId: 'gone', enabled: true },
        { gameId: 'a', enabled: false },
        { gameId: 'c', enabled: false },
      ],
    };
    const lineup = normalizeLineup(saved, games);
    expect(lineup.mode).toBe('tournament');
    expect(lineup.entries).toEqual([
      { gameId: 'c', enabled: true },
      { gameId: 'a', enabled: false },
      { gameId: 'b', enabled: true },
    ]);
  });

  it('falls back to the default for junk, and keeps one game enabled', () => {
    expect(normalizeLineup('nope', games)).toEqual(defaultLineup(games));
    const allOff = normalizeLineup({ entries: games.map((g) => ({ gameId: g.id, enabled: false })) }, games);
    expect(allOff.mode).toBe('single');
    expect(playlist(allOff, games).map((g) => g.id)).toEqual(['a']);
  });

  it('uses option defaults until players change them, kept in range', () => {
    let lineup = defaultLineup([withOptions]);
    expect(gameOptions(lineup, withOptions)).toEqual({ rounds: 3 });
    lineup = setGameOption(lineup, withOptions, rounds, 5);
    expect(gameOptions(lineup, withOptions)).toEqual({ rounds: 5 });
    expect(gameOptions(setGameOption(lineup, withOptions, rounds, 99), withOptions)).toEqual({ rounds: 10 });
    expect(gameOptions(defaultLineup(games), games[1])).toEqual({});
  });

  it('keeps saved option values that still fit, and drops the rest', () => {
    const saved = { entries: [], options: { a: { rounds: 0, gone: 4 }, gone: { rounds: 2 } } };
    expect(normalizeLineup(saved, [withOptions]).options).toEqual({ a: { rounds: 1 } });
    expect(normalizeLineup({ entries: [], options: { a: { rounds: 'x' } } }, [withOptions]).options).toEqual({});
  });
});
