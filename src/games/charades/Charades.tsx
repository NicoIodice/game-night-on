import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { useLocale, useMessages } from '../../core/i18n/I18n';
import type { Locale } from '../../core/i18n/locales';
import { defaultRng } from '../../core/random';
import type { GameProps } from '../../core/types';
import { Icon } from '../../core/ui/Icon';
import { OVER_MS, secondsCrossed, useAfter, useCountdown, useFrameLoop, useThemeSounds, type TurnPhase } from '../kit/hooks';
import { StageCaption, TurnIntro, TurnOver, TurnScreen } from '../kit/TurnScreens';
import { MESSAGES } from './messages';
import type { CharadesSkin } from './skin';
import { createWordBag, DEFAULT_SECONDS, POINTS_PER_WORD, scoreTally, type Tally, type WordBag } from './words';
import './Charades.css';

const TICKING_FROM = 10;

/** One bag of words per game and language for the whole night, so nobody gets a word someone already acted. */
const bags = new Map<string, WordBag>();

function bagFor(skin: CharadesSkin, locale: Locale): WordBag {
  const key = `${skin.id}:${locale}`;
  let bag = bags.get(key);
  if (!bag) {
    bag = createWordBag(skin.words[locale], defaultRng);
    bags.set(key, bag);
  }
  return bag;
}

interface CharadesProps extends GameProps {
  skin: CharadesSkin;
}

/** One turn of charades: act out as many words as the others can guess before time runs out. */
export function Charades({ skin, theme, player, options, onTurnEnd, onExit }: CharadesProps) {
  const locale = useLocale();
  const t = useMessages(MESSAGES);
  const seconds = options.seconds ?? DEFAULT_SECONDS;
  const [phase, setPhase] = useState<TurnPhase>('intro');
  const [word, setWord] = useState('');
  const [tally, setTally] = useState<Tally>({ guessed: [], skipped: [] });
  const [left, setLeft] = useState(seconds);
  const leftRef = useRef(seconds);
  const sounds = useThemeSounds(theme);

  const count = useCountdown(
    phase === 'countdown',
    () => {
      setWord(bagFor(skin, locale).draw());
      setPhase('playing');
    },
    (cue) => sounds().cue(cue),
  );

  useFrameLoop(phase === 'playing', (dt) => {
    const before = leftRef.current;
    const after = Math.max(0, before - dt);
    leftRef.current = after;
    setLeft(after);
    if (after === 0) {
      sounds().timeUp();
      setPhase('over');
      return false;
    }
    const second = secondsCrossed(before, after);
    if (second !== null && second <= TICKING_FROM) sounds().cue('tick');
  });

  useAfter(phase === 'over', OVER_MS, () => {
    const { guessed, skipped } = tally;
    onTurnEnd({
      score: scoreTally(tally),
      detail: t.detail(guessed.length, skipped.length),
    });
  });

  const next = (got: boolean) => {
    if (phase !== 'playing') return;
    setTally((previous) =>
      got ? { ...previous, guessed: [...previous.guessed, word] } : { ...previous, skipped: [...previous.skipped, word] },
    );
    if (got) sounds().good(0);
    else sounds().tap();
    setWord(bagFor(skin, locale).draw());
  };

  // Right arrow or Enter: got it. Left arrow: skip.
  const onKey = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' || event.key === 'Enter') next(true);
    else if (event.key === 'ArrowLeft') next(false);
    else return;
    event.preventDefault();
  });
  useEffect(() => {
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const className = `charades charades--${skin.id}`;

  if (phase === 'intro') {
    return (
      <TurnIntro
        title={skin.title[locale]}
        player={player}
        className={className}
        hint={t.hint(seconds, POINTS_PER_WORD)}
        startLabel={t.showWord}
        onStart={() => {
          sounds();
          setPhase('countdown');
        }}
        onExit={onExit}
      >
        <p>{skin.intro[locale]}</p>
        <p className="charades__secret">
          <Icon src={skin.icon} />
          <span>{t.secret}</span>
        </p>
      </TurnIntro>
    );
  }

  return (
    <TurnScreen
      player={player}
      className={className}
      score={scoreTally(tally)}
      extra={<span className="charades__count">{t.guessed(tally.guessed.length)}</span>}
      seconds={left}
      timeLeft={left / seconds}
      hurry={Math.ceil(left) <= TICKING_FROM && phase === 'playing'}
      onExit={onExit}
    >
      <div className={`turn__stage charades__stage charades__stage--${phase}`}>
        {phase === 'playing' && (
          <>
            <div key={word} className="charades__card">
              <Icon src={skin.icon} className="charades__icon" />
              <p className="charades__word" aria-live="polite">{word}</p>
            </div>
            <div className="charades__buttons">
              <button className="charades__btn charades__btn--skip" onClick={() => next(false)}>{t.skip}</button>
              <button className="charades__btn charades__btn--got" onClick={() => next(true)}>{t.gotIt}</button>
            </div>
          </>
        )}
        {phase === 'countdown' && (
          <StageCaption key={count}>
            <p>{count}</p>
          </StageCaption>
        )}
        {phase === 'over' && <TurnOver score={scoreTally(tally)} />}
      </div>
    </TurnScreen>
  );
}
