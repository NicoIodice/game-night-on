import { describe, expect, it } from 'vitest';
import type { GameDefinition } from '../core/types';
import { christmas } from '../themes/christmas/theme';
import { halloween } from '../themes/halloween/theme';
import { GAMES, gamesFor } from './registry';

const game = (id: string, overrides: Partial<GameDefinition> = {}): GameDefinition => ({
  id,
  enabled: true,
  name: id,
  description: '',
  kind: 'party',
  players: '',
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
});
