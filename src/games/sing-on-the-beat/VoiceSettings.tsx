import { useState } from 'react';
import type { Theme } from '../../core/types';
import {
  clearCalibration,
  defaultCalibration,
  LANGUAGES,
  loadCalibration,
  saveCalibration,
  type Strictness,
  type VoiceCalibration,
} from '../../core/voice/calibration';
import { SpeechListener } from '../../core/voice/SpeechListener';
import { VoiceCheck } from '../../core/voice/VoiceCheck';

/**
 * Sing on the Beat's voice settings in the game night settings: what the voice check learned,
 * quick changes to the accent and strictness, and buttons to run the check again or forget it.
 */
export function VoiceSettings({ theme }: { theme: Theme }) {
  const [calibration, setCalibration] = useState<VoiceCalibration | null>(loadCalibration);
  const [checking, setChecking] = useState(false);

  if (!SpeechListener.isSupported()) {
    return <p className="voice-settings__note">This browser can't listen, so there's no voice check. Use Chrome or Edge.</p>;
  }

  const change = (patch: Partial<VoiceCalibration>) => {
    const next = { ...(calibration ?? defaultCalibration()), ...patch };
    saveCalibration(next);
    setCalibration(next);
  };

  const learned = calibration ? Object.values(calibration.aliases).reduce((sum, words) => sum + words.length, 0) : 0;

  return (
    <div className="voice-settings">
      <div className="game-options__row">
        <span>Accent</span>
        <select
          className="voice-settings__select"
          value={calibration?.lang ?? 'en-US'}
          onChange={(event) => change({ lang: event.target.value })}
        >
          {LANGUAGES.map((language) => (
            <option key={language.id} value={language.id}>{language.label}</option>
          ))}
        </select>
      </div>
      <div className="game-options__row">
        <span>Scoring</span>
        <span className="voice-settings__toggle">
          {(['strict', 'relaxed'] as Strictness[]).map((strictness) => (
            <button
              key={strictness}
              className={`btn btn--small ${(calibration?.strictness ?? 'strict') === strictness ? 'voice-settings__on' : ''}`}
              aria-pressed={(calibration?.strictness ?? 'strict') === strictness}
              onClick={() => change({ strictness })}
            >
              {strictness === 'strict' ? 'Strict' : 'Relaxed'}
            </button>
          ))}
        </span>
      </div>
      <p className="voice-settings__note">
        {calibration
          ? [
              `Voice check done ${new Date(calibration.checkedAt).toLocaleDateString()}`,
              calibration.delayMs !== null ? `words arrive ${(calibration.delayMs / 1000).toFixed(2)}s late` : 'timing not measured',
              `${learned} learned ${learned === 1 ? 'word' : 'words'}`,
            ].join(' · ')
          : 'No voice check yet: it runs before the first game.'}
      </p>
      <div className="voice-settings__actions">
        <button className="btn btn--small" onClick={() => setChecking(true)}>
          {calibration ? 'Run the voice check again' : 'Run the voice check now'}
        </button>
        {calibration && (
          <button
            className="btn btn--small"
            onClick={() => {
              clearCalibration();
              setCalibration(null);
            }}
          >
            Forget it
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
