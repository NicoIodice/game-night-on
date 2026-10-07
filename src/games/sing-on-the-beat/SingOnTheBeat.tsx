import { useState, type CSSProperties } from 'react';
import { useBeatClock } from '../../core/audio/useBeatClock';
import type { Card, GameProps } from '../../core/types';
import { Icon } from '../../core/ui/Icon';
import { dealRounds } from './deal';
import { LEVELS } from './levels';
import { stepAt, type Step } from './timeline';
import './SingOnTheBeat.css';

type CardState = 'hidden' | 'shown' | 'active' | 'sung';

function cardState(step: Step, index: number): CardState {
  switch (step.phase) {
    case 'intro':
    case 'done':
      return 'hidden';
    case 'reveal':
      return index < step.revealed ? 'shown' : 'hidden';
    case 'sing':
      if (step.active === null || index < step.active) return 'sung';
      return index === step.active ? 'active' : 'shown';
  }
}

function caption(step: Step, hand: Card[]): string {
  switch (step.phase) {
    case 'intro':
      return String(step.countdown);
    case 'reveal':
      return step.revealed < hand.length ? 'Watch…' : 'Get ready…';
    case 'sing':
      return step.active === null ? 'Next round…' : `${hand[step.active].label}!`;
    case 'done':
      return '';
  }
}

export function SingOnTheBeat({ theme, onExit }: GameProps) {
  const level = LEVELS[0];
  // `supports()` in the game definition guarantees the theme has a beat track.
  const clock = useBeatClock(theme.createBeatTrack!);
  const [hands, setHands] = useState<Card[][]>([]);
  const [beat, setBeat] = useState(0);
  const [step, setStep] = useState<Step | null>(null);

  const play = () => {
    const deck = theme.cards.slice(0, level.cardTypes);
    const cardsById = new Map(deck.map((card) => [card.id, card]));
    const dealt = dealRounds(deck.map((card) => card.id), level, level.rounds);
    setHands(dealt.map((hand) => hand.map((id) => cardsById.get(id)!)));
    setBeat(0);
    setStep(stepAt(0, level));

    void clock.start(level.bpm, (nextBeat) => {
      const next = stepAt(nextBeat, level);
      setBeat(nextBeat);
      setStep(next);
      if (next.phase === 'done') clock.stop();
    });
  };

  const exit = () => {
    clock.stop();
    onExit();
  };

  if (step === null) {
    return (
      <section className="sotb sotb--panel">
        <h2>Sing on the Beat</h2>
        <p>Cards appear one per beat. Then say each word <strong>exactly on the beat</strong> as it lights up.</p>
        <div className="sotb__deck">
          {theme.cards.slice(0, level.cardTypes).map((card) => (
            <span key={card.id} className="sotb__deck-card">
              <Icon src={card.image} />
              {card.label}
            </span>
          ))}
        </div>
        <p className="sotb__hint">
          Level {level.number} · {level.rounds} rounds · {level.cardCount} cards · {level.bpm} BPM. Turn the sound on!
        </p>
        <div className="sotb__actions">
          <button className="btn btn--primary" onClick={play}>Start</button>
          <button className="btn" onClick={exit}>Back</button>
        </div>
      </section>
    );
  }

  if (step.phase === 'done') {
    return (
      <section className="sotb sotb--panel">
        <h2>Spooktacular!</h2>
        <p>Level {level.number} complete. More levels with faster beats and more cards are coming soon.</p>
        <div className="sotb__actions">
          <button className="btn btn--primary" onClick={play}>Play again</button>
          <button className="btn" onClick={exit}>Choose another game</button>
        </div>
      </section>
    );
  }

  const round = step.phase === 'intro' ? 0 : step.round;
  const hand = hands[round];

  return (
    <section className="sotb">
      <header className="sotb__status">
        <span>Level {level.number}</span>
        <span>Round {round + 1}/{level.rounds}</span>
        <button className="btn btn--small" onClick={exit}>Quit</button>
      </header>

      <p key={beat} className={`sotb__caption sotb__caption--${step.phase}`} aria-live="polite">
        {caption(step, hand)}
      </p>

      <ol className="sotb__cards" style={{ '--cards': hand.length } as CSSProperties}>
        {hand.map((card, index) => {
          const state = cardState(step, index);
          return (
            <li key={`${round}-${index}`} className={`sotb__card sotb__card--${state}`}>
              {state !== 'hidden' && (
                <>
                  <Icon src={card.image} label={card.label} className="sotb__card-icon" />
                  <span className="sotb__card-label">{card.label}</span>
                </>
              )}
            </li>
          );
        })}
      </ol>

      <div key={`pulse-${beat}`} className="sotb__pulse" aria-hidden />
    </section>
  );
}
