import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { unlockAudio } from '../../core/audio/sound';
import { useBeatClock } from '../../core/audio/useBeatClock';
import { PlayerBadge } from '../../core/match/PlayerBadge';
import type { Card, GameProps } from '../../core/types';
import { Icon } from '../../core/ui/Icon';
import microphone from '../../core/ui/icons/microphone.svg';
import { SpeechListener, type ListenResult } from '../../core/voice/SpeechListener';
import { createCueTrack } from './cueTrack';
import { dealRounds } from './deal';
import { LEVELS } from './levels';
import { judgeHand, scoreHand, type Mark } from './scoring';
import { stepAt, type Step } from './timeline';
import './SingOnTheBeat.css';

type CardState = 'hidden' | 'shown' | 'active' | 'sung';

const VOICE_OFF_REASON: Record<Exclude<ListenResult, 'listening'>, string> = {
  unsupported: "This browser can't listen. Use Chrome or Edge to get scored.",
  denied: 'Microphone access was blocked, so this game is not scored.',
  failed: "Couldn't start listening, so this game is not scored.",
};

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

function caption(step: Step, roundMarks: Mark[] | undefined, scored: boolean): string {
  switch (step.phase) {
    case 'countdown':
      return step.count === null ? 'Get ready!' : String(step.count);
    case 'sing':
      return 'Say it!';
    case 'result':
      if (!scored) return 'Nice!';
      if (!roundMarks) return 'Listening…';
      if (roundMarks.every((mark) => mark === 'correct')) return `Perfect! +${scoreHand(roundMarks)}`;
      return scoreHand(roundMarks) === 0 ? 'No points!' : `+${scoreHand(roundMarks)} points`;
    case 'done':
      return '';
  }
}

