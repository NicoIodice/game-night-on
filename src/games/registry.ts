import type { GameDefinition, Theme } from '../core/types';
import { adventAmbush } from './advent-ambush';
import { balloonPop } from './balloon-pop';
import { batBlitz } from './bat-blitz';
import { beachBeats } from './beach-beats';
import { bellChoir } from './bell-choir';
import { birthdayCheer } from './birthday-cheer';
import { bunnyBurrows } from './bunny-burrows';
import { bunnyHop } from './bunny-hop';
import { cannonball } from './cannonball';
import { cheepCheep } from './cheep-cheep';
import { confettiCannons } from './confetti-cannons';
import { cupidsArrows } from './cupids-arrows';
import { cupidsFlight } from './cupids-flight';
import { eggCatch } from './egg-catch';
import { festiveCharades } from './festive-charades';
import { fireworkFrenzy } from './firework-frenzy';
import { gingerbreadDash } from './gingerbread-dash';
import { happyNewYear } from './happy-new-year';
import { hauntedHouse } from './haunted-house';
import { heartWindows } from './heart-windows';
import { hoHoHoller } from './ho-ho-holler';
import { iLoveYou } from './i-love-you';
import { loveCharades } from './love-charades';
import { loveSong } from './love-song';
import { midnightChimes } from './midnight-chimes';
import { midnightDash } from './midnight-dash';
import { midnightPairs } from './midnight-pairs';
import { monsterCharades } from './monster-charades';
import { paintedPairs } from './painted-pairs';
import { partyBand } from './party-band';
import { partyCharades } from './party-charades';
import { partyDash } from './party-dash';
import { partyPairs } from './party-pairs';
import { presentPairs } from './present-pairs';
import { pumpkinPatchMemory } from './pumpkin-patch-memory';
import { resolutionCharades } from './resolution-charades';
import { sandyCrabs } from './sandy-crabs';
import { screamMeter } from './scream-meter';
import { shellPairs } from './shell-pairs';
import { singOnTheBeat } from './sing-on-the-beat';
import { snowballShowdown } from './snowball-showdown';
import { splashAttack } from './splash-attack';
import { springCharades } from './spring-charades';
import { springChorus } from './spring-chorus';
import { summerCharades } from './summer-charades';
import { surfDash } from './surf-dash';
import { surpriseBoxes } from './surprise-boxes';
import { sweetheartPairs } from './sweetheart-pairs';
import { trickOrTreatDash } from './trick-or-treat-dash';
import { witchsCauldron } from './witchs-cauldron';

/** Every game. Adding a game = one folder exporting a GameDefinition + one line here. */
export const GAMES: GameDefinition[] = [
  singOnTheBeat,
  batBlitz,
  snowballShowdown,
  balloonPop,
  eggCatch,
  splashAttack,
  cupidsArrows,
  fireworkFrenzy,
  pumpkinPatchMemory,
  presentPairs,
  partyPairs,
  paintedPairs,
  shellPairs,
  sweetheartPairs,
  midnightPairs,
  witchsCauldron,
  bellChoir,
  partyBand,
  springChorus,
  beachBeats,
  loveSong,
  midnightChimes,
  hauntedHouse,
  adventAmbush,
  surpriseBoxes,
  bunnyBurrows,
  sandyCrabs,
  heartWindows,
  confettiCannons,
  monsterCharades,
  festiveCharades,
  partyCharades,
  springCharades,
  summerCharades,
  loveCharades,
  resolutionCharades,
  screamMeter,
  hoHoHoller,
  birthdayCheer,
  cheepCheep,
  cannonball,
  iLoveYou,
  happyNewYear,
  trickOrTreatDash,
  gingerbreadDash,
  partyDash,
  bunnyHop,
  surfDash,
  cupidsFlight,
  midnightDash,
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
