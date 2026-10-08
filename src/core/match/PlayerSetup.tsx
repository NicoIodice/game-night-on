import type { CSSProperties } from 'react';
import type { Roster, RosterKind } from '../types';
import { Icon } from '../ui/Icon';
import person from '../ui/icons/person.svg';
import team from '../ui/icons/team.svg';
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

const KINDS: { kind: RosterKind; label: string; icon: string }[] = [
  { kind: 'players', label: 'Players', icon: person },
  { kind: 'teams', label: 'Teams', icon: team },
];

export function PlayerSetup({ title, description, roster, onChange, onStart, onBack }: PlayerSetupProps) {
  const count = roster.players.length;
  const noun = roster.kind === 'teams' ? 'team' : 'player';

  return (
    <section className="match match--panel">
      <h2>{title}</h2>
      <p>{description}</p>

      <div className="setup__kinds" role="radiogroup" aria-label="Play as">
        {KINDS.map(({ kind, label, icon }) => (
          <button
            key={kind}
            role="radio"
            aria-checked={roster.kind === kind}
            className={`setup__kind ${roster.kind === kind ? 'setup__kind--on' : ''}`}
            onClick={() => onChange(setRosterKind(roster, kind))}
          >
            <Icon src={icon} />
            {label}
          </button>
        ))}
      </div>

      <div className="setup__count">
        <button
          className="btn setup__step"
          onClick={() => onChange(resizeRoster(roster, count - 1))}
          disabled={count <= MIN_PLAYERS}
          aria-label={`One ${noun} less`}
        >
          −
        </button>
        <span aria-live="polite">
          <strong>{count}</strong> {count === 1 ? noun : `${noun}s`}
        </span>
        <button
          className="btn setup__step"
          onClick={() => onChange(resizeRoster(roster, count + 1))}
          disabled={count >= MAX_PLAYERS}
          aria-label={`One more ${noun}`}
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
              placeholder={defaultName(roster.kind, seat)}
              aria-label={`Name of ${noun} ${seat + 1}`}
              onChange={(event) => onChange(renamePlayer(roster, seat, event.target.value))}
              onFocus={(event) => event.target.select()}
            />
          </li>
        ))}
      </ol>

      <p className="match__hint">
        {count === 1 ? 'Solo game.' : `Each ${noun} plays a turn, then passes the device on. Highest score wins!`}
      </p>

      <div className="match__actions">
        <button className="btn btn--primary" onClick={onStart}>Start</button>
        <button className="btn" onClick={onBack}>Back</button>
      </div>
    </section>
  );
}
