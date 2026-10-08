import { useEffect, useEffectEvent, useMemo, useRef, useState, type ReactNode } from 'react';
import { createBeeper } from '../audio/beeper';
import type { BeatTrack } from '../audio/BeatClock';
import { unlockAudio } from '../audio/sound';
import { useBeatClock } from '../audio/useBeatClock';
import type { Card, Theme } from '../types';
import { Icon } from '../ui/Icon';
import {
  defaultCalibration,
  LANGUAGES,
  loadCalibration,
  measureDelay,
  completeCheck,
  saveCalibration,
  withAlias,
  type Strictness,
  type VoiceCalibration,
} from './calibration';
import { cardNamed, saysExactly } from './matching';
import { SpeechListener } from './SpeechListener';
import './VoiceCheck.css';

type Step = 'welcome' | 'mic' | 'no-mic' | 'timing-ready' | 'timing' | 'timing-result' | 'words' | 'strictness';

/** The timing test: a slow beat, a count-in, then the player says one card on every beat. */
const TIMING_BPM = 60;
const BEAT_MS = 60000 / TIMING_BPM;
const COUNT_IN = 4;
const SING_BEATS = 8;

/** The word test: how long to wait for a word, and for the recogniser to settle on what it heard. */
const SILENCE_MS = 5000;
const SETTLE_MS = 1300;
const NEXT_CARD_MS = 700;

type WordState = { kind: 'listening' } | { kind: 'matched'; word: string } | { kind: 'heard'; word: string } | { kind: 'silent' };

const STRICTNESS: { id: Strictness; label: string; text: string }[] = [
  { id: 'strict', label: 'Strict', text: 'Only the exact words count. Best for a real challenge.' },
  {
    id: 'relaxed',
    label: 'Relaxed',
    text: 'Words that sound close count too, and slow words get a little more time. Best for kids and noisy rooms.',
  },
];

function timingTrack(): BeatTrack {
  const beeper = createBeeper();
  return {
    play(time, beat) {
      if (beat < COUNT_IN) beeper.play('count', time);
      else if (beat < COUNT_IN + SING_BEATS) beeper.play('go', time);
    },
    dispose: () => beeper.dispose(),
  };
}

interface VoiceCheckProps {
  theme: Theme;
  /** 'full': language, timing, words and strictness (first time, or run again). 'words': just this theme's cards. */
  mode: 'full' | 'words';
  /** Shown over the page (from the settings) instead of as the page. */
  overlay?: boolean;
  /** Called with the saved result, also when the check is skipped (so it isn't asked again). */
  onDone: (calibration: VoiceCalibration) => void;
  /** Leaves without saving anything. */
  onCancel?: () => void;
}

/**
 * Tunes speech games to this device and these voices: the recognition language, how late
 * words arrive (so on-time words aren't marked wrong), extra words to accept for cards the
 * browser mishears, and how strict to be. The result is saved for next time.
 */
