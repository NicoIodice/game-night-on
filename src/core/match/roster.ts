import type { Player, Roster, RosterKind } from '../types';

export const MIN_PLAYERS = 1;
export const MAX_PLAYERS = 8;
export const MAX_NAME_LENGTH = 16;

/** One colour per seat, picked to stay distinct from each other on the dark themes. */
export const PLAYER_COLORS = ['#4cc9f0', '#ff5fa2', '#ffd166', '#8cff5a', '#b388ff', '#ff8c42', '#f1eef8', '#ff4d4d'];

const ROSTER_KEY = 'game-night-on:roster';

export function defaultName(kind: RosterKind, seat: number): string {
  return `${kind === 'teams' ? 'Team' : 'Player'} ${seat + 1}`;
}

function isDefaultName(name: string, seat: number): boolean {
  return name === defaultName('players', seat) || name === defaultName('teams', seat);
}

function seatPlayer(kind: RosterKind, seat: number, name?: string): Player {
  return { id: `p${seat + 1}`, name: name ?? defaultName(kind, seat), color: PLAYER_COLORS[seat] };
}

export function createRoster(kind: RosterKind = 'players', count = 2): Roster {
  return { kind, players: Array.from({ length: count }, (_, seat) => seatPlayer(kind, seat)) };
}

/** Adds or removes seats at the end, keeping the names already typed. */
export function resizeRoster(roster: Roster, count: number): Roster {
  const size = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, count));
  return {
    ...roster,
    players: Array.from({ length: size }, (_, seat) => roster.players[seat] ?? seatPlayer(roster.kind, seat)),
  };
}

/** Switches between players and teams; untouched "Player 2" names become "Team 2" and back. */
export function setRosterKind(roster: Roster, kind: RosterKind): Roster {
  return {
    kind,
    players: roster.players.map((player, seat) =>
      isDefaultName(player.name, seat) ? { ...player, name: defaultName(kind, seat) } : player,
    ),
  };
}

export function renamePlayer(roster: Roster, seat: number, name: string): Roster {
  return {
    ...roster,
    players: roster.players.map((player, i) => (i === seat ? { ...player, name: name.slice(0, MAX_NAME_LENGTH) } : player)),
  };
}

/** Trims names and fills blank ones with the default, ready to play. */
export function finalizeRoster(roster: Roster): Roster {
  return {
    ...roster,
    players: roster.players.map((player, seat) => ({
      ...player,
      name: player.name.trim() || defaultName(roster.kind, seat),
    })),
  };
}

/** The last roster used, so the same people don't retype their names for every game. */
export function loadRoster(): Roster {
  try {
    const saved = JSON.parse(localStorage.getItem(ROSTER_KEY) ?? 'null') as Roster | null;
    const kind = saved?.kind;
    if ((kind === 'players' || kind === 'teams') && Array.isArray(saved?.players) && saved.players.length >= MIN_PLAYERS) {
      const players = saved.players.slice(0, MAX_PLAYERS).map((player, seat) => {
        const name = typeof player?.name === 'string' ? player.name.slice(0, MAX_NAME_LENGTH) : undefined;
        return seatPlayer(kind, seat, name);
      });
      return { kind, players };
    }
  } catch {
    // Missing, corrupt or blocked storage: start fresh.
  }
  return createRoster();
}

export function saveRoster(roster: Roster): void {
  try {
    localStorage.setItem(ROSTER_KEY, JSON.stringify(roster));
  } catch {
    // Storage can be unavailable (private mode); the roster just isn't remembered.
  }
}
