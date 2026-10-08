import { describe, expect, it } from 'vitest';
import type { GameDefinition } from '../types';
import {
  defaultLineup,
  gameOptions,
  isCustom,
  moveGame,
  normalizeLineup,
  playlist,
  setDifficulty,
  setGameOption,
  toggleGame,
} from './lineup';

const game = (id: string) => ({ id, name: { 'en-US': id, 'pt-PT': id } }) as GameDefinition;
const games = ['a', 'b', 'c'].map(game);
const rounds = { id: 'rounds', label: { 'en-US': 'Rounds', 'pt-PT': 'Rondas' }, min: 1, max: 10, default: 3 };
const withOptions = { ...game('a'), options: [rounds] } as GameDefinition;
const tempo = { id: 'tempo', label: { 'en-US': 'Tempo', 'pt-PT': 'Ritmo' }, min: 60, max: 110, default: 80, easy: 70, hard: 95 };
const withTempo = { ...game('a'), options: [rounds, tempo] } as GameDefinition;
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

  it('starts on normal, and each difficulty sets its values, or the default where it has none', () => {
    const lineup = defaultLineup([withTempo]);
    expect(lineup.difficulty).toBe('normal');
    expect(gameOptions(lineup, withTempo)).toEqual({ rounds: 3, tempo: 80 });
    expect(gameOptions(setDifficulty(lineup, 'easy'), withTempo)).toEqual({ rounds: 3, tempo: 70 });
    expect(gameOptions(setDifficulty(lineup, 'hard'), withTempo)).toEqual({ rounds: 3, tempo: 95 });
  });

  it("is custom once an option differs from the difficulty's, until it's set back or a difficulty is picked", () => {
    const hard = setDifficulty(defaultLineup([withTempo]), 'hard');
    const changed = setGameOption(hard, withTempo, tempo, 100);
    expect(isCustom(hard)).toBe(false);
    expect(isCustom(changed)).toBe(true);
    expect(gameOptions(changed, withTempo)).toEqual({ rounds: 3, tempo: 100 });
    expect(isCustom(setGameOption(changed, withTempo, tempo, 95))).toBe(false);
    const easy = setDifficulty(changed, 'easy');
    expect(isCustom(easy)).toBe(false);
    expect(gameOptions(easy, withTempo)).toEqual({ rounds: 3, tempo: 70 });
  });

  it("keeps a saved difficulty, and drops saved values that match it", () => {
    const saved = { entries: [], difficulty: 'hard', options: { a: { tempo: 95, rounds: 4 } } };
    const lineup = normalizeLineup(saved, [withTempo]);
    expect(lineup.difficulty).toBe('hard');
    expect(lineup.options).toEqual({ a: { rounds: 4 } });
    expect(normalizeLineup({ difficulty: 'impossible' }, [withTempo]).difficulty).toBe('normal');
  });
});
