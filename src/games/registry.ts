import type { GameDefinition, Theme } from '../core/types';
import { adventAmbush } from './advent-ambush';
import { balloonPop } from './balloon-pop';
import { batBlitz } from './bat-blitz';
import { bellChoir } from './bell-choir';
import { birthdayCheer } from './birthday-cheer';
import { bunnyBurrows } from './bunny-burrows';
import { bunnyHop } from './bunny-hop';
import { cheepCheep } from './cheep-cheep';
import { eggCatch } from './egg-catch';
import { festiveCharades } from './festive-charades';
import { gingerbreadDash } from './gingerbread-dash';
import { hauntedHouse } from './haunted-house';
import { hoHoHoller } from './ho-ho-holler';
import { monsterCharades } from './monster-charades';
import { paintedPairs } from './painted-pairs';
import { partyBand } from './party-band';
import { partyCharades } from './party-charades';
import { partyDash } from './party-dash';
import { partyPairs } from './party-pairs';
import { presentPairs } from './present-pairs';
import { pumpkinPatchMemory } from './pumpkin-patch-memory';
import { screamMeter } from './scream-meter';
import { singOnTheBeat } from './sing-on-the-beat';
import { snowballShowdown } from './snowball-showdown';
import { springCharades } from './spring-charades';
import { springChorus } from './spring-chorus';
import { surpriseBoxes } from './surprise-boxes';
import { trickOrTreatDash } from './trick-or-treat-dash';
import { witchsCauldron } from './witchs-cauldron';

/** Every game. Adding a game = one folder exporting a GameDefinition + one line here. */
export const GAMES: GameDefinition[] = [
  singOnTheBeat,
  batBlitz,
  snowballShowdown,
  balloonPop,
  eggCatch,
  pumpkinPatchMemory,
  presentPairs,
  partyPairs,
  paintedPairs,
  witchsCauldron,
  bellChoir,
  partyBand,
  springChorus,
  hauntedHouse,
  adventAmbush,
  surpriseBoxes,
  bunnyBurrows,
  monsterCharades,
  festiveCharades,
  partyCharades,
  springCharades,
  screamMeter,
  hoHoHoller,
  birthdayCheer,
  cheepCheep,
  trickOrTreatDash,
  gingerbreadDash,
  partyDash,
  bunnyHop,
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
