import { useLocaleState, useMessages } from '../i18n/I18n';
import { isLocale, LOCALES } from '../i18n/locales';
import { Icon } from './Icon';
import globe from './icons/globe.svg';
import { MESSAGES } from './messages';
import './LanguagePicker.css';

/**
 * The app's language, next to the sound button. Shows the short code ("EN", "PT"); the list
 * that opens names each language in its own words.
 */
export function LanguagePicker() {
  const { locale, setLocale } = useLocaleState();
  const t = useMessages(MESSAGES);
  const current = LOCALES.find((l) => l.id === locale);

  return (
    <label className="language-picker">
      <Icon src={globe} />
      <span aria-hidden>{current?.short}</span>
      <select
        className="language-picker__select"
        value={locale}
        aria-label={t.language}
        onChange={(event) => {
          if (isLocale(event.target.value)) setLocale(event.target.value);
        }}
      >
        {LOCALES.map((l) => (
          <option key={l.id} value={l.id} lang={l.id}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
