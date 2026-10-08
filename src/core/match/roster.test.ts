import { describe, expect, it } from 'vitest';
import { createRoster, finalizeRoster, MAX_PLAYERS, renamePlayer, resizeRoster, setRosterKind } from './roster';

describe('roster', () => {
  it('gives every seat its own colour', () => {
    const colors = createRoster('players', MAX_PLAYERS).players.map((p) => p.color);
    expect(new Set(colors).size).toBe(MAX_PLAYERS);
  });

  it('keeps typed names when resizing, within the limits', () => {
    const roster = renamePlayer(createRoster('players', 2), 0, 'Ana');
    expect(resizeRoster(roster, 3).players.map((p) => p.name)).toEqual(['Ana', 'Player 2', 'Player 3']);
    expect(resizeRoster(roster, 0).players).toHaveLength(1);
    expect(resizeRoster(roster, 99).players).toHaveLength(MAX_PLAYERS);
  });

  it('renames default names when switching to teams, but not typed ones', () => {
    const roster = renamePlayer(createRoster('players', 2), 0, 'Witches');
    expect(setRosterKind(roster, 'teams').players.map((p) => p.name)).toEqual(['Witches', 'Team 2']);
  });

  it('fills blank names before playing', () => {
    const roster = renamePlayer(createRoster('teams', 2), 1, '   ');
    expect(finalizeRoster(roster).players.map((p) => p.name)).toEqual(['Team 1', 'Team 2']);
  });
});
