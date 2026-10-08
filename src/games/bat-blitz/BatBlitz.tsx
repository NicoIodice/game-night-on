import { useEffect, useEffectEvent, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { unlockAudio } from '../../core/audio/sound';
import { useMusic } from '../../core/audio/useMusic';
import { PlayerBadge } from '../../core/match/PlayerBadge';
import { defaultRng } from '../../core/random';
import type { GameProps } from '../../core/types';
import { Icon } from '../../core/ui/Icon';
import goldenBat from './assets/golden-bat.svg';
import swiftBat from './assets/swift-bat.svg';
import {
  accuracy,
  BAT_KINDS,
  createHunt,
  isOver,
  multiplier,
  shoot,
  stepHunt,
  timeLeft,
  TURN_SECONDS,
  type BatKind,
  type Hunt,
} from './hunt';
import { createSfx, type Sfx } from './sfx';
import './BatBlitz.css';

type Phase = 'intro' | 'countdown' | 'hunting' | 'over';

const COUNTDOWN_FROM = 3;
const COUNT_MS = 700;
/** How long "Time's up!" stays on screen before the turn ends. */
const OVER_MS = 2000;
/** Seconds left when the clock starts ticking out loud. */
const TICKING_FROM = 5;

const KIND_NAMES: Record<BatKind, string> = { bat: 'Bat', swift: 'Swift bat', golden: 'Vampire bat' };

export function BatBlitz({ theme, player, onTurnEnd, onExit }: GameProps) {
  const batImage = theme.decks.flat().find((card) => card.id === 'bat')?.image ?? '';
  const images: Record<BatKind, string> = { bat: batImage, swift: swiftBat, golden: goldenBat };

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
    sfxRef.current ??= createSfx();
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
      // Capped so a hidden tab doesn't make every bat jump across the cave on return.
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
    onTurnEnd({
      score: done.score,
      detail: `${done.hits} ${done.hits === 1 ? 'bat' : 'bats'} · ${accuracy(done)}% accuracy · best streak ${done.bestStreak}`,
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
      <section className="bb bb--panel">
        <h2>Bat Blitz</h2>
        <p className="bb__turn">
          <PlayerBadge player={player} />, your turn!
        </p>
        <p>
          The cave is swarming! Tap or click bats to zap them before they fly away. Hit several in a row to multiply
          your points, but a miss breaks the streak.
        </p>
        <ul className="bb__legend">
          {(Object.keys(BAT_KINDS) as BatKind[]).map((kind) => (
            <li key={kind} className={`bb__legend-item bb__bat--${kind}`}>
              <Icon src={images[kind]} />
              {KIND_NAMES[kind]} <strong>{BAT_KINDS[kind].points}</strong>
            </li>
          ))}
        </ul>
        <p className="bb__hint">{TURN_SECONDS} seconds · streak of 5 = double points</p>
        <div className="bb__actions">
          <button className="btn btn--primary" onClick={start} autoFocus>Start</button>
          <button className="btn" onClick={onExit}>Back</button>
        </div>
      </section>
    );
  }

  const seconds = Math.ceil(timeLeft(hunt));
  const combo = multiplier(hunt.streak);

  return (
    <section className="bb" style={{ '--player': player.color } as CSSProperties}>
      <header className="bb__status">
        <PlayerBadge player={player} />
        <span className="bb__score">{hunt.score} pts</span>
        {combo > 1 && <span key={combo} className="bb__combo">×{combo}</span>}
        <span className={`bb__time ${seconds <= TICKING_FROM && phase === 'hunting' ? 'bb__time--low' : ''}`}>
          {seconds}s
        </span>
        <button className="btn btn--small" onClick={onExit}>Quit</button>
      </header>

      <div className="bb__timer" aria-hidden>
        <div className="bb__timer-fill" style={{ width: `${(timeLeft(hunt) / TURN_SECONDS) * 100}%` }} />
      </div>

      <div ref={arenaRef} className={`bb__cave bb__cave--${phase}`} onPointerDown={fire}>
        {hunt.bats.map((bat) => (
          <span
            key={bat.id}
            className={`bb__bat bb__bat--${bat.kind}`}
            style={{ left: `${bat.x * 100}%`, top: `${bat.y * 100}%`, '--size': BAT_KINDS[bat.kind].size } as CSSProperties}
          >
            <Icon src={images[bat.kind]} />
          </span>
        ))}

        {hunt.effects.map((effect) => (
          <span
            key={effect.id}
            className={`bb__shot ${effect.points === null ? 'bb__shot--miss' : 'bb__shot--hit'}`}
            style={{ left: `${effect.x * 100}%`, top: `${effect.y * 100}%` }}
          >
            {effect.points !== null && <span className="bb__points">+{effect.points}</span>}
          </span>
        ))}

        {phase === 'countdown' && <p key={count} className="bb__caption">{count}</p>}
        {phase === 'over' && (
          <div className="bb__caption bb__caption--over">
            <p>Time's up!</p>
            <p className="bb__final">{hunt.score} points</p>
          </div>
        )}
      </div>
    </section>
  );
}
