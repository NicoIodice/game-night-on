import { useState } from 'react';
import { useMusic } from '../audio/useMusic';
import type { GameDefinition, GameOptionValues, Roster, Theme, TurnResult } from '../types';
import type { LineupMode } from './lineup';
import { PlayerBadge } from './PlayerBadge';
import { PlayerSetup } from './PlayerSetup';
import { finalizeRoster, loadRoster, saveRoster } from './roster';
import { rankPlayers, sumScores, winners, type Standing } from './ranking';
import { Standings } from './Standings';
import './Match.css';

type Scores = Record<string, number>;
type Details = Record<string, string | undefined>;

/** One player's go at one level of a game. */
interface Turn {
  level: number;
  seat: number;
}

type Stage =
  | { kind: 'setup' }
  | { kind: 'turn'; turn: Turn }
  | { kind: 'between'; turn: Turn; result: TurnResult; next: Turn }
  | { kind: 'results' }
  | { kind: 'final' };

interface MatchProps {
  theme: Theme;
  /** The night's games, in order. "Next game" walks through them. */
  games: GameDefinition[];
  /** 'single': every game scored on its own. 'tournament': everyone plays every game and the scores add up. */
  mode: LineupMode;
  /** The game picked from the menu. Tournaments always start from the first one. */
  startAt?: number;
  /** Each game's settings from the game night settings. */
  optionsFor: (game: GameDefinition) => GameOptionValues;
  onExit: () => void;
}

/**
 * Runs the night's games for a group: pick players or teams, give each one a turn
 * (passing the device in between), then show the standings straight away.
 * Games with levels give everyone a turn at each level, one level after the other.
 * From there, retry the game or move on to the next one.
 */
