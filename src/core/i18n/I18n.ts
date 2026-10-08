import { createContext, useContext } from 'react';
import type { Locale, Localized } from './locales';

export interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

/** Filled by <LocaleProvider>. */
export const LocaleContext = createContext<LocaleState | null>(null);

export function useLocaleState(): LocaleState {
  const state = useContext(LocaleContext);
  if (!state) throw new Error('useLocaleState: wrap the app in <LocaleProvider>');
  return state;
}

/** The app's language right now. */
export function useLocale(): Locale {
  return useLocaleState().locale;
}

/** A component's texts in the app's language: `const t = useMessages(MESSAGES)`. */
export function useMessages<T>(messages: Localized<T>): T {
  return messages[useLocale()];
}
