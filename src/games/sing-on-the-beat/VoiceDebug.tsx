import { useLocale } from '../../core/i18n/I18n';
import type { Card } from '../../core/types';
import { accentFor, loadCalibration } from '../../core/voice/calibration';
import { placeWords, saysCard, type HeardWord, type Hearing } from './scoring';

interface VoiceDebugProps {
  hand: readonly Card[];
  heard: readonly HeardWord[];
  hearing: Hearing;
}

/**
 * For tuning the game (open it with `?debug` in the address): every word heard this round,
 * which card was lit when it arrived and how late, which card it was counted for, and whether
 * it matched. Shows whether misses come from timing, mishearing or noise. A tool for tuning,
 * so it stays in English.
 */
export function VoiceDebug({ hand, heard, hearing }: VoiceDebugProps) {
  const locale = useLocale();
  const calibration = loadCalibration();
  const slots = placeWords(hand, heard, hearing);
  return (
    <details className="sotb__debug" open>
      <summary>
        Voice debug · {accentFor(calibration, locale)} · delay {calibration?.delayMs ?? '—'} ms · late-word window{' '}
        {hearing.graceMs} ms · {hearing.relaxed ? 'relaxed' : 'strict'}
      </summary>
      <table>
        <thead>
          <tr>
            <th>Word</th>
            <th>Lit when heard</th>
            <th>Late by</th>
            <th>Counted for</th>
            <th>Match</th>
          </tr>
        </thead>
        <tbody>
          {heard.map((word, i) => {
            const card = hand[slots[i]];
            return (
              <tr key={i}>
                <td>{word.word}</td>
                <td>{word.card < hand.length ? `${word.card + 1}. ${hand[word.card].label}` : 'after the last'}</td>
                <td>{Math.round(word.lateMs)} ms</td>
                <td>{card ? `${slots[i] + 1}. ${card.label}` : '—'}</td>
                <td>{card && saysCard(card, word.word, hearing) ? '✓' : '✗'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </details>
  );
}
