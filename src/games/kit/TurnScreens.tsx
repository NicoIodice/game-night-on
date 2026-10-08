import type { CSSProperties, ReactNode } from 'react';
import { useMessages } from '../../core/i18n/I18n';
import { PlayerBadge } from '../../core/match/PlayerBadge';
import type { Player } from '../../core/types';
import { MESSAGES } from './messages';
import './kit.css';

interface TurnIntroProps {
  title: string;
  player: Player;
  /** Extra class for the skin, e.g. `memory memory--pumpkin-patch`. */
  className?: string;
  /** The rules and anything else to show before starting (legend, examples…). */
  children: ReactNode;
  /** One line under the rules, e.g. "30 seconds · streak of 5 = double points". */
  hint?: ReactNode;
  /** Defaults to "Start". */
  startLabel?: string;
  onStart: () => void;
  onExit: () => void;
}

/** A turn's first screen: whose turn it is, the rules, and Start. */
export function TurnIntro({ title, player, className = '', children, hint, startLabel, onStart, onExit }: TurnIntroProps) {
  const t = useMessages(MESSAGES);
  return (
    <section className={`turn turn--panel ${className}`}>
      <h2>{title}</h2>
      <p className="turn__who">
        <PlayerBadge player={player} />
        {t.yourTurn}
      </p>
      {children}
      {hint && <p className="turn__hint">{hint}</p>}
      <div className="turn__actions">
        <button className="btn btn--primary" onClick={onStart} autoFocus>{startLabel ?? t.start}</button>
        <button className="btn" onClick={onExit}>{t.back}</button>
      </div>
    </section>
  );
}

interface TurnScreenProps {
  player: Player;
  className?: string;
  score: number;
  /** Shown after the score, e.g. a combo or lives. */
  extra?: ReactNode;
  /** Seconds left on the clock, if the turn is timed. */
  seconds?: number;
  /** Fraction of time left, 0 to 1, for the bar under the status. */
  timeLeft?: number;
  /** Turns the clock red. */
  hurry?: boolean;
  onExit: () => void;
  children: ReactNode;
}

/** A turn being played: status bar (player, score, clock, Quit), timer bar, then the game. Drawn in the player's colour. */
export function TurnScreen({ player, className = '', score, extra, seconds, timeLeft, hurry = false, onExit, children }: TurnScreenProps) {
  const t = useMessages(MESSAGES);
  return (
    <section className={`turn ${className}`} style={{ '--player': player.color } as CSSProperties}>
      <header className="turn__status">
        <PlayerBadge player={player} />
        <span className="turn__score">{t.pts(score)}</span>
        {extra}
        {seconds !== undefined && (
          <span className={`turn__time ${hurry ? 'turn__time--low' : ''}`}>{Math.ceil(seconds)}s</span>
        )}
        <button className="btn btn--small" onClick={onExit}>{t.quit}</button>
      </header>
      {timeLeft !== undefined && (
        <div className="turn__timer" aria-hidden>
          <div className="turn__timer-fill" style={{ width: `${Math.max(0, Math.min(1, timeLeft)) * 100}%` }} />
        </div>
      )}
      {children}
    </section>
  );
}

/** A big caption over the play area: the countdown number, or the result once the turn is over. */
export function StageCaption({ children, dim = false }: { children: ReactNode; dim?: boolean }) {
  return (
    <div className={`turn__caption ${dim ? 'turn__caption--dim' : ''}`} aria-live="polite">
      {children}
    </div>
  );
}

/** The usual end-of-turn caption: a title ("Time's up!" unless given) and the points scored. */
export function TurnOver({ title, score }: { title?: string; score: number }) {
  const t = useMessages(MESSAGES);
  return (
    <StageCaption dim>
      <p>{title ?? t.timesUp}</p>
      <p className="turn__final">{t.points(score)}</p>
    </StageCaption>
  );
}

/** A small pill next to the score, e.g. "×2" for a streak. Pops each time its key changes. */
export function Badge({ children }: { children: ReactNode }) {
  return <span className="turn__badge">{children}</span>;
}
