import { useEffect, useEffectEvent, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { useMusic } from '../../core/audio/useMusic';
import { useLocale, useMessages } from '../../core/i18n/I18n';
import { plural } from '../../core/i18n/locales';
import { defaultRng } from '../../core/random';
import type { GameProps } from '../../core/types';
import { Icon } from '../../core/ui/Icon';
import { OVER_MS, secondsCrossed, useAfter, useCountdown, useFrameLoop, useThemeSounds, type TurnPhase } from '../kit/hooks';
import { StageCaption, TurnIntro, TurnOver, TurnScreen } from '../kit/TurnScreens';
import {
  createDash,
  DEFAULT_SECONDS,
  isOver,
  isSafe,
  jump,
  LIVES,
  OBSTACLES,
  POINTS_PER_TREAT,
  RUNNER_X,
  scoreDash,
  stepDash,
  type Dash,
  type ObstacleKind,
} from './dash';
import { MESSAGES } from './messages';
import type { RunnerSkin } from './skin';
import './Runner.css';

const TICKING_FROM = 5;

interface RunnerProps extends GameProps {
  skin: RunnerSkin;
}

/** One turn of a running game: jump the obstacles and grab treats until time or lives run out. */
export function Runner({ skin, theme, player, options, onTurnEnd, onExit }: RunnerProps) {
  const locale = useLocale();
  const t = useMessages(MESSAGES);
  const seconds = options.seconds ?? DEFAULT_SECONDS;
  const [phase, setPhase] = useState<TurnPhase>('intro');
  const [dash, setDash] = useState<Dash>(createDash);
  const dashRef = useRef(dash);
  const sounds = useThemeSounds(theme);

  useMusic(phase === 'playing' ? (theme.music ?? null) : null);

  const update = (next: Dash) => {
    dashRef.current = next;
    setDash(next);
  };

  const count = useCountdown(phase === 'countdown', () => setPhase('playing'), (cue) => sounds().cue(cue));

  useFrameLoop(phase === 'playing', (dt) => {
    const before = dashRef.current;
    const next = stepDash(before, dt, defaultRng, seconds);
    update(next);
    if (next.bumps > before.bumps) sounds().bad();
    if (next.treatsTaken > before.treatsTaken) sounds().good(0);
    if (isOver(next, seconds)) {
      sounds().timeUp();
      setPhase('over');
      return false;
    }
    const second = secondsCrossed(seconds - before.time, seconds - next.time);
    if (second !== null && second <= TICKING_FROM) sounds().cue('tick');
  });

  useAfter(phase === 'over', OVER_MS, () => {
    const done = dashRef.current;
    const [one, many] = skin.treatNoun[locale];
    onTurnEnd({
      score: scoreDash(done),
      detail: [
        t.distance(done.distance),
        `${done.treatsTaken} ${plural(locale, done.treatsTaken, one, many)}`,
        t.bumps(done.bumps),
      ].join(' · '),
    });
  });

  const hop = () => {
    if (phase !== 'playing') return;
    const before = dashRef.current;
    const next = jump(before);
    update(next);
    if (next.vy > before.vy) sounds().tap();
  };

  // Space, up arrow or W jumps too.
  const onKey = useEffectEvent((event: KeyboardEvent) => {
    if (event.repeat || ![' ', 'ArrowUp', 'w', 'W'].includes(event.key)) return;
    event.preventDefault();
    hop();
  });
  useEffect(() => {
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const className = `runner runner--${skin.id}`;

  if (phase === 'intro') {
    return (
      <TurnIntro
        title={skin.title[locale]}
        player={player}
        className={className}
        hint={t.hint(seconds, LIVES)}
        onStart={() => {
          sounds();
          update(createDash());
          setPhase('countdown');
        }}
        onExit={onExit}
      >
        <p>{skin.intro[locale]}</p>
        <ul className="turn__legend">
          <li className="runner__legend-runner">
            <Icon src={skin.runner} />
            {t.you}
          </li>
          {(Object.keys(OBSTACLES) as ObstacleKind[]).map((kind) => (
            <li key={kind} className={`runner__legend-obstacle runner__obstacle--${kind}`}>
              <Icon src={skin.obstacles[kind].image} />
              {skin.obstacles[kind].name[locale]} <strong>{t.jump}</strong>
            </li>
          ))}
          <li className="runner__legend-treat">
            <Icon src={skin.treat.image} />
            {skin.treat.name[locale]} <strong>+{POINTS_PER_TREAT}</strong>
          </li>
        </ul>
      </TurnIntro>
    );
  }

  const left = Math.max(0, seconds - dash.time);

  return (
    <TurnScreen
      player={player}
      className={className}
      score={scoreDash(dash)}
      extra={
        <span className="runner__lives" aria-label={t.lives(dash.lives)}>
          {Array.from({ length: LIVES }, (_, i) => (
            <Icon key={i} src={skin.runner} className={i < dash.lives ? '' : 'runner__life--lost'} />
          ))}
        </span>
      }
      seconds={left}
      timeLeft={left / seconds}
      hurry={Math.ceil(left) <= TICKING_FROM && phase === 'playing'}
      onExit={onExit}
    >
      <div
        className={`turn__stage runner__stage runner__stage--${phase}`}
        style={{ '--distance': dash.distance } as CSSProperties}
        onPointerDown={(event: PointerEvent) => {
          event.preventDefault();
          hop();
        }}
      >
        <div className="runner__far" aria-hidden />
        <div className="runner__ground" aria-hidden />

        {dash.treats.map((treat) => (
          <span
            key={treat.id}
            className={`runner__thing runner__treat ${treat.taken ? 'runner__treat--taken' : ''}`}
            style={{ left: `${treat.x * 100}%`, '--lift': treat.height } as CSSProperties}
          >
            <Icon src={skin.treat.image} />
          </span>
        ))}

        {dash.obstacles.map((obstacle) => (
          <span
            key={obstacle.id}
            className={`runner__thing runner__obstacle runner__obstacle--${obstacle.kind}`}
            style={{ left: `${obstacle.x * 100}%`, '--size': OBSTACLES[obstacle.kind].height } as CSSProperties}
          >
            <Icon src={skin.obstacles[obstacle.kind].image} />
          </span>
        ))}

        <span
          className={`runner__thing runner__hero ${isSafe(dash) ? 'runner__hero--safe' : ''} ${dash.y > 0 ? 'runner__hero--air' : ''}`}
          style={{ left: `${RUNNER_X * 100}%`, '--lift': dash.y } as CSSProperties}
        >
          <Icon src={skin.runner} />
        </span>

        {phase === 'countdown' && (
          <StageCaption key={count}>
            <p>{count}</p>
          </StageCaption>
        )}
        {phase === 'over' && <TurnOver title={dash.lives > 0 ? undefined : t.outOfLives} score={scoreDash(dash)} />}
      </div>
    </TurnScreen>
  );
}
