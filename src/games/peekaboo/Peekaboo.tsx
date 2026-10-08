import { useRef, useState } from 'react';
import { useMusic } from '../../core/audio/useMusic';
import { defaultRng } from '../../core/random';
import type { GameProps } from '../../core/types';
import { Icon } from '../../core/ui/Icon';
import { OVER_MS, secondsCrossed, useAfter, useCountdown, useFrameLoop, useThemeSounds, type TurnPhase } from '../kit/hooks';
import { Badge, StageCaption, TurnIntro, TurnOver, TurnScreen } from '../kit/TurnScreens';
import {
  createPeek,
  HOLES,
  isOver,
  multiplier,
  PEEK_KINDS,
  stepPeek,
  tap,
  timeLeft,
  TURN_SECONDS,
  type Peek,
  type PeekKind,
} from './peek';
import type { PeekSkin } from './skin';
import './Peekaboo.css';

const TICKING_FROM = 5;

interface PeekabooProps extends GameProps {
  skin: PeekSkin;
}

/** One turn of a pop-up game: tap the rascals as they peek out, but leave the friend alone. */
export function Peekaboo({ skin, theme, player, onTurnEnd, onExit }: PeekabooProps) {
  const [phase, setPhase] = useState<TurnPhase>('intro');
  const [peek, setPeek] = useState<Peek>(createPeek);
  const peekRef = useRef(peek);
  const sounds = useThemeSounds(theme);

  useMusic(phase === 'playing' ? (theme.music ?? null) : null);

  const update = (next: Peek) => {
    peekRef.current = next;
    setPeek(next);
  };

  const count = useCountdown(phase === 'countdown', () => setPhase('playing'), (cue) => sounds().cue(cue));

  useFrameLoop(phase === 'playing', (dt) => {
    const before = timeLeft(peekRef.current);
    const next = stepPeek(peekRef.current, dt, defaultRng);
    update(next);
    if (isOver(next)) {
      sounds().timeUp();
      setPhase('over');
      return false;
    }
    const second = secondsCrossed(before, timeLeft(next));
    if (second !== null && second <= TICKING_FROM) sounds().cue('tick');
  });

  useAfter(phase === 'over', OVER_MS, () => {
    const done = peekRef.current;
    const [one, many] = skin.caughtNoun;
    const friend = skin.kinds.friend.name.toLowerCase();
    onTurnEnd({
      score: done.score,
      detail: [
        `${done.caught} ${done.caught === 1 ? one : many}`,
        `${done.escaped} got away`,
        done.oops === 0 ? `no ${friend} bonked` : `${done.oops} ${friend} ${done.oops === 1 ? 'bonk' : 'bonks'}`,
      ].join(' · '),
    });
  });

  const whack = (hole: number) => {
    if (phase !== 'playing') return;
    const { peek: next, outcome } = tap(peekRef.current, hole);
    update(next);
    if (outcome === 'caught') sounds().good(next.streak >= 5 ? 1 : 0);
    else if (outcome === 'boss') sounds().good(2);
    else if (outcome === 'friend') sounds().bad();
    else sounds().tap();
  };

  const className = `peek peek--${skin.id}`;

  if (phase === 'intro') {
    return (
      <TurnIntro
        title={skin.title}
        player={player}
        className={className}
        hint={`${TURN_SECONDS} seconds · 5 in a row = double points`}
        onStart={() => {
          sounds();
          update(createPeek());
          setPhase('countdown');
        }}
        onExit={onExit}
      >
        <p>{skin.intro}</p>
        <ul className="turn__legend">
          {(Object.keys(PEEK_KINDS) as PeekKind[]).map((kind) => (
            <li key={kind} className={`peek__kind--${kind}`}>
              <Icon src={skin.kinds[kind].image} />
              {skin.kinds[kind].name}{' '}
              <strong>{PEEK_KINDS[kind].points > 0 ? PEEK_KINDS[kind].points : `−${-PEEK_KINDS[kind].points} — don't tap!`}</strong>
            </li>
          ))}
        </ul>
      </TurnIntro>
    );
  }

  const seconds = timeLeft(peek);
  const combo = multiplier(peek.streak);

  return (
    <TurnScreen
      player={player}
      className={className}
      score={peek.score}
      extra={combo > 1 && <Badge key={combo}>×{combo}</Badge>}
      seconds={seconds}
      timeLeft={seconds / TURN_SECONDS}
      hurry={Math.ceil(seconds) <= TICKING_FROM && phase === 'playing'}
      onExit={onExit}
    >
      <div className={`turn__stage peek__stage peek__stage--${phase}`}>
        <ol className="peek__holes">
          {Array.from({ length: HOLES }, (_, hole) => {
            const peeker = peek.peekers.find((p) => p.hole === hole);
            const state = !peeker ? 'empty' : peeker.tappedAt !== null ? 'tapped' : 'out';
            return (
              <li key={hole}>
                <button
                  className={`peek__hole peek__hole--${state} ${peeker ? `peek__kind--${peeker.kind}` : ''}`}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    whack(hole);
                  }}
                  onClick={(event) => event.detail === 0 && whack(hole)}
                  aria-label={peeker && state === 'out' ? skin.kinds[peeker.kind].name : `Hole ${hole + 1}`}
                >
                  {skin.holeLabel && <span className="peek__label">{skin.holeLabel(hole)}</span>}
                  {peeker && (
                    <span key={peeker.id} className="peek__who">
                      <Icon src={skin.kinds[peeker.kind].image} />
                    </span>
                  )}
                  {peeker?.tappedAt != null && (
                    <span key={`p${peeker.id}`} className={`peek__points ${peeker.points < 0 ? 'peek__points--bad' : ''}`}>
                      {peeker.points > 0 ? `+${peeker.points}` : `−${-peeker.points}`}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>

        {phase === 'countdown' && (
          <StageCaption key={count}>
            <p>{count}</p>
          </StageCaption>
        )}
        {phase === 'over' && <TurnOver score={peek.score} />}
      </div>
    </TurnScreen>
  );
}
