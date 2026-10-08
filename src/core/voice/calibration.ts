import type { ThemeId } from '../types';

/**
 * What the voice check learned about this device, so speech games hear players better:
 * the recognition language, how late recognised words arrive, how strict to be, and extra
 * words to accept for some cards. Saved in the browser (`localStorage`); deleting it, or
 * the "Run the voice check again" button, makes the check run again.
 */

/** 'strict': exact words only. 'relaxed': near misses count too, and late words get more time. */
export type Strictness = 'strict' | 'relaxed';

export interface VoiceCalibration {
  /** Speech recognition language, e.g. 'en-GB'. */
  lang: string;
  /** How long after a word is said the browser reports it, in milliseconds; null if not measured. */
  delayMs: number | null;
  strictness: Strictness;
  /** Extra words accepted per card id, learned in the word test. */
  aliases: Record<string, string[]>;
  /** Themes whose cards have been through the word test. */
  testedThemes: ThemeId[];
  /** When the check last ran (ISO date). */
  checkedAt: string;
}

export const STORAGE_KEY = 'game-night-on:voice-check';

/** Accents the browser's speech recognition knows. The card words are English. */
export const LANGUAGES: { id: string; label: string }[] = [
  { id: 'en-US', label: 'English (US)' },
  { id: 'en-GB', label: 'English (UK)' },
  { id: 'en-IE', label: 'English (Ireland)' },
  { id: 'en-AU', label: 'English (Australia)' },
  { id: 'en-CA', label: 'English (Canada)' },
  { id: 'en-IN', label: 'English (India)' },
  { id: 'en-ZA', label: 'English (South Africa)' },
];

export function defaultCalibration(): VoiceCalibration {
  return { lang: 'en-US', delayMs: null, strictness: 'strict', aliases: {}, testedThemes: [], checkedAt: new Date().toISOString() };
}

/** Makes saved data safe to use: unknown or broken fields fall back to the defaults. */
export function normalizeCalibration(saved: unknown): VoiceCalibration | null {
  if (typeof saved !== 'object' || saved === null) return null;
  const { lang, delayMs, strictness, aliases, testedThemes, checkedAt } = saved as Partial<VoiceCalibration>;
  const fallback = defaultCalibration();
  const cleanAliases: Record<string, string[]> = {};
  if (typeof aliases === 'object' && aliases !== null) {
    for (const [cardId, words] of Object.entries(aliases)) {
      if (Array.isArray(words)) cleanAliases[cardId] = words.filter((w): w is string => typeof w === 'string' && w.length > 0);
    }
  }
  return {
    lang: LANGUAGES.some((l) => l.id === lang) ? lang! : fallback.lang,
    delayMs: typeof delayMs === 'number' && Number.isFinite(delayMs) && delayMs >= 0 && delayMs < 5000 ? Math.round(delayMs) : null,
    strictness: strictness === 'relaxed' ? 'relaxed' : 'strict',
    aliases: cleanAliases,
    testedThemes: Array.isArray(testedThemes) ? testedThemes.filter((t): t is ThemeId => typeof t === 'string') : [],
    checkedAt: typeof checkedAt === 'string' ? checkedAt : fallback.checkedAt,
  };
}

export function loadCalibration(): VoiceCalibration | null {
  try {
    return normalizeCalibration(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null'));
  } catch {
    return null;
  }
}

export function saveCalibration(calibration: VoiceCalibration): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(calibration));
  } catch {
    // Storage can be unavailable (private mode); the check just runs again next time.
  }
}

export function clearCalibration(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing saved to forget.
  }
}

/** The whole check runs once per device; after that, only new themes need their words tested. */
export function needsVoiceCheck(calibration: VoiceCalibration | null, themeId: ThemeId): 'full' | 'words' | null {
  if (!calibration) return 'full';
  return calibration.testedThemes.includes(themeId) ? null : 'words';
}

export function withAlias(calibration: VoiceCalibration, cardId: string, word: string): VoiceCalibration {
  const words = calibration.aliases[cardId] ?? [];
  if (words.includes(word)) return calibration;
  return { ...calibration, aliases: { ...calibration.aliases, [cardId]: [...words, word] } };
}

export function withThemeTested(calibration: VoiceCalibration, themeId: ThemeId): VoiceCalibration {
  if (calibration.testedThemes.includes(themeId)) return calibration;
  return { ...calibration, testedThemes: [...calibration.testedThemes, themeId] };
}

/** The check is done for this theme: marks its words as tested and stamps the time. */
export function completeCheck(calibration: VoiceCalibration, themeId: ThemeId): VoiceCalibration {
  return { ...withThemeTested(calibration, themeId), checkedAt: new Date().toISOString() };
}

/** The delay the game's fixed timing was tuned for, used when the device hasn't been measured. */
export const TYPICAL_DELAY_MS = 400;
/** How long after the next card lights up a word still counts for the previous one, at the typical delay. */
export const BASE_GRACE_MS = 350;
const RELAXED_EXTRA_MS = 200;
const MIN_GRACE_MS = 150;

/**
 * How long a late word still counts for the card before, for this device: devices that hear
 * words later get longer, relaxed scoring gets longer still. Always shorter than a beat.
 */
export function lateWordGraceMs(calibration: VoiceCalibration | null, beatMs: number): number {
  const delay = calibration?.delayMs ?? TYPICAL_DELAY_MS;
  const extra = calibration?.strictness === 'relaxed' ? RELAXED_EXTRA_MS : 0;
  const grace = BASE_GRACE_MS + (delay - TYPICAL_DELAY_MS) + extra;
  return Math.round(Math.min(beatMs - 50, Math.max(MIN_GRACE_MS, grace)));
}

/** Fewest beats with a word heard before a delay measurement is trusted. */
export const MIN_SAMPLES = 3;

/**
 * Measures how late words arrive: for each beat the player spoke on, the time from the beat
 * to the first word heard after it (within a beat). Returns the median, or null when too few
 * beats had a word. Times are in milliseconds on the same clock.
 */
export function measureDelay(beatTimes: readonly number[], arrivals: readonly number[], beatMs: number): number | null {
  const sorted = [...arrivals].sort((a, b) => a - b);
  const delays: number[] = [];
  for (const beat of beatTimes) {
    const first = sorted.find((time) => time >= beat && time < beat + beatMs);
    if (first !== undefined) delays.push(first - beat);
  }
  if (delays.length < MIN_SAMPLES) return null;
  delays.sort((a, b) => a - b);
  const middle = Math.floor(delays.length / 2);
  const median = delays.length % 2 ? delays[middle] : (delays[middle - 1] + delays[middle]) / 2;
  return Math.round(median);
}
