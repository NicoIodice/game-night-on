import { describe, expect, it } from 'vitest';
import type { GameDefinition } from '../core/types';
import { christmas } from '../themes/christmas/theme';
import { halloween } from '../themes/halloween/theme';
import { GAMES, gamesFor } from './registry';

const game = (id: string, overrides: Partial<GameDefinition> = {}): GameDefinition => ({
  id,
  enabled: true,
  name: { 'en-US': id, 'pt-PT': id },
  description: { 'en-US': '', 'pt-PT': '' },
  kind: 'party',
  players: { min: 1, max: 8 },
  themes: 'all',
  supports: () => true,
  Component: () => null,
  ...overrides,
});

describe('gamesFor', () => {
  it('hides games that are switched off', () => {
    const games = [game('on'), game('off', { enabled: false })];
    expect(gamesFor(halloween, games).map((g) => g.id)).toEqual(['on']);
  });

  it("only lists a theme's own games", () => {
    const games = [game('common'), game('spooky', { themes: ['halloween'] }), game('festive', { themes: ['christmas'] })];
    expect(gamesFor(halloween, games).map((g) => g.id)).toEqual(['common', 'spooky']);
    expect(gamesFor(christmas, games).map((g) => g.id)).toEqual(['common', 'festive']);
  });

  it('skips games the theme lacks something for', () => {
    expect(gamesFor(halloween, [game('picky', { supports: () => false })])).toEqual([]);
  });
});

describe('GAMES', () => {
  it('has unique ids', () => {
    expect(new Set(GAMES.map((g) => g.id)).size).toBe(GAMES.length);
  });

  it("has what every game needs in each theme's decks, in every language", () => {
    for (const theme of [halloween, christmas]) {
      const meant = GAMES.filter((g) => g.enabled && (g.themes === 'all' || g.themes.includes(theme.id)));
      expect(gamesFor(theme).map((g) => g.id)).toEqual(meant.map((g) => g.id));
    }
  });
});

describe('theme decks', () => {
  it('give every card its own id across themes and languages, since learned words are saved by card id', () => {
    const ids = [halloween, christmas].flatMap((theme) => Object.values(theme.decks).flat(2).map((card) => card.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});
