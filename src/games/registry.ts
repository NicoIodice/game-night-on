import type { GameDefinition, Theme } from '../core/types';
import { adventAmbush } from './advent-ambush';
import { batBlitz } from './bat-blitz';
import { bellChoir } from './bell-choir';
import { festiveCharades } from './festive-charades';
import { hauntedHouse } from './haunted-house';
import { monsterCharades } from './monster-charades';
import { presentPairs } from './present-pairs';
import { pumpkinPatchMemory } from './pumpkin-patch-memory';
import { singOnTheBeat } from './sing-on-the-beat';
import { snowballShowdown } from './snowball-showdown';
import { witchsCauldron } from './witchs-cauldron';

/** Every game. Adding a game = one folder exporting a GameDefinition + one line here. */
export const GAMES: GameDefinition[] = [
  singOnTheBeat,
  batBlitz,
  snowballShowdown,
  pumpkinPatchMemory,
  presentPairs,
  witchsCauldron,
  bellChoir,
  hauntedHouse,
  adventAmbush,
  monsterCharades,
  festiveCharades,
];

/** The theme's games that are switched on (`enabled`) and that the theme has everything for. */
export function gamesFor(theme: Theme, games: readonly GameDefinition[] = GAMES): GameDefinition[] {
  return games.filter(
    (game) => game.enabled && (game.themes === 'all' || game.themes.includes(theme.id)) && game.supports(theme),
  );
}

/** The game's menu screenshot as played in this theme, if it has one. */
export function thumbnailFor(game: GameDefinition, theme: Theme): string | undefined {
  return typeof game.thumbnail === 'string' ? game.thumbnail : game.thumbnail?.[theme.id];
}
