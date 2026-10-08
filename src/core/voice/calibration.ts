import { isLocale, type Locale, type Localized } from '../i18n/locales';
import type { ThemeId } from '../types';

/**
 * What the voice check learned about this device, so speech games hear players better:
 * the recognition accent for each language, how late recognised words arrive, how strict to be,
 * and extra words to accept for some cards. Saved in the browser (`localStorage`); deleting it,
 * or the "Run the voice check again" button, makes the check run again.
 */

/** 'strict': exact words only. 'relaxed': near misses count too, and late words get more time. */
export type Strictness = 'strict' | 'relaxed';

export interface VoiceCalibration {
  /** Speech recognition accent picked for each app language, e.g. { 'en-US': 'en-GB' }. */
  accents: Partial<Record<Locale, string>>;
  /** How long after a word is said the browser reports it, in milliseconds; null if not measured. */
  delayMs: number | null;
  strictness: Strictness;
  /** Extra words accepted per card id, learned in the word test. Card ids are unique across languages. */
  aliases: Record<string, string[]>;
  /** Decks whose cards have been through the word test, as `theme:language`, e.g. 'halloween:pt-PT'. */
  testedDecks: string[];
  /** When the check last ran (ISO date). */
  checkedAt: string;
}

export const STORAGE_KEY = 'game-night-on:voice-check';

/** Accents the browser's speech recognition knows, for each app language (the cards' language). The first is the default. */
export const ACCENTS: Localized<{ id: string; label: string }[]> = {
  'en-US': [
    { id: 'en-US', label: 'English (US)' },
    { id: 'en-GB', label: 'English (UK)' },
    { id: 'en-IE', label: 'English (Ireland)' },
    { id: 'en-AU', label: 'English (Australia)' },
    { id: 'en-CA', label: 'English (Canada)' },
    { id: 'en-IN', label: 'English (India)' },
    { id: 'en-ZA', label: 'English (South Africa)' },
  ],
  'pt-PT': [{ id: 'pt-PT', label: 'Português (Portugal)' }],
};

/** The speech recognition accent to listen with in a language: the one picked, else the language's default. */
export function accentFor(calibration: VoiceCalibration | null, locale: Locale): string {
  const picked = calibration?.accents[locale];
  return ACCENTS[locale].find((accent) => accent.id === picked)?.id ?? ACCENTS[locale][0].id;
}

export function withAccent(calibration: VoiceCalibration, locale: Locale, accent: string): VoiceCalibration {
  return { ...calibration, accents: { ...calibration.accents, [locale]: accent } };
}

export function defaultCalibration(): VoiceCalibration {
  return { accents: {}, delayMs: null, strictness: 'strict', aliases: {}, testedDecks: [], checkedAt: new Date().toISOString() };
}

const deckKey = (themeId: ThemeId, locale: Locale) => `${themeId}:${locale}`;

/** What older versions saved, when the app only spoke English: one accent and the themes tested. */
interface EnglishOnlyCalibration {
  lang?: unknown;
  testedThemes?: unknown;
}

/**
 * Makes saved data safe to use: unknown or broken fields fall back to the defaults. Data saved
 * before the app spoke other languages (`lang`, `testedThemes`) is read as English.
 */
export function normalizeCalibration(saved: unknown): VoiceCalibration | null {
  if (typeof saved !== 'object' || saved === null) return null;
  const { accents, delayMs, strictness, aliases, testedDecks, checkedAt, lang, testedThemes } = saved as Partial<VoiceCalibration> &
    EnglishOnlyCalibration;
  const fallback = defaultCalibration();
  const cleanAliases: Record<string, string[]> = {};
  if (typeof aliases === 'object' && aliases !== null) {
    for (const [cardId, words] of Object.entries(aliases)) {
      if (Array.isArray(words)) cleanAliases[cardId] = words.filter((w): w is string => typeof w === 'string' && w.length > 0);
    }
  }
  const cleanAccents: VoiceCalibration['accents'] = {};
  const savedAccents: Record<string, unknown> = typeof accents === 'object' && accents !== null ? accents : { 'en-US': lang };
  for (const [locale, accent] of Object.entries(savedAccents)) {
    if (isLocale(locale) && ACCENTS[locale].some((a) => a.id === accent)) cleanAccents[locale] = accent as string;
  }
  const decks: unknown[] = Array.isArray(testedDecks)
    ? testedDecks
    : Array.isArray(testedThemes)
      ? testedThemes.map((theme) => (typeof theme === 'string' ? deckKey(theme as ThemeId, 'en-US') : null))
      : [];
  return {
    accents: cleanAccents,
    delayMs: typeof delayMs === 'number' && Number.isFinite(delayMs) && delayMs >= 0 && delayMs < 5000 ? Math.round(delayMs) : null,
    strictness: strictness === 'relaxed' ? 'relaxed' : 'strict',
    aliases: cleanAliases,
    testedDecks: decks.filter((deck): deck is string => typeof deck === 'string'),
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

/**
 * The whole check runs once per device; after that, only new decks need their words tested:
 * a new theme, or a theme in another language (its cards are other words).
 */
export function needsVoiceCheck(calibration: VoiceCalibration | null, themeId: ThemeId, locale: Locale): 'full' | 'words' | null {
  if (!calibration) return 'full';
  return calibration.testedDecks.includes(deckKey(themeId, locale)) ? null : 'words';
}

export function withAlias(calibration: VoiceCalibration, cardId: string, word: string): VoiceCalibration {
  const words = calibration.aliases[cardId] ?? [];
  if (words.includes(word)) return calibration;
  return { ...calibration, aliases: { ...calibration.aliases, [cardId]: [...words, word] } };
}

export function withDeckTested(calibration: VoiceCalibration, themeId: ThemeId, locale: Locale): VoiceCalibration {
  const key = deckKey(themeId, locale);
  if (calibration.testedDecks.includes(key)) return calibration;
  return { ...calibration, testedDecks: [...calibration.testedDecks, key] };
}

/** The check is done for this theme in this language: marks its words as tested and stamps the time. */
export function completeCheck(calibration: VoiceCalibration, themeId: ThemeId, locale: Locale): VoiceCalibration {
  return { ...withDeckTested(calibration, themeId, locale), checkedAt: new Date().toISOString() };
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
