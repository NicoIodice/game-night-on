import type { GameDefinition, ThemeId } from '../types';

/**
 * How a night is scored: every game on its own, or a tournament where
 * everyone plays every game in order and the scores add up.
 */
export type LineupMode = 'single' | 'tournament';

export interface LineupEntry {
  gameId: string;
  enabled: boolean;
}

/** Which of a theme's games are played, in what order, and how they are scored. */
export interface Lineup {
  mode: LineupMode;
  entries: LineupEntry[];
}

const LINEUP_KEY = 'game-night-on:lineup:';

/** Every game, in the theme menu's order, scored on its own. */
export function defaultLineup(games: readonly GameDefinition[]): Lineup {
  return { mode: 'single', entries: games.map((game) => ({ gameId: game.id, enabled: true })) };
}

/**
 * Makes a saved lineup fit the games that exist now: unknown or repeated games are dropped,
 * new games are added at the end, and at least one game stays enabled.
 */
export function normalizeLineup(saved: unknown, games: readonly GameDefinition[]): Lineup {
  const fallback = defaultLineup(games);
  if (typeof saved !== 'object' || saved === null) return fallback;
  const { mode, entries } = saved as Partial<Lineup>;

  const known = new Set(games.map((game) => game.id));
  const kept: LineupEntry[] = [];
  for (const entry of Array.isArray(entries) ? entries : []) {
    const gameId = entry?.gameId;
    if (typeof gameId === 'string' && known.has(gameId) && !kept.some((k) => k.gameId === gameId)) {
      kept.push({ gameId, enabled: entry.enabled !== false });
    }
  }
  const added = fallback.entries.filter((entry) => !kept.some((k) => k.gameId === entry.gameId));
  const all = [...kept, ...added];
  if (all.length > 0 && !all.some((entry) => entry.enabled)) all[0] = { ...all[0], enabled: true };

  return { mode: mode === 'tournament' ? 'tournament' : 'single', entries: all };
}

export function setLineupMode(lineup: Lineup, mode: LineupMode): Lineup {
  return { ...lineup, mode };
}

/** Moves a game one step up (-1) or down (+1); out-of-range moves change nothing. */
export function moveGame(lineup: Lineup, index: number, step: -1 | 1): Lineup {
  const to = index + step;
  if (index < 0 || to < 0 || index >= lineup.entries.length || to >= lineup.entries.length) return lineup;
  const entries = [...lineup.entries];
  [entries[index], entries[to]] = [entries[to], entries[index]];
  return { ...lineup, entries };
}

/** Switches a game in or out of the night. The last enabled game can't be switched off. */
export function toggleGame(lineup: Lineup, index: number): Lineup {
  const entry = lineup.entries[index];
  if (!entry || (entry.enabled && enabledCount(lineup) === 1)) return lineup;
  return {
    ...lineup,
    entries: lineup.entries.map((e, i) => (i === index ? { ...e, enabled: !e.enabled } : e)),
  };
}

export function enabledCount(lineup: Lineup): number {
  return lineup.entries.filter((entry) => entry.enabled).length;
}

/** The games to play, in order. */
export function playlist(lineup: Lineup, games: readonly GameDefinition[]): GameDefinition[] {
  return lineup.entries
    .filter((entry) => entry.enabled)
    .map((entry) => games.find((game) => game.id === entry.gameId))
    .filter((game): game is GameDefinition => game !== undefined);
}

/** The lineup last set up for a theme, so the night is configured once. */
export function loadLineup(themeId: ThemeId, games: readonly GameDefinition[]): Lineup {
  try {
    return normalizeLineup(JSON.parse(localStorage.getItem(LINEUP_KEY + themeId) ?? 'null'), games);
  } catch {
    // Missing, corrupt or blocked storage: use the menu's order.
    return defaultLineup(games);
  }
}

export function saveLineup(themeId: ThemeId, lineup: Lineup): void {
  try {
    localStorage.setItem(LINEUP_KEY + themeId, JSON.stringify(lineup));
  } catch {
    // Storage can be unavailable (private mode); the lineup just isn't remembered.
  }
}