export function Match({ theme, games, mode, startAt = 0, optionsFor, onExit }: MatchProps) {
  const tournament = mode === 'tournament';
  const [roster, setRoster] = useState<Roster>(loadRoster);
  const [stage, setStage] = useState<Stage>({ kind: 'setup' });
  const [gameIndex, setGameIndex] = useState(tournament ? 0 : startAt);
  const [scores, setScores] = useState<Scores>({});
  const [details, setDetails] = useState<Details>({});
  /** Finished games' scores, by position in `games`. A retry replaces its game's entry. */
  const [rounds, setRounds] = useState<(Scores | undefined)[]>([]);
  const players = roster.players;
  const game = games[gameIndex];
  const next = games[gameIndex + 1];
  const levels = game.levels ?? 1;
  const nouns = roster.kind === 'teams' ? 'teams' : 'players';
  const noun = roster.kind === 'teams' ? 'team' : 'player';

  // Menu music between turns; the game brings its own sound during a turn.
  useMusic(stage.kind === 'turn' ? null : (theme.music ?? null));

  const play = (index: number) => {
    setGameIndex(index);
    setScores({});
    setDetails({});
    setStage({ kind: 'turn', turn: { level: 0, seat: 0 } });
  };

  const start = () => {
    const ready = finalizeRoster(roster);
    setRoster(ready);
    saveRoster(ready);
    // New players mean a new tournament.
    setRounds([]);
    play(tournament ? 0 : gameIndex);
  };

  /** Everyone plays a level before anyone moves on to the next one. */
  const nextTurn = ({ level, seat }: Turn): Turn | null => {
    if (seat < players.length - 1) return { level, seat: seat + 1 };
    if (level < levels - 1) return { level: level + 1, seat: 0 };
    return null;
  };

  const endTurn = (turn: Turn, result: TurnResult) => {
    const { id } = players[turn.seat];
    const gameScores = { ...scores, [id]: (scores[id] ?? 0) + result.score };
    setScores(gameScores);
    setDetails((previous) => ({ ...previous, [id]: result.detail }));

    const next = nextTurn(turn);
    if (next) {
      // A moment to pass the device to the next player, or catch a breath before the next level.
      setStage({ kind: 'between', turn, result, next });
      return;
    }
    // Everyone has played every level: straight to the standings.
    setRounds((previous) => withAt(previous, gameIndex, gameScores));
    setStage({ kind: 'results' });
  };

  switch (stage.kind) {
    case 'setup':
      return (
        <PlayerSetup
          title={tournament ? 'Tournament' : game.name}
          description={tournament ? games.map((g) => g.name).join(' → ') : game.description}
          roster={roster}
          onChange={setRoster}
          onStart={start}
          onBack={onExit}
        />
      );

    case 'turn': {
      const { turn } = stage;
      return (
        <game.Component
          key={`${gameIndex}:${turn.level}:${turn.seat}`}
          theme={theme}
          player={players[turn.seat]}
          level={turn.level}
          options={optionsFor(game)}
          onTurnEnd={(result) => endTurn(turn, result)}
          onExit={() => setStage({ kind: 'setup' })}
        />
      );
    }

    case 'between': {
      const { turn, result, next } = stage;
      const { level, seat } = turn;
      const passDevice = next.seat !== seat;
      return (
        <section className="match match--panel">
          {levels > 1 && <p className="match__eyebrow">Level {level + 1} of {levels}</p>}
          <PlayerBadge player={players[seat]} className="match__who" />
          <p className="match__score">{result.score} points</p>
          {result.detail && <p>{result.detail}</p>}

          <ul className="match__scoreboard" aria-label="Scores so far">
            {players.map((player, i) => (
              <li key={player.id} className={i === seat ? 'match__scoreboard--current' : ''}>
                <PlayerBadge player={player} />
                <span>{level > 0 || i <= seat ? scores[player.id] ?? 0 : '–'}</span>
              </li>
            ))}
          </ul>

          <p className="match__hint">
            {next.level !== level && `Up next: level ${next.level + 1} of ${levels}. `}
            {passDevice && `Pass the device to the next ${noun}.`}
          </p>
          <div className="match__actions">
            <button className="btn btn--primary" onClick={() => setStage({ kind: 'turn', turn: next })} autoFocus>
              {passDevice ? `${players[next.seat].name}, you're up!` : `Play level ${next.level + 1}`}
            </button>
          </div>
        </section>
      );
    }

    case 'results': {
      const standings = rankPlayers(players, scores);
      const totals = rankPlayers(players, sumScores(rounds));
      return (
        <section className="match match--panel match--results">
          <p className="match__eyebrow">
            {tournament ? `Game ${gameIndex + 1} of ${games.length} · ${game.name}` : game.name}
          </p>
          <Outcome standings={standings} details={details} />

          {tournament && (
            <div className="match__totals">
              <h3>Tournament so far</h3>
              <ul className="match__scoreboard" aria-label="Tournament scores so far">
                {totals.map(({ player, score }) => (
                  <li key={player.id}>
                    <PlayerBadge player={player} />
                    <span>{score}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="match__actions">
            {next ? (
              <button className="btn btn--primary" onClick={() => play(gameIndex + 1)} autoFocus>
                Next game: {next.name}
              </button>
            ) : (
              tournament && (
                <button className="btn btn--primary" onClick={() => setStage({ kind: 'final' })} autoFocus>
                  Final standings
                </button>
              )
            )}
            <button
              className={`btn ${next || tournament ? '' : 'btn--primary'}`}
              onClick={() => play(gameIndex)}
              autoFocus={!next && !tournament}
            >
              {tournament ? 'Retry this game' : 'Play again'}
            </button>
            {!tournament && (
              <button className="btn" onClick={() => setStage({ kind: 'setup' })}>Change {nouns}</button>
            )}
            <button className="btn" onClick={onExit}>{tournament ? 'Quit tournament' : 'Back to menu'}</button>
          </div>
          {tournament && <p className="match__hint">A retry replaces this game's scores.</p>}
        </section>
      );
    }

    case 'final': {
      const standings = rankPlayers(players, sumScores(rounds));
      // Each player's line shows how they scored game by game.
      const breakdown: Details = Object.fromEntries(
        players.map((player) => [
          player.id,
          games.map((g, i) => `${g.name} ${rounds[i]?.[player.id] ?? 0}`).join(' · '),
        ]),
      );
      return (
        <section className="match match--panel match--results">
          <p className="match__eyebrow">Tournament · {games.length} {games.length === 1 ? 'game' : 'games'}</p>
          <Outcome standings={standings} details={breakdown} night />
          <div className="match__actions">
            <button className="btn btn--primary" onClick={start} autoFocus>Play the tournament again</button>
            <button className="btn" onClick={() => setStage({ kind: 'setup' })}>Change {nouns}</button>
            <button className="btn" onClick={onExit}>Back to menu</button>
          </div>
        </section>
      );
    }
  }
}

interface OutcomeProps {
  standings: Standing[];
  details: Readonly<Details>;
  /** The whole tournament rather than one game. */
  night?: boolean;
}

/** Who won, then the podium and table (or just the score for a solo game). */
function Outcome({ standings, details, night = false }: OutcomeProps) {
  const top = winners(standings);
  if (standings.length === 1) {
    const [{ player, score }] = standings;
    return (
      <>
        <h2>Well played!</h2>
        <p className="match__score">{score} points</p>
        {details[player.id] && <p>{details[player.id]}</p>}
      </>
    );
  }
  return (
    <>
      <h2>{top.length > 1 ? "It's a tie!" : `${top[0].player.name} wins${night ? ' the night' : ''}!`}</h2>
      <Standings standings={standings} details={details} />
    </>
  );
}

function withAt<T>(list: readonly T[], index: number, value: T): T[] {
  const copy = [...list];
  copy[index] = value;
  return copy;
}
