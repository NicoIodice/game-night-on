import type { ComponentType } from 'react';
import type { Music } from './audio/BeatClock';
import type { ThemeSounds } from './audio/themeSounds';
import type { Localized } from './i18n/locales';

export type ThemeId = 'halloween' | 'christmas' | 'birthday' | 'easter' | 'summer' | 'valentine' | 'newyear' | 'carnival' | 'space';

/** A picture card a game can show, e.g. "bat". Themes supply their own decks, one set per language. */
export interface Card {
  /** Unique across every theme and language: learned words are saved by card id. Also counts as saying the card. */
  id: string;
  /** The word to say, in the deck's language. */
  label: string;
  image: string;
  /** Extra words that count as saying this card (plurals are always accepted). */
  sayAs?: string[];
}

/** Everything that makes a festivity look and sound different. Pure data + factories. */
export interface Theme {
  id: ThemeId;
  name: Localized<string>;
  tagline: Localized<string>;
  icon: string;
  /** Browser tab icon while this festivity is chosen. */
  favicon: string;
  /** Disabled themes are listed as "coming soon". */
  enabled: boolean;
  /**
   * Picture cards, in decks from easiest to hardest, for each language. Words within the early
   * decks rhyme (bat, rat, hat… / gato, rato, pato…); later decks mix words of different lengths.
   * Each language picks its own words so they rhyme in that language: translations rarely do.
   */
  decks: Localized<Card[][]>;
  /** Plays on the theme's menus. */
  music?: Music;
  /** Sound effects in the theme's style, for games that don't bring their own. */
  createSounds: () => ThemeSounds;
}

/** Whether the people at the table play one by one or grouped in teams. */
export type RosterKind = 'players' | 'teams';

/** One player or team. The colour tells them apart on screen. */
export interface Player {
  id: string;
  name: string;
  color: string;
}

export interface Roster {
  kind: RosterKind;
  players: Player[];
}

export interface TurnResult {
  score: number;
  /** One line about how the turn went, e.g. "8 of 12 cards right". */
  detail?: string;
}

/** How hard the night is. Each one sets every game's options to its values; changing one by hand makes it custom. */
export type Difficulty = 'easy' | 'normal' | 'hard';

/** A setting a game offers in the game night settings, e.g. "Rounds per level". Whole numbers only. */
export interface GameOption {
  id: string;
  label: Localized<string>;
  min: number;
  max: number;
  /** How much the − and + buttons change the value. Defaults to 1. */
  step?: number;
  /** The value on normal difficulty. */
  default: number;
  /** The value on easy difficulty. Defaults to `default`, for options that don't make a game easier or harder. */
  easy?: number;
  /** The value on hard difficulty. Defaults to `default`. */
  hard?: number;
}

/** Values for a game's options, by option id. Every option has a value. */
export type GameOptionValues = Record<string, number>;

/** A game component plays one turn for one player, then reports the score. */
export interface GameProps {
  theme: Theme;
  player: Player;
  /** Which level this turn plays, from 0. Always 0 for games without levels. */
  level: number;
  options: GameOptionValues;
  onTurnEnd: (result: TurnResult) => void;
  onExit: () => void;
}

/**
 * Contract every game implements. Register new games in `src/games/registry.ts`.
 * Player setup, passing turns and the final standings are handled for every game by `core/match`.
 */
export interface GameDefinition {
  id: string;
  /** Whether the game is offered at all. Switch off to hide a game from every menu (e.g. while it's unfinished). */
  enabled: boolean;
  name: Localized<string>;
  description: Localized<string>;
  kind: 'voice' | 'keyboard' | 'party';
  /** How many players or teams it's for. */
  players: { min: number; max: number };
  /** A screenshot of the game being played, shown on its menu tile. Can differ per theme. */
  thumbnail?: string | Partial<Record<ThemeId, string>>;
  /** 'all' for common games, or the themes a theme-specific game belongs to. */
  themes: ThemeId[] | 'all';
  /** Whether a theme has what the game needs (cards, music…), in every language. */
  supports: (theme: Theme) => boolean;
  /**
   * How many levels the game has (default 1). Each level is one turn per player:
   * everyone plays level 1, then everyone plays level 2, and so on.
   */
  levels?: number;
  /** Settings players can change in the game night settings. */
  options?: GameOption[];
  /** Extra settings of the game's own, shown under its options in the game night settings (e.g. the voice check). */
  Settings?: ComponentType<{ theme: Theme }>;
  Component: ComponentType<GameProps>;
}
