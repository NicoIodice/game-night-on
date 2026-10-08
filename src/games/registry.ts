import type { GameDefinition, Theme } from '../core/types';
import { batBlitz } from './bat-blitz';
import { singOnTheBeat } from './sing-on-the-beat';

/** Every game. Adding a game = one folder exporting a GameDefinition + one line here. */
export const GAMES: GameDefinition[] = [singOnTheBeat, batBlitz];

export function gamesFor(theme: Theme): GameDefinition[] {
  return GAMES.filter((game) => (game.themes === 'all' || game.themes.includes(theme.id)) && game.supports(theme));
}
