/**
 * The languages the app speaks. Every user-visible text is a `Localized<…>` value with one entry per
 * language, so adding a language here makes the type checker list every text still to translate.
 */
export const LOCALES = [
  { id: 'en-US', label: 'English (US)', short: 'EN' },
  { id: 'pt-PT', label: 'Português (Portugal)', short: 'PT' },
] as const;

export type Locale = (typeof LOCALES)[number]['id'];

/** Used when the browser asks for none of our languages. */
export const DEFAULT_LOCALE: Locale = 'en-US';

/** One value per language, e.g. a game's name. */
export type Localized<T> = Record<Locale, T>;

const STORAGE_KEY = 'game-night-on:locale';

export function isLocale(value: unknown): value is Locale {
  return LOCALES.some((locale) => locale.id === value);
}

/**
 * The first of the browser's languages we speak, by language and region: 'pt-PT' and plain 'pt'
 * give European Portuguese, but 'pt-BR' doesn't (Brazilian Portuguese isn't offered). Any English
 * gives English (US), the only English there is. Nothing we speak: English (US).
 */
export function detectLocale(preferred: readonly string[]): Locale {
  for (const tag of preferred) {
    const [language, region] = tag.toLowerCase().split(/[-_]/);
    const exact = LOCALES.find((locale) => locale.id.toLowerCase() === `${language}-${region}`);
    if (exact) return exact.id;
    if (language === 'pt' && !region) return 'pt-PT';
    if (language === 'en') return 'en-US';
  }
  return DEFAULT_LOCALE;
}

/** The language picked on this device, or the browser's. */
export function loadLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {
    // Storage blocked: go by the browser.
  }
  return detectLocale(typeof navigator === 'undefined' ? [] : (navigator.languages ?? [navigator.language]));
}

export function saveLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Storage can be unavailable (private mode); the browser's language is used next time.
  }
}

/** Picks the singular or plural by the language's rules: plural(locale, 3, 'bat', 'bats'). */
export function plural(locale: Locale, count: number, one: string, many: string): string {
  return new Intl.PluralRules(locale).select(count) === 'one' ? one : many;
}

/** A number written the language's way, e.g. 0.42 -> "0,42" in Portuguese. */
export function formatNumber(locale: Locale, value: number, digits = 0): string {
  return value.toLocaleString(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
