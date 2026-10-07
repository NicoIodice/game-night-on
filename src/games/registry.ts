import type { GameDefinition, Theme } from '../core/types';
import { singOnTheBeat } from './sing-on-the-beat';

/** Every game. Adding a game = one folder exporting a GameDefinition + one line here. */
export const GAMES: GameDefinition[] = [singOnTheBeat];

export function gamesFor(theme: Theme): GameDefinition[] {
  return GAMES.filter((game) => (game.themes === 'all' || game.themes.includes(theme.id)) && game.supports(theme));
}
