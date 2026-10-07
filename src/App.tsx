import { useEffect, useState } from 'react';
import type { GameDefinition, Theme } from './core/types';
import { Icon } from './core/ui/Icon';
import { gamesFor } from './games/registry';
import { THEMES } from './themes/registry';
import './App.css';

export default function App() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [game, setGame] = useState<GameDefinition | null>(null);

  // Theme colours and fonts are CSS variables keyed off this attribute (see index.css).
  useEffect(() => {
    document.documentElement.dataset.theme = theme?.id ?? '';
  }, [theme]);

  if (theme && game) {
    return (
      <main className="app">
        <game.Component theme={theme} onExit={() => setGame(null)} />
      </main>
    );
  }

  return (
    <main className="app">
      <header className="app__header">
        <h1 className="app__title">Game Night On</h1>
        <p className="app__subtitle">{theme ? theme.tagline : 'Pick a festivity'}</p>
      </header>

      {theme ? (
        <>
          <ul className="tiles">
            {gamesFor(theme).map((g) => (
              <li key={g.id}>
                <button className="tile" onClick={() => setGame(g)}>
                  <span className="tile__name">{g.name}</span>
                  <span className="tile__text">{g.description}</span>
                  <span className="tile__meta">{g.players}</span>
                </button>
              </li>
            ))}
          </ul>
          <button className="btn" onClick={() => setTheme(null)}>Change festivity</button>
        </>
      ) : (
        <ul className="tiles">
          {THEMES.map((t) => (
            <li key={t.id}>
              <button className="tile" data-theme-tile={t.id} disabled={!t.enabled} onClick={() => setTheme(t)}>
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
    </main>
  );
}
