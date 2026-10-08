import { useEffect, useState, type ReactNode } from 'react';
import { LocaleContext } from './I18n';
import { loadLocale, saveLocale, type Locale } from './locales';

/** Holds the app's language: the one picked on this device, else the browser's. */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(loadLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (next: Locale) => {
    saveLocale(next);
    setLocaleState(next);
  };

  return <LocaleContext value={{ locale, setLocale }}>{children}</LocaleContext>;
}
