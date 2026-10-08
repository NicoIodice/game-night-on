import { useLocale, useMessages } from '../i18n/I18n';
import type { GameDefinition, Theme } from '../types';
import {
  defaultLineup,
  DIFFICULTIES,
  enabledCount,
  gameOptions,
  isCustom,
  moveGame,
  setDifficulty,
  setGameOption,
  setLineupMode,
  toggleGame,
  type Lineup,
  type LineupMode,
} from './lineup';
import { MESSAGES } from './messages';

interface LineupSettingsProps {
  theme: Theme;
  /** The theme's games, in menu order. */
  games: GameDefinition[];
  lineup: Lineup;
  onChange: (lineup: Lineup) => void;
  onDone: () => void;
}

const MODES: LineupMode[] = ['single', 'tournament'];

/**
 * Sets up the night: how it's scored, which games are played and in what order, how hard it is,
 * and each game's settings.
 */
export function LineupSettings({ theme, games, lineup, onChange, onDone }: LineupSettingsProps) {
  const locale = useLocale();
  const t = useMessages(MESSAGES);
  const lastOne = enabledCount(lineup) === 1;
  const configurable = games.filter((game) => game.options?.length || game.Settings);
  const custom = isCustom(lineup);

  return (
    <section className="match match--panel">
      <h2>{t.settings}</h2>

      <div className="setup__kinds" role="radiogroup" aria-label={t.scoring}>
        {MODES.map((mode) => (
          <button
            key={mode}
            role="radio"
            aria-checked={lineup.mode === mode}
            className={`setup__kind ${lineup.mode === mode ? 'setup__kind--on' : ''}`}
            onClick={() => onChange(setLineupMode(lineup, mode))}
          >
            {mode === 'single' ? t.single : t.tournament}
          </button>
        ))}
      </div>
      <p className="match__hint">{lineup.mode === 'single' ? t.singleHint : t.tournamentHint}</p>

      <ol className="lineup" aria-label={t.gamesInOrder}>
        {lineup.entries.map((entry, index) => {
          const game = games.find((g) => g.id === entry.gameId);
          if (!game) return null;
          const name = game.name[locale];
          return (
            <li key={entry.gameId} className={`lineup__game ${entry.enabled ? '' : 'lineup__game--off'}`}>
              <label className="lineup__pick">
                <input
                  type="checkbox"
                  checked={entry.enabled}
                  disabled={entry.enabled && lastOne}
                  onChange={() => onChange(toggleGame(lineup, index))}
                />
                <span className="lineup__name">{name}</span>
              </label>
              <span className="lineup__moves">
                <button
                  className="btn btn--small"
                  onClick={() => onChange(moveGame(lineup, index, -1))}
                  disabled={index === 0}
                  aria-label={t.moveUp(name)}
                >
                  ↑
                </button>
                <button
                  className="btn btn--small"
                  onClick={() => onChange(moveGame(lineup, index, 1))}
                  disabled={index === lineup.entries.length - 1}
                  aria-label={t.moveDown(name)}
                >
                  ↓
                </button>
              </span>
            </li>
          );
        })}
      </ol>
      <p className="match__hint">{t.untickedHint}</p>

      {/* While custom, no difficulty is on: picking one sets its values again. */}
      <div className="setup__kinds" role="radiogroup" aria-label={t.difficulty}>
        {DIFFICULTIES.map((difficulty) => {
          const on = !custom && lineup.difficulty === difficulty;
          return (
            <button
              key={difficulty}
              role="radio"
              aria-checked={on}
              className={`setup__kind ${on ? 'setup__kind--on' : ''}`}
              onClick={() => onChange(setDifficulty(lineup, difficulty))}
            >
              {t.difficultyName(difficulty)}
            </button>
          );
        })}
      </div>
      <p className="match__hint">
        {custom ? t.customHint(t.difficultyName(lineup.difficulty)) : t.difficultyHint}
      </p>

      {configurable.map((game) => {
        const values = gameOptions(lineup, game);
        return (
          <fieldset key={game.id} className="game-options">
            <legend>{game.name[locale]}</legend>
            {(game.options ?? []).map((option) => {
              const value = values[option.id];
              const step = option.step ?? 1;
              const set = (to: number) => onChange(setGameOption(lineup, game, option, to));
              const label = option.label[locale];
              return (
                <div key={option.id} className="game-options__row">
                  <span>{label}</span>
                  <span className="lineup__moves">
                    <button
                      className="btn btn--small"
                      onClick={() => set(value - step)}
                      disabled={value <= option.min}
                      aria-label={t.less(label)}
                    >
                      −
                    </button>
                    <output className="game-options__value">{value}</output>
                    <button
                      className="btn btn--small"
                      onClick={() => set(value + step)}
                      disabled={value >= option.max}
                      aria-label={t.more(label)}
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
        <button className="btn btn--primary" onClick={onDone} autoFocus>{t.done}</button>
        <button className="btn" onClick={() => onChange({ ...lineup, entries: defaultLineup(games).entries })}>
          {t.resetGames}
        </button>
      </div>
    </section>
  );
}
