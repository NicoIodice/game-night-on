import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { unlockAudio } from '../../core/audio/sound';
import { useBeatClock } from '../../core/audio/useBeatClock';
import { useLocale, useMessages } from '../../core/i18n/I18n';
import { PlayerBadge } from '../../core/match/PlayerBadge';
import type { Card, GameProps } from '../../core/types';
import { Icon } from '../../core/ui/Icon';
import microphone from '../../core/ui/icons/microphone.svg';
import { accentFor, ACCENTS, lateWordGraceMs, loadCalibration, needsVoiceCheck } from '../../core/voice/calibration';
import { SpeechListener, type ListenResult } from '../../core/voice/SpeechListener';
import { VoiceCheck } from '../../core/voice/VoiceCheck';
import { createCueTrack } from './cueTrack';
import { dealRounds } from './deal';
import { DEFAULT_ROUNDS, DEFAULT_TEMPO, LEVELS } from './levels';
import { MESSAGES as KIT_MESSAGES } from '../kit/messages';
import { MESSAGES, type Messages } from './messages';
import { singOnTheBeatName } from './name';
import { VoiceDebug } from './VoiceDebug';
import {
  judgeHand,
  scoreRounds,
  totalScore,
  type CardResult,
  type HeardWord,
  type Hearing,
  type Mark,
  type RoundScore,
} from './scoring';
import { stepAt, type Plan, type Step } from './timeline';
import './SingOnTheBeat.css';

type CardState = 'hidden' | 'shown' | 'active' | 'sung';

/** When a word arrived: the card lit at the time, and how long after it lit up. */
type Stamp = Omit<HeardWord, 'word'>;

const marksOf = (rounds: readonly CardResult[][]): Mark[][] => rounds.map((round) => round.map((card) => card.mark));

/** Add `?debug` to the address to see every word heard, with its timing, while playing. */
const DEBUG = typeof location !== 'undefined' && new URLSearchParams(location.search).has('debug');

function cardState(step: Step, index: number): CardState {
  switch (step.phase) {
    case 'countdown':
    case 'done':
      return 'hidden';
    case 'sing':
      if (index === step.active) return 'active';
      return index < step.active ? 'sung' : 'shown';
    case 'result':
      return 'shown';
  }
}

function caption(t: Messages, step: Step, roundScore: RoundScore | undefined, scored: boolean): string {
  switch (step.phase) {
    case 'countdown':
      return step.count === null ? t.getReady : String(step.count);
    case 'sing':
      return t.sayIt;
    case 'result':
      if (!scored) return t.nice;
      if (!roundScore) return t.listening;
      if (roundScore.streak > 1) return t.perfectStreak(roundScore.streak, roundScore.points);
      if (roundScore.streak === 1) return t.perfect(roundScore.points);
      return roundScore.points === 0 ? t.noPoints : t.plusPoints(roundScore.points);
    case 'done':
      return '';
  }
}

