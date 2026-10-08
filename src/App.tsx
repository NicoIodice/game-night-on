import { useEffect, useState } from 'react';
import { loadMuted, setMuted, unlockAudio } from './core/audio/sound';
import { useMusic } from './core/audio/useMusic';
import { gameOptions, loadLineup, playlist, saveLineup, type Lineup } from './core/match/lineup';
import { LineupSettings } from './core/match/LineupSettings';
import { Match } from './core/match/Match';
import type { Theme } from './core/types';
import { Icon } from './core/ui/Icon';
import { SoundToggle } from './core/ui/SoundToggle';
import { lobbyMusic } from './app/lobbyMusic';
import { gamesFor, thumbnailFor } from './games/registry';
import { THEMES } from './themes/registry';
import './App.css';

/** The tab icon from index.html, used until a festivity is chosen. */
const LOBBY_FAVICON = `${import.meta.env.BASE_URL}favicon.svg`;

export default function App() {
  const [entered, setEntered] = useState(false);
  const [muted, setMutedState] = useState(loadMuted);
  const [theme, setTheme] = useState<Theme | null>(null);
  /** The chosen theme's games: which ones, in what order, and how they're scored. */
  const [lineup, setLineup] = useState<Lineup | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  /** A match in progress. `id` restarts it fresh each time one is launched. */
  const [session, setSession] = useState<{ id: number; startAt: number } | null>(null);
  const themeGames = theme ? gamesFor(theme) : [];
  const games = lineup ? playlist(lineup, themeGames) : [];

  // Theme colours and fonts are CSS variables keyed off this attribute (see index.css).
  useEffect(() => {
    document.documentElement.dataset.theme = theme?.id ?? '';
    const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (icon) icon.href = theme?.favicon ?? LOBBY_FAVICON;
  }, [theme]);

  useEffect(() => setMuted(muted), [muted]);

  // Menus have music; a match handles its own.
  useMusic(!entered || session ? null : (theme?.music ?? lobbyMusic));

  const enter = () => {
    // Browsers only allow sound after a click, hence this first screen.
    void unlockAudio();
    setEntered(true);
  };

  const chooseTheme = (chosen: Theme | null) => {
    setTheme(chosen);
    setLineup(chosen ? loadLineup(chosen.id, gamesFor(chosen)) : null);
  };

  const changeLineup = (changed: Lineup) => {
    setLineup(changed);
    if (theme) saveLineup(theme.id, changed);
  };

  const launch = (startAt: number) => setSession({ id: Date.now(), startAt });

  const soundToggle = <SoundToggle muted={muted} onChange={setMutedState} />;

  if (!entered) {
    return (
      <main className="app app--splash">
        <h1 className="app__title">Game Night On</h1>
        <p className="app__subtitle">Fun little games for memorable nights</p>
        <button className="btn btn--primary" onClick={enter} autoFocus>Let's play</button>
        {soundToggle}
      </main>
    );
  }

  if (theme && lineup && session) {
    return (
      <main className="app">
        <Match
          key={session.id}
          theme={theme}
          games={games}
          mode={lineup.mode}
          startAt={session.startAt}
          optionsFor={(game) => gameOptions(lineup, game)}
          onExit={() => setSession(null)}
        />
        {soundToggle}
      </main>
    );
  }

  if (theme && lineup && settingsOpen) {
    return (
      <main className="app">
        <LineupSettings theme={theme} games={themeGames} lineup={lineup} onChange={changeLineup} onDone={() => setSettingsOpen(false)} />
        {soundToggle}
      </main>
    );
  }

  const tournament = lineup?.mode === 'tournament';

  return (
    <main className="app">
      <header className="app__header">
        <h1 className="app__title">Game Night On</h1>
        <p className="app__subtitle">{theme ? theme.tagline : 'Pick a festivity'}</p>
      </header>

      {theme ? (
        <>
          {tournament && (
            <div className="app__tournament">
              <p>
                Tournament: everyone plays {games.length === 1 ? 'this game' : `these ${games.length} games in order`}, and the
                scores add up.
              </p>
              <button className="btn btn--primary" onClick={() => launch(0)} autoFocus>Start the tournament</button>
            </div>
          )}
          <ol className="tiles">
            {games.map((g, index) => {
              const thumbnail = thumbnailFor(g, theme);
              const content = (
                <>
                  {thumbnail && <img className="tile__thumb" src={thumbnail} alt="" loading="lazy" />}
                  {tournament && <span className="tile__order">Game {index + 1}</span>}
                  <span className="tile__name">{g.name}</span>
                  <span className="tile__text">{g.description}</span>
                  <span className="tile__meta">{g.players}</span>
                </>
              );
              return (
                <li key={g.id}>
                  {tournament ? (
                    <div className="tile tile--static">{content}</div>
                  ) : (
                    <button className="tile" onClick={() => launch(index)}>{content}</button>
                  )}
                </li>
              );
            })}
          </ol>
          <div className="app__actions">
            <button className="btn" onClick={() => setSettingsOpen(true)}>Game night settings</button>
            <button className="btn" onClick={() => chooseTheme(null)}>Change festivity</button>
          </div>
        </>
      ) : (
        <ul className="tiles">
          {THEMES.map((t) => (
            <li key={t.id}>
              <button className="tile" data-theme-tile={t.id} disabled={!t.enabled} onClick={() => chooseTheme(t)}>
                <Icon src={t.icon} className="tile__icon" />
                <span className="tile__name">{t.name}</span>
                <span className="tile__text">{t.enabled ? t.tagline : 'Coming soon'}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <footer className="app__footer">
        Icons by <a href="https://game-icons.net" target="_blank" rel="noreferrer">game-icons.net</a> (CC BY 3.0)
      </footer>
      {soundToggle}
    </main>
  );
}
