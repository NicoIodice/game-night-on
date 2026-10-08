import { useState } from 'react';
import { useLocale, useMessages } from '../../core/i18n/I18n';
import type { Theme } from '../../core/types';
import {
  accentFor,
  ACCENTS,
  clearCalibration,
  defaultCalibration,
  loadCalibration,
  saveCalibration,
  withAccent,
  type Strictness,
  type VoiceCalibration,
} from '../../core/voice/calibration';
import { SpeechListener } from '../../core/voice/SpeechListener';
import { VoiceCheck } from '../../core/voice/VoiceCheck';
import { MESSAGES } from './messages';

/**
 * Sing on the Beat's voice settings in the game night settings: what the voice check learned,
 * quick changes to the accent (of the app's language) and strictness, and buttons to run the
 * check again or forget it.
 */
export function VoiceSettings({ theme }: { theme: Theme }) {
  const locale = useLocale();
  const t = useMessages(MESSAGES);
  const [calibration, setCalibration] = useState<VoiceCalibration | null>(loadCalibration);
  const [checking, setChecking] = useState(false);

  if (!SpeechListener.isSupported()) {
    return <p className="voice-settings__note">{t.cantListen}</p>;
  }

  const save = (next: VoiceCalibration) => {
    saveCalibration(next);
    setCalibration(next);
  };
  const change = (patch: Partial<VoiceCalibration>) => save({ ...(calibration ?? defaultCalibration()), ...patch });

  const learned = calibration ? Object.values(calibration.aliases).reduce((sum, words) => sum + words.length, 0) : 0;

  return (
    <div className="voice-settings">
      {/* Languages with a single accent have nothing to pick. */}
      {ACCENTS[locale].length > 1 && (
        <div className="game-options__row">
          <span>{t.accent}</span>
          <select
            className="voice-settings__select"
            value={accentFor(calibration, locale)}
            onChange={(event) => save(withAccent(calibration ?? defaultCalibration(), locale, event.target.value))}
          >
            {ACCENTS[locale].map((accent) => (
              <option key={accent.id} value={accent.id}>{accent.label}</option>
            ))}
          </select>
        </div>
      )}
      <div className="game-options__row">
        <span>{t.scoring}</span>
        <span className="voice-settings__toggle">
          {(['strict', 'relaxed'] as Strictness[]).map((strictness) => (
            <button
              key={strictness}
              className={`btn btn--small ${(calibration?.strictness ?? 'strict') === strictness ? 'voice-settings__on' : ''}`}
              aria-pressed={(calibration?.strictness ?? 'strict') === strictness}
              onClick={() => change({ strictness })}
            >
              {strictness === 'strict' ? t.strict : t.relaxed}
            </button>
          ))}
        </span>
      </div>
      <p className="voice-settings__note">
        {calibration
          ? [
              t.checkedOn(new Date(calibration.checkedAt).toLocaleDateString(locale)),
              calibration.delayMs !== null ? t.delay(calibration.delayMs) : t.notTimed,
              t.learned(learned),
            ].join(' · ')
          : t.noCheckYet}
      </p>
      <div className="voice-settings__actions">
        <button className="btn btn--small" onClick={() => setChecking(true)}>
          {calibration ? t.runAgain : t.runNow}
        </button>
        {calibration && (
          <button
            className="btn btn--small"
            onClick={() => {
              clearCalibration();
              setCalibration(null);
            }}
          >
            {t.forget}
          </button>
        )}
      </div>
      {checking && (
        <VoiceCheck
          theme={theme}
          mode="full"
          overlay
          onDone={(done) => {
            setCalibration(done);
            setChecking(false);
          }}
          onCancel={() => setChecking(false)}
        />
      )}
    </div>
  );
}
