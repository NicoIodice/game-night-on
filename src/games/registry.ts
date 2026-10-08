import type { GameDefinition, Theme } from '../core/types';
import { adventAmbush } from './advent-ambush';
import { balloonPop } from './balloon-pop';
import { batBlitz } from './bat-blitz';
import { bellChoir } from './bell-choir';
import { birthdayCheer } from './birthday-cheer';
import { festiveCharades } from './festive-charades';
import { gingerbreadDash } from './gingerbread-dash';
import { hauntedHouse } from './haunted-house';
import { hoHoHoller } from './ho-ho-holler';
import { monsterCharades } from './monster-charades';
import { partyBand } from './party-band';
import { partyCharades } from './party-charades';
import { partyDash } from './party-dash';
import { partyPairs } from './party-pairs';
import { presentPairs } from './present-pairs';
import { pumpkinPatchMemory } from './pumpkin-patch-memory';
import { screamMeter } from './scream-meter';
import { singOnTheBeat } from './sing-on-the-beat';
import { snowballShowdown } from './snowball-showdown';
import { surpriseBoxes } from './surprise-boxes';
import { trickOrTreatDash } from './trick-or-treat-dash';
import { witchsCauldron } from './witchs-cauldron';

/** Every game. Adding a game = one folder exporting a GameDefinition + one line here. */
export const GAMES: GameDefinition[] = [
  singOnTheBeat,
  batBlitz,
  snowballShowdown,
  balloonPop,
  pumpkinPatchMemory,
  presentPairs,
  partyPairs,
  witchsCauldron,
  bellChoir,
  partyBand,
  hauntedHouse,
  adventAmbush,
  surpriseBoxes,
  monsterCharades,
  festiveCharades,
  partyCharades,
  screamMeter,
  hoHoHoller,
  birthdayCheer,
  trickOrTreatDash,
  gingerbreadDash,
  partyDash,
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
