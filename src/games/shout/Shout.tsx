import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { openMicMeter, type MicMeter } from '../../core/audio/micMeter';
import type { GameProps } from '../../core/types';
import { Icon } from '../../core/ui/Icon';
import { OVER_MS, useAfter, useCountdown, useFrameLoop, useThemeSounds } from '../kit/hooks';
import { StageCaption, TurnIntro, TurnOver, TurnScreen } from '../kit/TurnScreens';
import { DEFAULT_SECONDS, meterFill, noiseFloor, scoreShout, toLevel, type Reading } from './loudness';
import { rankFor, type ShoutSkin } from './skin';
import './Shout.css';

/** 'asking': waiting for the microphone. 'blocked': no microphone, so the turn can only be skipped. */
type Phase = 'intro' | 'asking' | 'blocked' | 'countdown' | 'playing' | 'over';

const BLOCKED_REASON = {
  unsupported: "This browser can't use the microphone. Try Chrome, Edge or Safari.",
  denied: 'Microphone access was blocked, so we can’t hear you.',
};

interface ShoutProps extends GameProps {
  skin: ShoutSkin;
}

/** One turn of a shouting game: be as loud as you can, for as long as you can. */
export function Shout({ skin, theme, player, options, onTurnEnd, onExit }: ShoutProps) {
  const seconds = options.seconds ?? DEFAULT_SECONDS;
  const [phase, setPhase] = useState<Phase>('intro');
  const [blocked, setBlocked] = useState<keyof typeof BLOCKED_REASON>('denied');
  const [fill, setFill] = useState(0);
  const [best, setBest] = useState(0);
  const [left, setLeft] = useState(seconds);
  const [score, setScore] = useState(0);
  const mic = useRef<MicMeter | null>(null);
  const quiet = useRef<Reading[]>([]);
  const shout = useRef<Reading[]>([]);
  const floor = useRef(0);
  const resultRef = useRef({ score: 0, peak: 0, loudSeconds: 0 });
  const sounds = useThemeSounds(theme);

  /** False once the turn is left, so a microphone that opens late gets closed straight away. */
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      mic.current?.close();
    };
  }, []);

  const start = async () => {
    if (phase === 'asking') return;
    sounds();
    setPhase('asking');
    const result = await openMicMeter();
    if (!alive.current) {
      if (typeof result !== 'string') result.close();
      return;
    }
    if (typeof result === 'string') {
      setBlocked(result);
      setPhase('blocked');
      return;
    }
    mic.current = result;
    quiet.current = [];
    setPhase('countdown');
  };

  const count = useCountdown(
    phase === 'countdown',
    () => {
      floor.current = noiseFloor(quiet.current);
      shout.current = [];
      setPhase('playing');
    },
    (cue) => sounds().cue(cue),
  );

  // Listens every frame: to the room while counting down, then to the shout.
  useFrameLoop(phase === 'countdown' || phase === 'playing', (dt) => {
    const level = toLevel(mic.current?.readDb() ?? -Infinity);
    if (phase === 'countdown') {
      quiet.current.push({ level, dt });
      return;
    }
    shout.current.push({ level, dt });
    const now = meterFill(level, floor.current);
    setFill(now);
    setBest((previous) => Math.max(previous, now));
    const remaining = Math.max(0, seconds - shout.current.reduce((sum, r) => sum + r.dt, 0));
    setLeft(remaining);
    if (remaining === 0) {
      mic.current?.close();
      mic.current = null;
      const result = scoreShout(shout.current, floor.current, seconds);
      resultRef.current = result;
      setScore(result.score);
      setFill(0);
      sounds().good(result.score >= 700 ? 2 : result.score >= 300 ? 1 : 0);
      setPhase('over');
      return false;
    }
  });

  useAfter(phase === 'over', OVER_MS + 500, () => {
    const { score: points, peak, loudSeconds } = resultRef.current;
    onTurnEnd({
      score: points,
      detail: `${rankFor(skin, points)} · peak ${Math.round(peak * 100)}% · ${loudSeconds.toFixed(1)}s loud`,
    });
  });

  const className = `shout shout--${skin.id}`;

  if (phase === 'intro' || phase === 'asking' || phase === 'blocked') {
    return (
      <TurnIntro
        title={skin.title}
        player={player}
        className={className}
        hint={
          phase === 'blocked'
            ? BLOCKED_REASON[blocked]
            : phase === 'asking'
              ? 'If your browser asks, allow the microphone.'
              : `Quiet during the countdown, then ${seconds} seconds to be loud · uses your microphone`
        }
        startLabel={phase === 'blocked' ? 'Try again' : 'Start'}
        onStart={() => void start()}
        onExit={onExit}
      >
        <p>{skin.intro}</p>
        <div className="shout__preview" aria-hidden>
          <Icon src={skin.mascot} />
        </div>
        {phase === 'blocked' && (
          <button className="btn" onClick={() => onTurnEnd({ score: 0, detail: 'Skipped: no microphone' })}>
            Skip this turn (0 points)
          </button>
        )}
      </TurnIntro>
    );
  }

  return (
    <TurnScreen
      player={player}
      className={className}
      score={score}
      seconds={phase === 'playing' ? left : undefined}
      timeLeft={phase === 'playing' ? left / seconds : undefined}
      onExit={onExit}
    >
      <div className={`turn__stage shout__stage shout__stage--${phase}`}>
        <div className="shout__layout">
          <div className="shout__meter" style={{ '--fill': fill, '--best': best } as CSSProperties}>
            <div className="shout__fill" />
            <div className="shout__best" aria-hidden />
            <Icon src={skin.mascot} className="shout__mascot" />
          </div>
          <div className="shout__side">
            {phase === 'playing' && <p className="shout__call">{skin.call}</p>}
            {phase === 'countdown' && <p className="shout__hush">Shh… quiet for a moment</p>}
          </div>
        </div>
        {phase === 'countdown' && (
          <StageCaption key={count}>
            <p>{count}</p>
          </StageCaption>
        )}
        {phase === 'over' && <TurnOver title={rankFor(skin, score)} score={score} />}
      </div>
    </TurnScreen>
  );
}
