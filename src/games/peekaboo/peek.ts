import { pickWeighted, type Rng } from '../../core/random';

/**
 * State of a pop-up game (Haunted House, Advent Ambush), kept pure so it can be tested.
 * Characters peek out of holes (windows, doors) for a moment: tap the rascals, leave the friend alone.
 */

/** 'rascal': tap it. 'boss': a rarer, quicker rascal worth more. 'friend': don't tap it! */
export type PeekKind = 'rascal' | 'boss' | 'friend';

interface PeekSpec {
  /** Points for tapping it; negative for the friend. */
  points: number;
  weight: number;
  /** Seconds it stays out, at the start of the turn and at the end (it gets quicker). */
  stay: [number, number];
}

export const PEEK_KINDS: Record<PeekKind, PeekSpec> = {
  rascal: { points: 10, weight: 70, stay: [1.4, 0.8] },
  boss: { points: 30, weight: 12, stay: [0.9, 0.6] },
  friend: { points: -20, weight: 18, stay: [1.5, 1.1] },
};

export const HOLES = 12;
export const TURN_SECONDS = 30;
/** Taps in a row on rascals (no friends, no empty holes) needed to raise the multiplier by one. */
export const STREAK_STEP = 5;
export const MAX_MULTIPLIER = 3;
/** How long a tapped character stays on screen, dazed, before it disappears. */
export const BONK_SECONDS = 0.35;

export interface Peeker {
  id: number;
  hole: number;
  kind: PeekKind;
  /** When it popped out, in seconds since the turn began. */
  shownAt: number;
  /** When it ducks back in, unless tapped first. */
  leavesAt: number;
  /** When it was tapped, if it was. */
  tappedAt: number | null;
  /** Points it gave (or took) when tapped. */
  points: number;
}

export interface Peek {
  time: number;
  peekers: Peeker[];
  nextId: number;
  nextSpawn: number;
  score: number;
  /** Rascals and bosses tapped. */
  caught: number;
  /** Rascals and bosses that got away. */
  escaped: number;
  /** Friends tapped by mistake. */
  oops: number;
  streak: number;
  bestStreak: number;
}

export type TapOutcome = 'caught' | 'boss' | 'friend' | 'empty';

export function createPeek(): Peek {
  return { time: 0, peekers: [], nextId: 1, nextSpawn: 0.5, score: 0, caught: 0, escaped: 0, oops: 0, streak: 0, bestStreak: 0 };
}

export function isOver(peek: Peek): boolean {
  return peek.time >= TURN_SECONDS;
}

export function timeLeft(peek: Peek): number {
  return Math.max(0, TURN_SECONDS - peek.time);
}

export function multiplier(streak: number): number {
  return Math.min(MAX_MULTIPLIER, 1 + Math.floor(streak / STREAK_STEP));
}

function progress(time: number): number {
  return Math.min(1, time / TURN_SECONDS);
}

/** Characters pop out more often as the turn goes on: from about every 0.8s to every 0.35s. */
export function spawnInterval(time: number): number {
  return 0.8 - (0.8 - 0.35) * progress(time);
}

export function stayFor(kind: PeekKind, time: number): number {
  const [start, end] = PEEK_KINDS[kind].stay;
  return start - (start - end) * progress(time);
}

/** Holes nobody is peeking out of. */
export function freeHoles(peek: Peek, holes = HOLES): number[] {
  const taken = new Set(peek.peekers.map((p) => p.hole));
  return Array.from({ length: holes }, (_, hole) => hole).filter((hole) => !taken.has(hole));
}

/** Moves the turn forward by `dt` seconds: characters duck back in and new ones pop out. */
export function stepPeek(peek: Peek, dt: number, rng: Rng, holes = HOLES): Peek {
  const time = Math.min(TURN_SECONDS, peek.time + dt);
  let { escaped, streak } = peek;
  const peekers = peek.peekers.filter((p) => {
    if (p.tappedAt !== null) return time - p.tappedAt < BONK_SECONDS;
    if (time < p.leavesAt) return true;
    if (p.kind !== 'friend') {
      escaped++;
      streak = 0;
    }
    return false;
  });

  let { nextId, nextSpawn } = peek;
  const kinds = Object.keys(PEEK_KINDS) as PeekKind[];
  while (nextSpawn <= time) {
    const free = freeHoles({ ...peek, peekers }, holes);
    if (free.length > 0) {
      const kind = pickWeighted(kinds, (k) => PEEK_KINDS[k].weight, rng);
      const hole = free[Math.floor(rng() * free.length)];
      peekers.push({ id: nextId++, hole, kind, shownAt: nextSpawn, leavesAt: nextSpawn + stayFor(kind, nextSpawn), tappedAt: null, points: 0 });
    }
    nextSpawn += spawnInterval(nextSpawn);
  }

  return { ...peek, time, peekers, nextId, nextSpawn, escaped, streak };
}

/** Taps a hole: catches whoever is peeking out of it (or tells the friend off for you). */
export function tap(peek: Peek, hole: number): { peek: Peek; outcome: TapOutcome; points: number } {
  const target = peek.peekers.find((p) => p.hole === hole && p.tappedAt === null);
  if (!target) return { peek: { ...peek, streak: 0 }, outcome: 'empty', points: 0 };

  if (target.kind === 'friend') {
    const points = Math.max(PEEK_KINDS.friend.points, -peek.score);
    return {
      peek: {
        ...peek,
        score: peek.score + points,
        oops: peek.oops + 1,
        streak: 0,
        peekers: peek.peekers.map((p) => (p === target ? { ...p, tappedAt: peek.time, points } : p)),
      },
      outcome: 'friend',
      points,
    };
  }

  const points = PEEK_KINDS[target.kind].points * multiplier(peek.streak);
  const streak = peek.streak + 1;
  return {
    peek: {
      ...peek,
      score: peek.score + points,
      caught: peek.caught + 1,
      streak,
      bestStreak: Math.max(peek.bestStreak, streak),
      peekers: peek.peekers.map((p) => (p === target ? { ...p, tappedAt: peek.time, points } : p)),
    },
    outcome: target.kind === 'boss' ? 'boss' : 'caught',
    points,
  };
}
