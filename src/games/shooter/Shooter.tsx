import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { unlockAudio } from '../../core/audio/sound';
import { useMusic } from '../../core/audio/useMusic';
import { useLocale, useMessages } from '../../core/i18n/I18n';
import { plural } from '../../core/i18n/locales';
import { defaultRng } from '../../core/random';
import type { GameProps } from '../../core/types';
import { Icon } from '../../core/ui/Icon';
import { useAfter, useCountdown, useFrameLoop, secondsCrossed, OVER_MS, type TurnPhase } from '../kit/hooks';
import { Badge, StageCaption, TurnIntro, TurnOver, TurnScreen } from '../kit/TurnScreens';
import {
  accuracy,
  createHunt,
  isOver,
  multiplier,
  shoot,
  stepHunt,
  TARGET_KINDS,
  timeLeft,
  TURN_SECONDS,
  type Hunt,
  type TargetKind,
} from './hunt';
import { MESSAGES } from './messages';
import type { Sfx, ShooterSkin } from './skin';
import './Shooter.css';

/** Seconds left when the clock starts ticking out loud. */
const TICKING_FROM = 5;

interface ShooterProps extends GameProps {
  skin: ShooterSkin;
}

/** One turn of a shooting game: hit as many targets as possible before time runs out. */
export function Shooter({ skin, theme, player, onTurnEnd, onExit }: ShooterProps) {
  const locale = useLocale();
  const t = useMessages(MESSAGES);
  const [phase, setPhase] = useState<TurnPhase>('intro');
  const [hunt, setHunt] = useState<Hunt>(createHunt);
  const huntRef = useRef(hunt);
  const arenaRef = useRef<HTMLDivElement>(null);
  const sfxRef = useRef<Sfx | null>(null);

  useMusic(phase === 'playing' ? (theme.music ?? null) : null);

  useEffect(() => () => sfxRef.current?.dispose(), []);

  const update = (next: Hunt) => {
    huntRef.current = next;
    setHunt(next);
  };

  const start = () => {
    void unlockAudio();
    sfxRef.current ??= skin.createSfx();
    update(createHunt());
    setPhase('countdown');
  };

  const count = useCountdown(phase === 'countdown', () => setPhase('playing'), (cue) => sfxRef.current?.cue(cue));

  // The game loop: one simulation step per animation frame.
  useFrameLoop(phase === 'playing', (dt) => {
    const before = timeLeft(huntRef.current);
    const next = stepHunt(huntRef.current, dt, defaultRng);
    update(next);
    if (isOver(next)) {
      sfxRef.current?.timeUp();
      setPhase('over');
      return false;
    }
    const second = secondsCrossed(before, timeLeft(next));
    if (second !== null && second <= TICKING_FROM) sfxRef.current?.cue('tick');
  });

  const finish = () => {
    const done = huntRef.current;
    const [one, many] = skin.hitNoun[locale];
    onTurnEnd({
      score: done.score,
      detail: t.detail(`${done.hits} ${plural(locale, done.hits, one, many)}`, accuracy(done), done.bestStreak),
    });
  };

  useAfter(phase === 'over', OVER_MS, finish);

  const fire = (event: PointerEvent<HTMLDivElement>) => {
    const arena = arenaRef.current;
    if (phase !== 'playing' || !arena) return;
    event.preventDefault();
    const rect = arena.getBoundingClientRect();
    const point = { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height };
    const { hunt: next, hit } = shoot(huntRef.current, point, { width: rect.width, height: rect.height });
    update(next);
    if (hit) sfxRef.current?.hit(hit.kind);
    else sfxRef.current?.miss();
  };

  const className = `shooter shooter--${skin.id}`;

  if (phase === 'intro') {
    return (
      <TurnIntro
        title={skin.title[locale]}
        player={player}
        className={className}
        hint={t.hint(TURN_SECONDS)}
        onStart={start}
        onExit={onExit}
      >
        <p>{skin.intro[locale]}</p>
        <ul className="turn__legend">
          {(Object.keys(TARGET_KINDS) as TargetKind[]).map((kind) => (
            <li key={kind} className={`shooter__target--${kind}`}>
              <Icon src={skin.kinds[kind].image} />
              {skin.kinds[kind].name[locale]} <strong>{TARGET_KINDS[kind].points}</strong>
            </li>
          ))}
        </ul>
      </TurnIntro>
    );
  }

  const seconds = timeLeft(hunt);
  const combo = multiplier(hunt.streak);

  return (
    <TurnScreen
      player={player}
      className={className}
      score={hunt.score}
      extra={combo > 1 && <Badge key={combo}>×{combo}</Badge>}
      seconds={seconds}
      timeLeft={seconds / TURN_SECONDS}
      hurry={Math.ceil(seconds) <= TICKING_FROM && phase === 'playing'}
      onExit={onExit}
    >
      <div ref={arenaRef} className={`turn__stage shooter__arena shooter__arena--${phase}`} onPointerDown={fire}>
        {hunt.targets.map((target) => (
          <span
            key={target.id}
            className={`shooter__target shooter__target--${target.kind}`}
            style={
              { left: `${target.x * 100}%`, top: `${target.y * 100}%`, '--size': TARGET_KINDS[target.kind].size } as CSSProperties
            }
          >
            <Icon src={skin.kinds[target.kind].image} />
          </span>
        ))}

        {hunt.effects.map((effect) => (
          <span
            key={effect.id}
            className={`shooter__shot ${effect.points === null ? 'shooter__shot--miss' : 'shooter__shot--hit'}`}
            style={{ left: `${effect.x * 100}%`, top: `${effect.y * 100}%` }}
          >
            {effect.points !== null && <span className="shooter__points">+{effect.points}</span>}
          </span>
        ))}

        {phase === 'countdown' && (
          <StageCaption key={count}>
            <p>{count}</p>
          </StageCaption>
        )}
        {phase === 'over' && <TurnOver score={hunt.score} />}
      </div>
    </TurnScreen>
  );
}