export function SingOnTheBeat({ theme, player, level: levelIndex, options, onTurnEnd, onExit }: GameProps) {
  const locale = useLocale();
  const t = useMessages(MESSAGES);
  const kit = useMessages(KIT_MESSAGES);
  const level = LEVELS[levelIndex];
  // The cards are words in the app's language, and the game listens in that language too.
  const deck = theme.decks[locale][level.deck];
  const rounds = options.rounds ?? DEFAULT_ROUNDS;
  const bpm = (options.tempo ?? DEFAULT_TEMPO) + level.faster;
  const plan: Plan = useMemo(() => ({ rounds, cardCount: level.cardCount }), [rounds, level.cardCount]);
  const createTrack = useMemo(() => () => createCueTrack(plan), [plan]);
  const clock = useBeatClock(createTrack);
  const listenerRef = useRef<SpeechListener | null>(null);
  /** Index into the listener's words where the current round's answers start; null when not listening. */
  const answersFromRef = useRef<number | null>(null);
  /** The card lit right now (the hand's length once singing is over) and when it lit up. */
  const litRef = useRef({ card: 0, since: 0 });
  /** When each of the round's words first arrived, by position in the round's words. */
  const stampsRef = useRef<Stamp[]>([]);
  const graceTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /** The voice check to run before playing: all of it the first time, or just a new theme's words. */
  const [checking, setChecking] = useState(() =>
    SpeechListener.isSupported() ? needsVoiceCheck(loadCalibration(), theme.id, locale) : null,
  );
  /** How this device hears players, from the voice check; set when the turn starts. */
  const [hearing, setHearing] = useState<Hearing>({});
  const [starting, setStarting] = useState(false);
  const [voice, setVoice] = useState<ListenResult | null>(null);
  const [hands, setHands] = useState<Card[][]>([]);
  const [beat, setBeat] = useState(0);
  const [step, setStep] = useState<Step | null>(null);
  const [heard, setHeard] = useState<HeardWord[]>([]);
  const [results, setResults] = useState<CardResult[][]>([]);
  /** Whether the card before the lit one can no longer get a late word (see LATE_WORD_GRACE_MS). */
  const [graceOver, setGraceOver] = useState(false);

  useEffect(
    () => () => {
      listenerRef.current?.stop();
      clearTimeout(graceTimerRef.current);
    },
    [],
  );

  const scored = voice === 'listening';
  const roundScores = scoreRounds(marksOf(results));
  const score = roundScores.reduce((sum, round) => sum + round.points, 0);

  const play = async () => {
    void unlockAudio();
    const calibration = loadCalibration();
    const turnHearing: Hearing = {
      aliases: calibration?.aliases,
      relaxed: calibration?.strictness === 'relaxed',
      deck,
      graceMs: lateWordGraceMs(calibration, 60000 / bpm),
    };
    setHearing(turnHearing);
    const cardsById = new Map(deck.map((card) => [card.id, card]));
    const dealt = dealRounds(deck.map((card) => card.id), level, rounds).map((hand) =>
      hand.map((id) => cardsById.get(id)!),
    );
    setHands(dealt);
    setResults([]);
    setHeard([]);
    setStep(null);
    setStarting(true);

    listenerRef.current?.stop();
    const listener = new SpeechListener(accentFor(calibration, locale));
    listenerRef.current = listener;
    /** The round's words so far, each with the time it first arrived, even if the recogniser rewrites it later. */
    const stampedAnswers = (from: number): HeardWord[] => {
      const words = listener.words.slice(from);
      const stamps = stampsRef.current;
      const { card, since } = litRef.current;
      stamps.length = Math.min(stamps.length, words.length);
      while (stamps.length < words.length) stamps.push({ card, lateMs: performance.now() - since });
      return words.map((word, i) => ({ word, ...stamps[i] }));
    };
    listener.onWords = () => {
      if (answersFromRef.current !== null) setHeard(stampedAnswers(answersFromRef.current));
    };
    const voiceResult = await listener.start();
    const allResults: CardResult[][] = [];
    if (listenerRef.current !== listener) return; // quit while asking for the microphone
    setVoice(voiceResult);
    setStarting(false);
    setBeat(0);
    setStep(stepAt(0, plan));

    void clock.start(bpm, (nextBeat) => {
      const next = stepAt(nextBeat, plan);
      // Anything said during the countdown is thrown away, even words still being recognised.
      if (next.phase === 'countdown' && next.count === 1) listener.reset();
      if (next.phase === 'sing' && next.active === 0) {
        answersFromRef.current = listener.words.length;
        stampsRef.current = [];
        setHeard([]);
      }
      if (next.phase === 'sing' || (next.phase === 'result' && !next.final)) {
        const lit = next.phase === 'sing' ? next.active : level.cardCount;
        if (lit !== litRef.current.card || next.phase === 'sing') {
          litRef.current = { card: lit, since: performance.now() };
          setGraceOver(false);
          clearTimeout(graceTimerRef.current);
          graceTimerRef.current = setTimeout(() => setGraceOver(true), turnHearing.graceMs);
        }
      }
      if (next.phase === 'result' && next.final && answersFromRef.current !== null) {
        const answers = stampedAnswers(answersFromRef.current);
        answersFromRef.current = null;
        setHeard(answers);
        allResults.push(judgeHand(dealt[next.round], answers, level.cardCount, turnHearing));
        setResults([...allResults]);
      }
      if (next.phase === 'done') {
        clock.stop();
        listener.stop();
        const marks = marksOf(allResults);
        const cardsRight = marks.flat().filter((mark) => mark === 'correct').length;
        onTurnEnd(
          voiceResult === 'listening'
            ? { score: totalScore(marks), detail: t.detail(level.number, cardsRight, rounds * level.cardCount) }
            : { score: 0, detail: t.voiceOff[voiceResult] },
        );
      }
      setBeat(nextBeat);
      setStep(next);
    });
  };

  const exit = () => {
    clock.stop();
    clearTimeout(graceTimerRef.current);
    listenerRef.current?.stop();
    listenerRef.current = null;
    onExit();
  };

  if (checking) {
    return (
      <VoiceCheck
        theme={theme}
        mode={checking}
        onDone={() => setChecking(null)}
        onCancel={needsVoiceCheck(loadCalibration(), theme.id, locale) ? undefined : () => setChecking(null)}
      />
    );
  }

  if (starting) {
    return (
      <section className="sotb sotb--panel">
        <h2>{t.starting}</h2>
        <p>{t.allowMic}</p>
        <div className="sotb__actions">
          <button className="btn" onClick={exit}>{t.back}</button>
        </div>
      </section>
    );
  }

  if (step === null) {
    return (
      <section className="sotb sotb--panel">
        <h2>{singOnTheBeatName[locale]}</h2>
        <p className="sotb__turn">
          <PlayerBadge player={player} />
          {kit.yourTurn}
        </p>
        <p>{t.rules}</p>
        <div className="sotb__deck">
          {deck.map((card) => (
            <span key={card.id} className="sotb__deck-card">
              <Icon src={card.image} />
              {card.label}
            </span>
          ))}
        </div>
        <p className="sotb__hint">
          {t.hint(level.number, LEVELS.length, rounds, level.cardCount, bpm)} ·{' '}
          {SpeechListener.isSupported() ? t.usesMic : t.voiceOff.unsupported}
        </p>
        <div className="sotb__actions">
          <button className="btn btn--primary" onClick={play}>{t.start}</button>
          <button className="btn" onClick={exit}>{t.back}</button>
        </div>
        {SpeechListener.isSupported() && <VoiceSummary onRecheck={() => setChecking('full')} />}
      </section>
    );
  }

  // The match takes over once the turn ends.
  if (step.phase === 'done') return null;

  const round = step.round;
  const hand = hands[round];
  const finalResults = results[round] as CardResult[] | undefined;
  const answering = step.phase === 'sing' || step.phase === 'result';
  // A card's time is up once the next one has been lit for a moment; the last card waits for the result.
  const lit = step.phase === 'sing' ? step.active : hand.length;
  const passed = Math.min(Math.max(0, lit - (graceOver ? 0 : 1)), hand.length - 1);
  const cardResults = scored && answering ? (finalResults ?? judgeHand(hand, heard, passed, hearing)) : null;

  return (
    <section className="sotb">
      <header className="sotb__status">
        <PlayerBadge player={player} />
        <span>{t.level(level.number)}</span>
        <span>{t.round(round + 1, rounds)}</span>
        {scored && <span className="sotb__score">{kit.pts(score)}</span>}
        {scored && <Icon src={microphone} label={t.mic} className="sotb__mic" />}
        <button className="btn btn--small" onClick={exit}>{t.quit}</button>
      </header>

      <p key={beat} className={`sotb__caption sotb__caption--${step.phase}`} aria-live="polite">
        {caption(t, step, finalResults && roundScores[round], scored)}
      </p>

      <ol className="sotb__cards" style={{ '--cards': hand.length } as CSSProperties}>
        {hand.map((card, index) => {
          const state = cardState(step, index);
          const { mark, word } = cardResults?.[index] ?? { mark: 'pending' };
          return (
            <li key={`${round}-${index}`} className="sotb__slot">
              <div className={`sotb__card sotb__card--${state} sotb__card--${mark}`}>
                {state !== 'hidden' && <Icon src={card.image} label={card.label} className="sotb__card-icon" />}
              </div>
              {cardResults && (
                <span className={`sotb__word sotb__word--${mark}`} title={word}>
                  {word}
                </span>
              )}
            </li>
          );
        })}
      </ol>

      {scored && answering && (
        <p className="sotb__heard">
          {heard.length > 0 ? '' : finalResults ? t.nothingHeard : t.waiting}
        </p>
      )}
      {!scored && <p className="sotb__hint">{t.voiceOff[voice ?? 'failed']}</p>}

      <div key={`pulse-${beat}`} className="sotb__pulse" aria-hidden />
      {DEBUG && scored && <VoiceDebug hand={hand} heard={heard} hearing={hearing} />}
    </section>
  );
}

/** How the game is listening on this device, with a way to run the voice check again. */
function VoiceSummary({ onRecheck }: { onRecheck: () => void }) {
  const locale = useLocale();
  const t = useMessages(MESSAGES);
  const calibration = loadCalibration();
  const accent = accentFor(calibration, locale);
  const language = ACCENTS[locale].find((a) => a.id === accent)?.label ?? accent;
  return (
    <p className="sotb__hint sotb__voice">
      {t.listeningIn(language, calibration?.strictness === 'relaxed')} ·{' '}
      <button className="sotb__link" onClick={onRecheck}>{t.voiceCheck}</button>
    </p>
  );
}
