import type { CSSProperties } from 'react';
import { useLocale, useMessages } from '../i18n/I18n';
import type { Roster, RosterKind } from '../types';
import { Icon } from '../ui/Icon';
import person from '../ui/icons/person.svg';
import team from '../ui/icons/team.svg';
import { MESSAGES } from './messages';
import { defaultName, MAX_NAME_LENGTH, MAX_PLAYERS, MIN_PLAYERS, renamePlayer, resizeRoster, setRosterKind } from './roster';

interface PlayerSetupProps {
  /** The game's name, or the tournament's. */
  title: string;
  description: string;
  roster: Roster;
  onChange: (roster: Roster) => void;
  onStart: () => void;
  onBack: () => void;
}

const KINDS: { kind: RosterKind; icon: string }[] = [
  { kind: 'players', icon: person },
  { kind: 'teams', icon: team },
];

export function PlayerSetup({ title, description, roster, onChange, onStart, onBack }: PlayerSetupProps) {
  const locale = useLocale();
  const t = useMessages(MESSAGES);
  const count = roster.players.length;

  return (
    <section className="match match--panel">
      <h2>{title}</h2>
      <p>{description}</p>

      <div className="setup__kinds" role="radiogroup" aria-label={t.playAs}>
        {KINDS.map(({ kind, icon }) => (
          <button
            key={kind}
            role="radio"
            aria-checked={roster.kind === kind}
            className={`setup__kind ${roster.kind === kind ? 'setup__kind--on' : ''}`}
            onClick={() => onChange(setRosterKind(roster, kind, locale))}
          >
            <Icon src={icon} />
            {kind === 'teams' ? t.teams : t.players}
          </button>
        ))}
      </div>

      <div className="setup__count">
        <button
          className="btn setup__step"
          onClick={() => onChange(resizeRoster(roster, count - 1, locale))}
          disabled={count <= MIN_PLAYERS}
          aria-label={t.oneLess(roster.kind)}
        >
          −
        </button>
        <span aria-live="polite">
          <strong>{count}</strong> {t.count(roster.kind, count)}
        </span>
        <button
          className="btn setup__step"
          onClick={() => onChange(resizeRoster(roster, count + 1, locale))}
          disabled={count >= MAX_PLAYERS}
          aria-label={t.oneMore(roster.kind)}
        >
          +
        </button>
      </div>

      <ol className="setup__players">
        {roster.players.map((player, seat) => (
          <li key={player.id} className="setup__player" style={{ '--player': player.color } as CSSProperties}>
            <span className="player-badge__dot" aria-hidden>{seat + 1}</span>
            <input
              className="setup__name"
              value={player.name}
              maxLength={MAX_NAME_LENGTH}
              placeholder={defaultName(roster.kind, seat, locale)}
              aria-label={t.nameOf(roster.kind, seat + 1)}
              onChange={(event) => onChange(renamePlayer(roster, seat, event.target.value))}
              onFocus={(event) => event.target.select()}
            />
          </li>
        ))}
      </ol>

      <p className="match__hint">
        {count === 1 ? t.solo : t.howTurnsGo(roster.kind)}
      </p>

      <div className="match__actions">
        <button className="btn btn--primary" onClick={onStart}>{t.start}</button>
        <button className="btn" onClick={onBack}>{t.back}</button>
      </div>
    </section>
  );
}
