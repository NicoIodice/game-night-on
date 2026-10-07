import type { ComponentType } from 'react';
import type { BeatTrack } from './audio/BeatClock';

export type ThemeId = 'halloween' | 'christmas';

/** A picture card a game can show, e.g. "bat". Themes supply their own deck. */
export interface Card {
  id: string;
  label: string;
  image: string;
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
  createBeatTrack?: () => BeatTrack;
}

export interface GameProps {
  theme: Theme;
  onExit: () => void;
}

/** Contract every game implements. Register new games in `src/games/registry.ts`. */
export interface GameDefinition {
  id: string;
  name: string;
  description: string;
  kind: 'voice' | 'keyboard' | 'party';
  players: string;
  /** 'all' for common games, or the themes a theme-specific game belongs to. */
  themes: ThemeId[] | 'all';
  /** Whether a theme has what the game needs (cards, music…). */
  supports: (theme: Theme) => boolean;
  Component: ComponentType<GameProps>;
}
