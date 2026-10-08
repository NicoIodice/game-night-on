import type { GameDefinition, Theme } from '../core/types';
import { batBlitz } from './bat-blitz';
import { singOnTheBeat } from './sing-on-the-beat';
import { snowballShowdown } from './snowball-showdown';

/** Every game. Adding a game = one folder exporting a GameDefinition + one line here. */
export const GAMES: GameDefinition[] = [singOnTheBeat, batBlitz, snowballShowdown];

export function gamesFor(theme: Theme): GameDefinition[] {
  return GAMES.filter((game) => (game.themes === 'all' || game.themes.includes(theme.id)) && game.supports(theme));
}

/** The game's menu screenshot as played in this theme, if it has one. */
export function thumbnailFor(game: GameDefinition, theme: Theme): string | undefined {
  return typeof game.thumbnail === 'string' ? game.thumbnail : game.thumbnail?.[theme.id];
}
