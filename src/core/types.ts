import type { ComponentType } from 'react';
import type { Music } from './audio/BeatClock';

export type ThemeId = 'halloween' | 'christmas';

/** A picture card a game can show, e.g. "bat". Themes supply their own deck. */
export interface Card {
  id: string;
  label: string;
  image: string;
  /** Extra words that count as saying this card (plurals are always accepted). */
  sayAs?: string[];
}

/** Everything that makes a festivity look and sound different. Pure data + factories. */
export interface Theme {
  id: ThemeId;
  name: string;
  tagline: string;
  icon: string;
  /** Browser tab icon while this festivity is chosen. */
  favicon: string;
  /** Disabled themes are listed as "coming soon". */
  enabled: boolean;
  /**
   * Picture cards, in decks from easiest to hardest. Words within the early decks rhyme
   * (bat, rat, hat…); later decks mix words of different lengths.
   */
  decks: Card[][];
  /** Plays on the theme's menus. */
  music?: Music;
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

/** A setting a game offers in the game night settings, e.g. "Rounds per level". Whole numbers only. */
export interface GameOption {
  id: string;
  label: string;
  min: number;
  max: number;
  /** How much the − and + buttons change the value. Defaults to 1. */
  step?: number;
  default: number;
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
  name: string;
  description: string;
  kind: 'voice' | 'keyboard' | 'party';
  players: string;
  /** A screenshot of the game being played, shown on its menu tile. Can differ per theme. */
  thumbnail?: string | Partial<Record<ThemeId, string>>;
  /** 'all' for common games, or the themes a theme-specific game belongs to. */
  themes: ThemeId[] | 'all';
  /** Whether a theme has what the game needs (cards, music…). */
  supports: (theme: Theme) => boolean;
  /**
   * How many levels the game has (default 1). Each level is one turn per player:
   * everyone plays level 1, then everyone plays level 2, and so on.
   */
  levels?: number;
  /** Settings players can change in the game night settings. */
  options?: GameOption[];
  Component: ComponentType<GameProps>;
}
