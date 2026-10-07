/** Returns a float in [0, 1). Injectable so game logic stays deterministic in tests. */
export type Rng = () => number;

export const defaultRng: Rng = Math.random;

/** Repeatable RNG (mulberry32) — same seed, same sequence. Handy for tests. */
export function createSeededRng(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickRandom<T>(items: readonly T[], rng: Rng = defaultRng): T {
  if (items.length === 0) throw new Error('pickRandom: empty list');
  return items[Math.floor(rng() * items.length)];
}

/** Picks an item with probability proportional to its weight. */
export function pickWeighted<T>(items: readonly T[], weight: (item: T) => number, rng: Rng = defaultRng): T {
  const weights = items.map(weight);
  const total = weights.reduce((sum, w) => sum + w, 0);
  if (total <= 0) return pickRandom(items, rng);

  let roll = rng() * total;
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i];
    if (roll < 0) return items[i];
  }
  return items[items.length - 1];
}

export function shuffle<T>(items: readonly T[], rng: Rng = defaultRng): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
