import type { GameDefinition, Theme } from '../types';
import {
  defaultLineup,
  enabledCount,
  gameOptions,
  moveGame,
  setGameOption,
  setLineupMode,
  toggleGame,
  type Lineup,
  type LineupMode,
} from './lineup';

interface LineupSettingsProps {
  theme: Theme;
  /** The theme's games, in menu order. */
  games: GameDefinition[];
  lineup: Lineup;
  onChange: (lineup: Lineup) => void;
  onDone: () => void;
}

const MODES: { mode: LineupMode; label: string; hint: string }[] = [
  { mode: 'single', label: 'One game at a time', hint: 'Pick any game from the menu. Each game has its own scoreboard.' },
  {
    mode: 'tournament',
    label: 'Tournament',
    hint: 'Everyone plays every game below, in order. Each game has its scoreboard, and the scores add up to a final winner.',
  },
];

/** Sets up the night: how it's scored, which games are played and in what order, and each game's settings. */
export function LineupSettings({ theme, games, lineup, onChange, onDone }: LineupSettingsProps) {
  const lastOne = enabledCount(lineup) === 1;
  const configurable = games.filter((game) => game.options?.length || game.Settings);

  return (
    <section className="match match--panel">
      <h2>Game night settings</h2>

      <div className="setup__kinds" role="radiogroup" aria-label="Scoring">
        {MODES.map(({ mode, label }) => (
          <button
            key={mode}
            role="radio"
            aria-checked={lineup.mode === mode}
            className={`setup__kind ${lineup.mode === mode ? 'setup__kind--on' : ''}`}
            onClick={() => onChange(setLineupMode(lineup, mode))}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="match__hint">{MODES.find((m) => m.mode === lineup.mode)?.hint}</p>

      <ol className="lineup" aria-label="Games, in order">
        {lineup.entries.map((entry, index) => {
          const game = games.find((g) => g.id === entry.gameId);
          if (!game) return null;
          return (
            <li key={entry.gameId} className={`lineup__game ${entry.enabled ? '' : 'lineup__game--off'}`}>
              <label className="lineup__pick">
                <input
                  type="checkbox"
                  checked={entry.enabled}
                  disabled={entry.enabled && lastOne}
                  onChange={() => onChange(toggleGame(lineup, index))}
                />
                <span className="lineup__name">{game.name}</span>
              </label>
              <span className="lineup__moves">
                <button
                  className="btn btn--small"
                  onClick={() => onChange(moveGame(lineup, index, -1))}
                  disabled={index === 0}
                  aria-label={`Move ${game.name} up`}
                >
                  ↑
                </button>
                <button
                  className="btn btn--small"
                  onClick={() => onChange(moveGame(lineup, index, 1))}
                  disabled={index === lineup.entries.length - 1}
                  aria-label={`Move ${game.name} down`}
                >
                  ↓
                </button>
              </span>
            </li>
          );
        })}
      </ol>
      <p className="match__hint">Unticked games are hidden from the menu and skipped by the tournament.</p>

      {configurable.map((game) => {
        const values = gameOptions(lineup, game);
        return (
          <fieldset key={game.id} className="game-options">
            <legend>{game.name}</legend>
            {(game.options ?? []).map((option) => {
              const value = values[option.id];
              const step = option.step ?? 1;
              const set = (to: number) => onChange(setGameOption(lineup, game, option, to));
              return (
                <div key={option.id} className="game-options__row">
                  <span>{option.label}</span>
                  <span className="lineup__moves">
                    <button
                      className="btn btn--small"
                      onClick={() => set(value - step)}
                      disabled={value <= option.min}
                      aria-label={`Fewer ${option.label.toLowerCase()}`}
                    >
                      −
                    </button>
                    <output className="game-options__value">{value}</output>
                    <button
                      className="btn btn--small"
                      onClick={() => set(value + step)}
                      disabled={value >= option.max}
                      aria-label={`More ${option.label.toLowerCase()}`}
                    >
                      +
                    </button>
                  </span>
                </div>
              );
            })}
            {game.Settings && <game.Settings theme={theme} />}
          </fieldset>
        );
      })}

      <div className="match__actions">
        <button className="btn btn--primary" onClick={onDone} autoFocus>Done</button>
        <button className="btn" onClick={() => onChange({ ...defaultLineup(games), mode: lineup.mode, options: lineup.options })}>
          Reset games
        </button>
      </div>
    </section>
  );
}
