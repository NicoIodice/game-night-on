import { useEffect, useEffectEvent, useRef, useState, type CSSProperties } from 'react';
import { useLocale, useMessages } from '../../core/i18n/I18n';
import { defaultRng } from '../../core/random';
import type { GameProps } from '../../core/types';
import { Icon } from '../../core/ui/Icon';
import { OVER_MS, useAfter, useThemeSounds, type TurnPhase } from '../kit/hooks';
import { Badge, TurnIntro, TurnOver, TurnScreen } from '../kit/TurnScreens';
import {
  createSequence,
  DEFAULT_LIVES,
  DEFAULT_PADS,
  DEFAULT_STEP_MS,
  extend,
  MAX_LENGTH,
  press,
  stepMs,
  type Sequence,
} from './sequence';
import { MESSAGES } from './messages';
import type { SequenceSkin } from './skin';
import './SequenceGame.css';

/** 'show': the game plays the sequence. 'input': the player repeats it. 'pause': a beat between the two. */
type Mode = 'show' | 'input' | 'pause';

const PRESS_MS = 220;
const BEFORE_SHOW_MS = 700;

interface SequenceGameProps extends GameProps {
  skin: SequenceSkin;
}

/** One turn of a sequence game: watch the pads light up, then press them back in order. */
export function SequenceGame({ skin, theme, player, options, onTurnEnd, onExit }: SequenceGameProps) {
  const locale = useLocale();
  const t = useMessages(MESSAGES);
  const pads = skin.pads.slice(0, Math.min(skin.pads.length, options.pads ?? DEFAULT_PADS));
  const baseMs = options.flash ?? DEFAULT_STEP_MS;

  const [phase, setPhase] = useState<TurnPhase>('intro');
  const [mode, setMode] = useState<Mode>('pause');
  const [sequence, setSequence] = useState<Sequence>(() => createSequence(pads.length, options.lives ?? DEFAULT_LIVES, defaultRng));
  const [lit, setLit] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  /** Bumped to play the sequence (again). */
  const [showings, setShowings] = useState(0);
  const [won, setWon] = useState(false);
  const sequenceRef = useRef(sequence);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const sounds = useThemeSounds(theme);

  const later = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const update = (next: Sequence) => {
    sequenceRef.current = next;
    setSequence(next);
  };

  // Plays the sequence: each pad lights up with its note, a little quicker as the sequence grows.
  const playSequence = useEffectEvent(() => {
    const { steps } = sequenceRef.current;
    const ms = stepMs(steps.length, baseMs);
    const handles = steps.flatMap((pad, i) => {
      const at = BEFORE_SHOW_MS + i * ms;
      return [
        setTimeout(() => {
          setLit(pad);
          sounds().note(pads[pad].note, (ms * 0.7) / 1000);
        }, at),
        setTimeout(() => setLit(null), at + ms * 0.7),
      ];
    });
    handles.push(
      setTimeout(() => {
        setMode('input');
        setMessage(t.yourTurn);
      }, BEFORE_SHOW_MS + steps.length * ms),
    );
    return handles;
  });

  useEffect(() => {
    if (showings === 0) return;
    const handles = playSequence();
    return () => handles.forEach(clearTimeout);
  }, [showings]);

  const show = (text = t.watch) => {
    setMode('show');
    setMessage(text);
    setShowings((n) => n + 1);
  };

  const start = () => {
    sounds();
    setPhase('playing');
    show();
  };

  const end = (title: boolean) => {
    setWon(title);
    setMode('pause');
    setPhase('over');
  };

  const pressPad = (pad: number) => {
    if (phase !== 'playing' || mode !== 'input') return;
    setLit(pad);
    later(PRESS_MS, () => setLit((current) => (current === pad ? null : current)));
    const { sequence: next, outcome } = press(sequenceRef.current, pad);
    update(next);

    if (outcome === 'step') {
      sounds().note(pads[pad].note, PRESS_MS / 1000);
      return;
    }
    setMode('pause');
    if (outcome === 'repeated') {
      sounds().note(pads[pad].note, PRESS_MS / 1000);
      later(250, () => sounds().good(next.steps.length >= 8 ? 1 : 0));
      setMessage(t.wellDone);
      later(900, () => {
        update(extend(sequenceRef.current, defaultRng));
        show();
      });
    } else if (outcome === 'slip') {
      sounds().bad();
      setMessage(t.oops);
      later(1200, () => show(t.watchAgain));
    } else if (outcome === 'out') {
      sounds().bad();
      later(400, () => sounds().timeUp());
      end(false);
    } else {
      sounds().good(2);
      end(true);
    }
  };

  // Number keys press the pads: 1 for the first one, and so on.
  const onKey = useEffectEvent((event: KeyboardEvent) => {
    const pad = Number(event.key) - 1;
    if (Number.isInteger(pad) && pad >= 0 && pad < pads.length) pressPad(pad);
  });
  useEffect(() => {
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useAfter(phase === 'over', OVER_MS, () => {
    const done = sequenceRef.current;
    onTurnEnd({
      score: done.score,
      detail: t.detail(done.best, done.slips),
    });
  });

  const className = `sequence sequence--${skin.id}`;

  if (phase === 'intro') {
    return (
      <TurnIntro
        title={skin.title[locale]}
        player={player}
        className={className}
        hint={t.hint(pads.length, options.lives ?? DEFAULT_LIVES)}
        onStart={start}
        onExit={onExit}
      >
        <p>{skin.intro[locale]}</p>
        <ul className="turn__legend">
          {pads.map((pad) => (
            <li key={pad.note} style={{ '--item': pad.color } as CSSProperties}>
              <Icon src={pad.image} />
              {pad.name[locale]}
            </li>
          ))}
        </ul>
      </TurnIntro>
    );
  }

  const livesLeft = sequence.lives + (phase === 'over' && !won ? 0 : 1);

  return (
    <TurnScreen
      player={player}
      className={className}
      score={sequence.score}
      extra={
        <>
          <Badge key={sequence.steps.length}>{t.steps(sequence.steps.length)}</Badge>
          <span className="sequence__lives">{t.lives(livesLeft)}</span>
        </>
      }
      onExit={onExit}
    >
      <div className={`turn__stage sequence__stage sequence__stage--${mode}`}>
        <div className="sequence__ring" style={{ '--pads': pads.length } as CSSProperties}>
          {pads.map((pad, i) => (
            <button
              key={pad.note}
              className={`sequence__pad ${lit === i ? 'sequence__pad--lit' : ''}`}
              style={{ '--i': i, '--pad': pad.color } as CSSProperties}
              onPointerDown={(event) => {
                event.preventDefault();
                pressPad(i);
              }}
              // Enter or Space on a focused pad (pointer presses are handled above).
              onClick={(event) => event.detail === 0 && pressPad(i)}
              disabled={phase !== 'playing'}
              aria-label={t.pad(pad.name[locale], i + 1)}
            >
              <Icon src={pad.image} />
            </button>
          ))}
          <div className="sequence__center">
            <Icon src={skin.center} className="sequence__center-icon" />
            <p key={message} className="sequence__message" aria-live="polite">{message}</p>
            {mode === 'input' && (
              <p className="sequence__progress">
                {sequence.entered} / {sequence.steps.length}
              </p>
            )}
          </div>
        </div>
        {phase === 'over' && (
          <TurnOver title={won ? t.allInARow(MAX_LENGTH) : skin.outTitle[locale]} score={sequence.score} />
        )}
      </div>
    </TurnScreen>
  );
}
