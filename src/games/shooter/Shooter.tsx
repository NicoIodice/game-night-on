import { useEffect, useEffectEvent, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { unlockAudio } from '../../core/audio/sound';
import { useMusic } from '../../core/audio/useMusic';
import { PlayerBadge } from '../../core/match/PlayerBadge';
import { defaultRng } from '../../core/random';
import type { GameProps } from '../../core/types';
import { Icon } from '../../core/ui/Icon';
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
import type { Sfx, ShooterSkin } from './skin';
import './Shooter.css';

type Phase = 'intro' | 'countdown' | 'hunting' | 'over';

const COUNTDOWN_FROM = 3;
const COUNT_MS = 700;
/** How long "Time's up!" stays on screen before the turn ends. */
const OVER_MS = 2000;
/** Seconds left when the clock starts ticking out loud. */
const TICKING_FROM = 5;

interface ShooterProps extends GameProps {
  skin: ShooterSkin;
}

/** One turn of a shooting game: hit as many targets as possible before time runs out. */
export function Shooter({ skin, theme, player, onTurnEnd, onExit }: ShooterProps) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [count, setCount] = useState(COUNTDOWN_FROM);
  const [hunt, setHunt] = useState<Hunt>(createHunt);
  const huntRef = useRef(hunt);
  const arenaRef = useRef<HTMLDivElement>(null);
  const sfxRef = useRef<Sfx | null>(null);

  useMusic(phase === 'hunting' ? (theme.music ?? null) : null);

  useEffect(() => () => sfxRef.current?.dispose(), []);

  const update = (next: Hunt) => {
    huntRef.current = next;
    setHunt(next);
  };

  const start = () => {
    void unlockAudio();
    sfxRef.current ??= skin.createSfx();
    update(createHunt());
    setCount(COUNTDOWN_FROM);
    setPhase('countdown');
  };

  useEffect(() => {
    if (phase !== 'countdown') return;
    let remaining = COUNTDOWN_FROM;
    sfxRef.current?.cue('count');
    const timer = setInterval(() => {
      remaining--;
      if (remaining > 0) {
        setCount(remaining);
        sfxRef.current?.cue('count');
      } else {
        clearInterval(timer);
        sfxRef.current?.cue('go');
        setPhase('hunting');
      }
    }, COUNT_MS);
    return () => clearInterval(timer);
  }, [phase]);

  // The game loop: one simulation step per animation frame.
  useEffect(() => {
    if (phase !== 'hunting') return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      // Capped so a hidden tab doesn't make every target jump across the arena on return.
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const before = Math.ceil(timeLeft(huntRef.current));
      const next = stepHunt(huntRef.current, dt, defaultRng);
      update(next);
      const after = Math.ceil(timeLeft(next));
      if (isOver(next)) {
        sfxRef.current?.timeUp();
        setPhase('over');
        return;
      }
      if (after < before && after <= TICKING_FROM) sfxRef.current?.cue('tick');
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  const finish = useEffectEvent(() => {
    const done = huntRef.current;
    const [one, many] = skin.hitNoun;
    onTurnEnd({
      score: done.score,
      detail: `${done.hits} ${done.hits === 1 ? one : many} · ${accuracy(done)}% accuracy · best streak ${done.bestStreak}`,
    });
  });

  useEffect(() => {
    if (phase !== 'over') return;
    const timer = setTimeout(finish, OVER_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  const fire = (event: PointerEvent<HTMLDivElement>) => {
    const arena = arenaRef.current;
    if (phase !== 'hunting' || !arena) return;
    event.preventDefault();
    const rect = arena.getBoundingClientRect();
    const point = { x: (event.clientX - rect.left) / rect.width, y: (event.clientY - rect.top) / rect.height };
    const { hunt: next, hit } = shoot(huntRef.current, point, { width: rect.width, height: rect.height });
    update(next);
    if (hit) sfxRef.current?.hit(hit.kind);
    else sfxRef.current?.miss();
  };

  if (phase === 'intro') {
    return (
      <section className={`shooter shooter--panel shooter--${skin.id}`}>
        <h2>{skin.title}</h2>
        <p className="shooter__turn">
          <PlayerBadge player={player} />, your turn!
        </p>
        <p>{skin.intro}</p>
        <ul className="shooter__legend">
          {(Object.keys(TARGET_KINDS) as TargetKind[]).map((kind) => (
            <li key={kind} className={`shooter__legend-item shooter__target--${kind}`}>
              <Icon src={skin.kinds[kind].image} />
              {skin.kinds[kind].name} <strong>{TARGET_KINDS[kind].points}</strong>
            </li>
          ))}
        </ul>
        <p className="shooter__hint">{TURN_SECONDS} seconds · streak of 5 = double points</p>
        <div className="shooter__actions">
          <button className="btn btn--primary" onClick={start} autoFocus>Start</button>
          <button className="btn" onClick={onExit}>Back</button>
        </div>
      </section>
    );
  }

  const seconds = Math.ceil(timeLeft(hunt));
  const combo = multiplier(hunt.streak);

  return (
    <section className={`shooter shooter--${skin.id}`} style={{ '--player': player.color } as CSSProperties}>
      <header className="shooter__status">
        <PlayerBadge player={player} />
        <span className="shooter__score">{hunt.score} pts</span>
        {combo > 1 && <span key={combo} className="shooter__combo">×{combo}</span>}
        <span className={`shooter__time ${seconds <= TICKING_FROM && phase === 'hunting' ? 'shooter__time--low' : ''}`}>
          {seconds}s
        </span>
        <button className="btn btn--small" onClick={onExit}>Quit</button>
      </header>

      <div className="shooter__timer" aria-hidden>
        <div className="shooter__timer-fill" style={{ width: `${(timeLeft(hunt) / TURN_SECONDS) * 100}%` }} />
      </div>

      <div ref={arenaRef} className={`shooter__arena shooter__arena--${phase}`} onPointerDown={fire}>
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

        {phase === 'countdown' && <p key={count} className="shooter__caption">{count}</p>}
        {phase === 'over' && (
          <div className="shooter__caption shooter__caption--over">
            <p>Time's up!</p>
            <p className="shooter__final">{hunt.score} points</p>
          </div>
        )}
      </div>
    </section>
  );
}