export function SingOnTheBeat({ theme, player, onTurnEnd, onExit }: GameProps) {
  const level = LEVELS[0];
  const createTrack = useMemo(() => () => createCueTrack(level), [level]);
  const clock = useBeatClock(createTrack);
  const listenerRef = useRef<SpeechListener | null>(null);
  /** Index into the listener's words where the current round's answers start; null when not listening. */
  const answersFromRef = useRef<number | null>(null);

  const [starting, setStarting] = useState(false);
  const [voice, setVoice] = useState<ListenResult | null>(null);
  const [hands, setHands] = useState<Card[][]>([]);
  const [beat, setBeat] = useState(0);
  const [step, setStep] = useState<Step | null>(null);
  const [heard, setHeard] = useState<string[]>([]);
  const [results, setResults] = useState<Mark[][]>([]);

  useEffect(() => () => listenerRef.current?.stop(), []);

  const scored = voice === 'listening';
  const score = results.reduce((sum, marks) => sum + scoreHand(marks), 0);

  const play = async () => {
    void unlockAudio();
    const deck = theme.cards.slice(0, level.cardTypes);
    const cardsById = new Map(deck.map((card) => [card.id, card]));
    const dealt = dealRounds(deck.map((card) => card.id), level, level.rounds).map((hand) =>
      hand.map((id) => cardsById.get(id)!),
    );
    setHands(dealt);
    setResults([]);
    setHeard([]);
    setStep(null);
    setStarting(true);

    listenerRef.current?.stop();
    const listener = new SpeechListener('en-US');
    listenerRef.current = listener;
    listener.onWords = (words) => {
      if (answersFromRef.current !== null) setHeard(words.slice(answersFromRef.current));
    };
    const voiceResult = await listener.start();
    const allMarks: Mark[][] = [];
    if (listenerRef.current !== listener) return; // quit while asking for the microphone
    setVoice(voiceResult);
    setStarting(false);
    setBeat(0);
    setStep(stepAt(0, level));

    void clock.start(level.bpm, (nextBeat) => {
      const next = stepAt(nextBeat, level);
      // Anything said during the countdown is thrown away, even words still being recognised.
      if (next.phase === 'countdown' && next.count === 1) listener.reset();
      if (next.phase === 'sing' && next.active === 0) {
        answersFromRef.current = listener.words.length;
        setHeard([]);
      }
      if (next.phase === 'result' && next.final && answersFromRef.current !== null) {
        const answers = listener.words.slice(answersFromRef.current);
        answersFromRef.current = null;
        setHeard(answers);
        allMarks.push(judgeHand(dealt[next.round], answers, true));
        setResults([...allMarks]);
      }
      if (next.phase === 'done') {
        clock.stop();
        listener.stop();
        const cardsRight = allMarks.flat().filter((mark) => mark === 'correct').length;
        onTurnEnd(
          voiceResult === 'listening'
            ? {
                score: allMarks.reduce((sum, marks) => sum + scoreHand(marks), 0),
                detail: `${cardsRight} of ${level.rounds * level.cardCount} cards right`,
              }
            : { score: 0, detail: VOICE_OFF_REASON[voiceResult] },
        );
      }
      setBeat(nextBeat);
      setStep(next);
    });
  };

  const exit = () => {
    clock.stop();
    listenerRef.current?.stop();
    listenerRef.current = null;
    onExit();
  };

  if (starting) {
    return (
      <section className="sotb sotb--panel">
        <h2>Get ready…</h2>
        <p>If your browser asks, allow the microphone so we can hear your answers.</p>
        <div className="sotb__actions">
          <button className="btn" onClick={exit}>Back</button>
        </div>
      </section>
    );
  }

  if (step === null) {
    return (
      <section className="sotb sotb--panel">
        <h2>Sing on the Beat</h2>
        <p className="sotb__turn">
          <PlayerBadge player={player} />, your turn!
        </p>
        <p>
          After the countdown all the cards appear. Say each word out loud <strong>on the beat</strong> as it lights
          up. Right word: points and a green card. Wrong or silent: red card, no points.
        </p>
        <div className="sotb__deck">
          {theme.cards.slice(0, level.cardTypes).map((card) => (
            <span key={card.id} className="sotb__deck-card">
              <Icon src={card.image} />
              {card.label}
            </span>
          ))}
        </div>
        <p className="sotb__hint">
          Level {level.number} · {level.rounds} rounds · {level.cardCount} cards ·{' '}
          {SpeechListener.isSupported() ? 'uses your microphone' : VOICE_OFF_REASON.unsupported}
        </p>
        <div className="sotb__actions">
          <button className="btn btn--primary" onClick={play}>Start</button>
          <button className="btn" onClick={exit}>Back</button>
        </div>
      </section>
    );
  }

  // The match takes over once the turn ends.
  if (step.phase === 'done') return null;

  const round = step.round;
  const hand = hands[round];
  const finalMarks = results[round] as Mark[] | undefined;
  const answering = step.phase === 'sing' || step.phase === 'result';
  const marks = scored && answering ? (finalMarks ?? judgeHand(hand, heard, false)) : null;

  return (
    <section className="sotb">
      <header className="sotb__status">
        <PlayerBadge player={player} />
        <span>Level {level.number}</span>
        <span>Round {round + 1}/{level.rounds}</span>
        {scored && <span className="sotb__score">{score} pts</span>}
        {scored && <Icon src={microphone} label="Listening" className="sotb__mic" />}
        <button className="btn btn--small" onClick={exit}>Quit</button>
      </header>

      <p key={beat} className={`sotb__caption sotb__caption--${step.phase}`} aria-live="polite">
        {caption(step, finalMarks, scored)}
      </p>

      <ol className="sotb__cards" style={{ '--cards': hand.length } as CSSProperties}>
        {hand.map((card, index) => {
          const state = cardState(step, index);
          const mark = marks?.[index] ?? 'pending';
          return (
            <li key={`${round}-${index}`} className={`sotb__card sotb__card--${state} sotb__card--${mark}`}>
              {state !== 'hidden' && <Icon src={card.image} label={card.label} className="sotb__card-icon" />}
            </li>
          );
        })}
      </ol>

      {scored && answering && (
        <p className="sotb__heard">
          {heard.length > 0 ? (
            <>Heard: <strong>{heard.join(' ')}</strong></>
          ) : finalMarks ? (
            'Nothing heard'
          ) : (
            'Waiting for your voice…'
          )}
        </p>
      )}
      {!scored && <p className="sotb__hint">{VOICE_OFF_REASON[voice ?? 'failed']}</p>}

      <div key={`pulse-${beat}`} className="sotb__pulse" aria-hidden />
    </section>
  );
}
