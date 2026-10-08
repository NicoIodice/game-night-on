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
  /** Disabled themes are listed as "coming soon". */
  enabled: boolean;
  cards: Card[];
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

/** A game component plays one turn for one player, then reports the score. */
export interface GameProps {
  theme: Theme;
  player: Player;
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
  /** A screenshot of the game being played, shown on its menu tile. */
  thumbnail?: string;
  /** 'all' for common games, or the themes a theme-specific game belongs to. */
  themes: ThemeId[] | 'all';
  /** Whether a theme has what the game needs (cards, music…). */
  supports: (theme: Theme) => boolean;
  Component: ComponentType<GameProps>;
}