export function VoiceCheck({ theme, mode, overlay = false, onDone, onCancel }: VoiceCheckProps) {
  const cards: Card[] = useMemo(() => theme.decks.flat(), [theme]);
  const timingCard = theme.decks[0]?.[0] ?? cards[0];

  const [calibration, setCalibration] = useState<VoiceCalibration>(() => {
    const saved = loadCalibration();
    // Running the full check again starts fresh, keeping only the chosen language.
    if (mode === 'full') return { ...defaultCalibration(), lang: saved?.lang ?? 'en-US', strictness: saved?.strictness ?? 'strict' };
    return saved ?? defaultCalibration();
  });
  const calibrationRef = useRef(calibration);
  const [step, setStep] = useState<Step>('welcome');
  const listenerRef = useRef<SpeechListener | null>(null);

  const update = (next: VoiceCalibration) => {
    calibrationRef.current = next;
    setCalibration(next);
  };

  useEffect(() => () => listenerRef.current?.stop(), []);

  /** Saves what was learned (also when skipped, so the check isn't asked again) and hands it back. */
  function finish(from: VoiceCalibration = calibrationRef.current) {
    listenerRef.current?.stop();
    listenerRef.current = null;
    const done = completeCheck(from, theme.id);
    saveCalibration(done);
    onDone(done);
  }

  // --- Microphone ---------------------------------------------------------------------------
  const startListening = async () => {
    void unlockAudio();
    setStep('mic');
    const listener = new SpeechListener(calibrationRef.current.lang);
    listenerRef.current = listener;
    const result = await listener.start();
    if (listenerRef.current !== listener) return;
    if (result !== 'listening') {
      setStep('no-mic');
      return;
    }
    setStep(mode === 'full' ? 'timing-ready' : 'words');
  };

  // --- Timing test --------------------------------------------------------------------------
  const createTrack = useMemo(() => timingTrack, []);
  const clock = useBeatClock(createTrack);
  const [beat, setBeat] = useState(-1);
  const beatTimes = useRef<number[]>([]);
  const arrivals = useRef<number[]>([]);
  const [measured, setMeasured] = useState<number | null>(null);

  const runTiming = () => {
    const listener = listenerRef.current;
    if (!listener) return;
    beatTimes.current = [];
    arrivals.current = [];
    listener.reset();
    let heardSoFar = 0;
    listener.onWords = (words) => {
      const now = performance.now();
      for (let i = heardSoFar; i < words.length; i++) arrivals.current.push(now);
      heardSoFar = words.length;
    };
    setBeat(-1);
    setStep('timing');
    void clock.start(TIMING_BPM, (next) => {
      if (next >= COUNT_IN && next < COUNT_IN + SING_BEATS) beatTimes.current.push(performance.now());
      setBeat(next);
      // One more beat for the last word to arrive, then work out the delay.
      if (next === COUNT_IN + SING_BEATS + 1) {
        clock.stop();
        listener.onWords = null;
        const delay = measureDelay(beatTimes.current, arrivals.current, BEAT_MS);
        setMeasured(delay);
        if (delay !== null) update({ ...calibrationRef.current, delayMs: delay });
        setStep('timing-result');
      }
    });
  };

  // --- Word test ----------------------------------------------------------------------------
  const [cardIndex, setCardIndex] = useState(0);
  const [wordState, setWordState] = useState<WordState>({ kind: 'listening' });
  const [attempt, setAttempt] = useState(0);
  const card = cards[cardIndex];

  /** On to the next card; after the last one, the strictness question (full check) or done. */
  function advance() {
    setWordState({ kind: 'listening' });
    if (cardIndex + 1 < cards.length) setCardIndex(cardIndex + 1);
    else if (mode === 'full') setStep('strictness');
    else finish();
  }
  const advanceLater = useEffectEvent(advance);

  useEffect(() => {
    if (step !== 'words' || !card) return;
    const listener = listenerRef.current;
    if (!listener) return;
    listener.reset();
    let settle: ReturnType<typeof setTimeout> | undefined;
    let next: ReturnType<typeof setTimeout> | undefined;
    const silence = setTimeout(() => setWordState({ kind: 'silent' }), SILENCE_MS);
    listener.onWords = (words) => {
      if (words.length === 0) return;
      clearTimeout(silence);
      clearTimeout(settle);
      const match = words.find((word) => saysExactly(card, word, calibrationRef.current.aliases));
      if (match) {
        listener.onWords = null;
        setWordState({ kind: 'matched', word: match });
        next = setTimeout(advanceLater, NEXT_CARD_MS);
        return;
      }
      // Wait for the recogniser to settle before asking about what it heard.
      settle = setTimeout(() => {
        listener.onWords = null;
        setWordState({ kind: 'heard', word: words[words.length - 1] });
      }, SETTLE_MS);
    };
    return () => {
      clearTimeout(silence);
      clearTimeout(settle);
      clearTimeout(next);
      listener.onWords = null;
    };
  }, [step, card, attempt]);


  const retry = () => {
    setWordState({ kind: 'listening' });
    setAttempt((a) => a + 1);
  };

  const accept = (word: string) => {
    update(withAlias(calibrationRef.current, card.id, word));
    advance();
  };

  // --- Screens ------------------------------------------------------------------------------
  const skipAll = (
    <button className="btn" onClick={() => finish()}>
      {step === 'welcome' ? 'Skip, use the usual settings' : 'Skip the rest'}
    </button>
  );

  let body;
  switch (step) {
    case 'welcome':
      body =
        mode === 'full' ? (
          <>
            <h2>Voice check</h2>
            <p>
              A quick check so Sing on the Beat hears you better on this device. You'll say one word on a beat, then
              each card once. It takes about two minutes and only happens once.
            </p>
            <label className="voice-check__field">
              <span>Accent</span>
              <select value={calibration.lang} onChange={(event) => update({ ...calibration, lang: event.target.value })}>
                {LANGUAGES.map((language) => (
                  <option key={language.id} value={language.id}>{language.label}</option>
                ))}
              </select>
            </label>
            <p className="voice-check__hint">Pick the English closest to how you speak. You can change it later in the game night settings.</p>
          </>
        ) : (
          <>
            <h2>New words!</h2>
            <p>
              Before your first {theme.name} round, say each card once so the game learns how it sounds in your voice.
              It takes about a minute.
            </p>
          </>
        );
      return frame(
        body,
        <>
          <button className="btn btn--primary" onClick={() => void startListening()} autoFocus>
            Start
          </button>
          {skipAll}
          {onCancel && <button className="btn" onClick={onCancel}>Cancel</button>}
        </>,
      );

    case 'mic':
      return frame(
        <>
          <h2>Listening…</h2>
          <p>If your browser asks, allow the microphone.</p>
        </>,
        skipAll,
      );

    case 'no-mic':
      return frame(
        <>
          <h2>No microphone</h2>
          <p>We couldn't listen, so the check can't run. The game will use the usual settings. You can run the check again from the game night settings.</p>
        </>,
        <button className="btn btn--primary" onClick={() => finish()} autoFocus>OK</button>,
      );

    case 'timing-ready':
      return frame(
        <>
          <h2>1. Timing</h2>
          <p>
            After four beeps, say <strong>“{timingCard.label}”</strong> on every beat, eight times, right when the card
            flashes. This measures how quickly this device understands you.
          </p>
          <WordCard card={timingCard} />
        </>,
        <>
          <button className="btn btn--primary" onClick={runTiming} autoFocus>Ready</button>
          <button className="btn" onClick={() => setStep('words')}>Skip timing</button>
        </>,
      );

    case 'timing': {
      const singing = beat >= COUNT_IN && beat < COUNT_IN + SING_BEATS;
      return frame(
        <>
          <h2>1. Timing</h2>
          <p className="voice-check__beat" aria-live="polite">
            {beat < 0 ? 'Get ready…' : beat < COUNT_IN ? COUNT_IN - beat : singing ? `Say it! ${beat - COUNT_IN + 1} / ${SING_BEATS}` : 'Done!'}
          </p>
          <WordCard key={beat} card={timingCard} flash={singing} />
        </>,
        null,
      );
    }

    case 'timing-result':
      return frame(
        <>
          <h2>1. Timing</h2>
          {measured !== null ? (
            <p>
              This device understands words about <strong>{(measured / 1000).toFixed(2)} seconds</strong> after you say
              them. The game will allow for that.
            </p>
          ) : (
            <p>We didn't hear enough words to measure. Try again a little louder, or skip and use the usual timing.</p>
          )}
        </>,
        measured !== null ? (
          <button className="btn btn--primary" onClick={() => setStep('words')} autoFocus>Next: the words</button>
        ) : (
          <>
            <button className="btn btn--primary" onClick={runTiming} autoFocus>Try again</button>
            <button className="btn" onClick={() => setStep('words')}>Skip timing</button>
          </>
        ),
      );

    case 'words': {
      if (!card) return frame(null, null);
      const other = wordState.kind === 'heard' ? cardNamed(wordState.word, cards, calibration.aliases) : undefined;
      return frame(
        <>
          <h2>{mode === 'full' ? '2. Words' : 'New words'}</h2>
          <p className="voice-check__progress">
            Card {cardIndex + 1} of {cards.length}
          </p>
          <WordCard card={card} state={wordState.kind} />
          <p className="voice-check__status" aria-live="polite">
            {wordState.kind === 'listening' && (
              <>
                Say <strong>“{card.label}”</strong>
              </>
            )}
            {wordState.kind === 'matched' && <>Got it!</>}
            {wordState.kind === 'silent' && <>We didn't hear anything.</>}
            {wordState.kind === 'heard' &&
              (other ? (
                <>
                  We heard <strong>“{wordState.word}”</strong>, which is another card ({other.label}).
                </>
              ) : (
                <>
                  We heard <strong>“{wordState.word}”</strong>. Count it as {card.label} on this device?
                </>
              ))}
          </p>
        </>,
        <>
          {wordState.kind === 'heard' && !other && (
            <button className="btn btn--primary" onClick={() => accept(wordState.word)} autoFocus>
              Yes, count it
            </button>
          )}
          {(wordState.kind === 'heard' || wordState.kind === 'silent') && (
            <button className="btn" onClick={retry}>Try again</button>
          )}
          {wordState.kind !== 'matched' && <button className="btn" onClick={advance}>Skip this card</button>}
          {skipAll}
        </>,
      );
    }

    case 'strictness':
      return frame(
        <>
          <h2>3. How strict?</h2>
          <div className="voice-check__choices" role="radiogroup" aria-label="Strictness">
            {STRICTNESS.map((option) => (
              <button
                key={option.id}
                role="radio"
                aria-checked={calibration.strictness === option.id}
                className={`voice-check__choice ${calibration.strictness === option.id ? 'voice-check__choice--on' : ''}`}
                onClick={() => update({ ...calibration, strictness: option.id })}
              >
                <strong>{option.label}</strong>
                <span>{option.text}</span>
              </button>
            ))}
          </div>
        </>,
        <button className="btn btn--primary" onClick={() => finish()} autoFocus>All set!</button>,
      );
  }

  function frame(content: ReactNode, actions: ReactNode) {
    const panel = (
      <section className="voice-check">
        {content}
        {actions && <div className="voice-check__actions">{actions}</div>}
      </section>
    );
    return overlay ? <div className="voice-check__overlay">{panel}</div> : panel;
  }
}

function WordCard({ card, flash = false, state }: { card: Card; flash?: boolean; state?: WordState['kind'] }) {
  return (
    <div className={`voice-check__card ${flash ? 'voice-check__card--flash' : ''} ${state ? `voice-check__card--${state}` : ''}`}>
      <Icon src={card.image} label={card.label} />
      <span className="voice-check__label">{card.label}</span>
    </div>
  );
}
