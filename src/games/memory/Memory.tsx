import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useMusic } from '../../core/audio/useMusic';
import { defaultRng } from '../../core/random';
import type { GameProps } from '../../core/types';
import { Icon } from '../../core/ui/Icon';
import { OVER_MS, secondsCrossed, useAfter, useCountdown, useFrameLoop, useThemeSounds, type TurnPhase } from '../kit/hooks';
import { Badge, StageCaption, TurnIntro, TurnOver, TurnScreen } from '../kit/TurnScreens';
import {
  clearBonus,
  dealBoard,
  DEFAULT_SECONDS,
  flip,
  hideMismatch,
  isCleared,
  isShowingMismatch,
  LEVELS,
  pairsFound,
  type Board,
} from './board';
import { memoryFaces, type MemorySkin } from './skin';
import './Memory.css';

/** How long a mismatched pair stays face up. */
const MISMATCH_MS = 900;
const TICKING_FROM = 5;

interface MemoryProps extends GameProps {
  skin: MemorySkin;
}

/** One turn of a memory game: find every pair before the clock runs out. */
export function Memory({ skin, theme, player, level: levelIndex, options, onTurnEnd, onExit }: MemoryProps) {
  const level = LEVELS[Math.min(levelIndex, LEVELS.length - 1)];
  const seconds = options.seconds ?? DEFAULT_SECONDS;
  const faces = memoryFaces(theme, skin);
  const facesById = new Map(faces.map((card) => [card.id, card]));

  const [phase, setPhase] = useState<TurnPhase>('intro');
  const [board, setBoard] = useState<Board>(() => dealBoard(faces.map((card) => card.id), level.pairs, defaultRng));
  const [left, setLeft] = useState(seconds);
  const [bonus, setBonus] = useState(0);
  const boardRef = useRef(board);
  const leftRef = useRef(left);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const sounds = useThemeSounds(theme);

  useMusic(phase === 'playing' ? (theme.music ?? null) : null);

  useEffect(() => () => clearTimeout(hideTimer.current), []);

  const update = (next: Board) => {
    boardRef.current = next;
    setBoard(next);
  };

  const count = useCountdown(phase === 'countdown', () => setPhase('playing'), (cue) => sounds().cue(cue));

  useFrameLoop(phase === 'playing', (dt) => {
    const before = leftRef.current;
    const after = Math.max(0, before - dt);
    leftRef.current = after;
    setLeft(after);
    if (after === 0) {
      clearTimeout(hideTimer.current);
      sounds().timeUp();
      setPhase('over');
      return false;
    }
    const second = secondsCrossed(before, after);
    if (second !== null && second <= TICKING_FROM) sounds().cue('tick');
  });

  useAfter(phase === 'over', OVER_MS, () => {
    const done = boardRef.current;
    const cleared = isCleared(done);
    onTurnEnd({
      score: done.score + bonus,
      detail: [
        `${pairsFound(done)} of ${level.pairs} pairs`,
        `${done.flips} flips`,
        cleared ? `${Math.floor(leftRef.current)}s to spare` : `best streak ${done.bestStreak}`,
      ].join(' · '),
    });
  });

  const turnOver = (index: number) => {
    if (phase !== 'playing') return;
    clearTimeout(hideTimer.current);
    const { board: next, outcome } = flip(boardRef.current, index);
    update(next);
    if (outcome === 'ignored') return;
    if (outcome === 'flip') sounds().tap();
    if (outcome === 'mismatch') {
      sounds().bad();
      hideTimer.current = setTimeout(() => update(hideMismatch(boardRef.current)), MISMATCH_MS);
    }
    if (outcome === 'match') {
      if (isCleared(next)) {
        sounds().good(2);
        setBonus(clearBonus(leftRef.current));
        setPhase('over');
      } else {
        sounds().good(next.streak > 1 ? 1 : 0);
      }
    }
  };

  const className = `memory memory--${skin.id}`;

  if (phase === 'intro') {
    return (
      <TurnIntro
        title={skin.title}
        player={player}
        className={className}
        hint={`Level ${levelIndex + 1} · ${level.pairs} pairs · ${seconds} seconds · pairs in a row earn a bonus`}
        onStart={() => {
          sounds();
          setPhase('countdown');
        }}
        onExit={onExit}
      >
        <p>{skin.intro}</p>
        <div className="memory__preview" aria-hidden>
          <span className="memory__mini memory__mini--back"><Icon src={skin.back} /></span>
          <span className="memory__mini"><Icon src={faces[0].image} /></span>
          <span className="memory__mini"><Icon src={faces[0].image} /></span>
        </div>
      </TurnIntro>
    );
  }

  const cleared = isCleared(board);
  const mismatch = isShowingMismatch(board);

  return (
    <TurnScreen
      player={player}
      className={className}
      score={board.score + bonus}
      extra={board.streak > 1 && <Badge key={board.streak}>{board.streak} in a row</Badge>}
      seconds={left}
      timeLeft={left / seconds}
      hurry={Math.ceil(left) <= TICKING_FROM && phase === 'playing'}
      onExit={onExit}
    >
      <div className={`turn__stage memory__table memory__table--${phase}`}>
        <ol
          className="memory__grid"
          style={
            {
              '--columns': level.columns,
              '--rows': Math.ceil((level.pairs * 2) / level.columns),
              '--tall-columns': level.tallColumns,
              '--tall-rows': Math.ceil((level.pairs * 2) / level.tallColumns),
            } as CSSProperties
          }
        >
          {board.faces.map((faceId, index) => {
            const face = facesById.get(faceId);
            const matched = board.matched[index];
            const open = board.open.includes(index);
            const up = matched || open;
            const state = matched ? 'matched' : open && mismatch ? 'wrong' : up ? 'open' : 'down';
            return (
              <li key={index}>
                <button
                  className={`memory__card memory__card--${state}`}
                  onClick={() => turnOver(index)}
                  disabled={phase !== 'playing' || matched}
                  aria-label={up ? face?.label : `Card ${index + 1}, face down`}
                >
                  <span className="memory__inner">
                    <span className="memory__side memory__side--back"><Icon src={skin.back} /></span>
                    <span className="memory__side memory__side--front">{face && <Icon src={face.image} />}</span>
                  </span>
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
        {phase === 'over' && (
          <TurnOver title={cleared ? 'All pairs found!' : "Time's up!"} score={board.score + bonus} />
        )}
      </div>
    </TurnScreen>
  );
}
