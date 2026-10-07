# game-night-on
Fun little games for couples, families, and friends — made for memorable game nights. 🎮❤️

## Running

```bash
npm install
npm run dev     # http://localhost:5173
npm test        # unit tests (Vitest)
npm run build
```

## Project layout

```
src/
  core/              shared, game-agnostic pieces
    audio/           BeatClock (Tone.js, beat-synced callbacks) + useBeatClock hook
    ui/              shared components (Icon…)
    random.ts        injectable/seeded RNG helpers
    types.ts         Theme, Card, GameDefinition contracts
  themes/            one folder per festivity: cards, music, icon, `enabled` flag
  games/             one folder per game, listed in games/registry.ts
    sing-on-the-beat/
      levels.ts      level data (tempo, cards, rounds)
      deal.ts        card dealing rules (pure, tested)
      timeline.ts    beat -> screen step mapping (pure, tested)
scripts/extract-icons.mjs   copies the icons we use from game-icons.net
```

- **New game:** add `src/games/<game>/index.ts` exporting a `GameDefinition`, then add it to `games/registry.ts`.
- **New festivity:** add `src/themes/<theme>/theme.ts` and register it in `themes/registry.ts`; colours live under `:root[data-theme='<id>']` in `index.css`.
- **New icons:** add them to `scripts/extract-icons.mjs` and run `node scripts/extract-icons.mjs`.

Icons by [game-icons.net](https://game-icons.net), licensed CC BY 3.0.
