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
    audio/           BeatClock (Tone.js, beat-synced callbacks) + useBeatClock hook;
                     themeSounds.ts = the sound-effects contract every festivity fills in
    match/           player/team setup, turns, podium + standings (wraps every game);
                     lineup.ts = per-theme game night settings (games, order, single vs tournament)
    ui/              shared components (Icon…)
    random.ts        injectable/seeded RNG helpers
    types.ts         Theme, Card, Player, GameDefinition contracts
  themes/            one folder per festivity: card decks (easiest first), music, sound effects (sounds.ts), icon,
                     tab icon (favicon), `enabled` flag
  games/             one folder per game, listed in games/registry.ts
    kit/             shared turn screens and hooks: intro panel, status bar + timer, countdown, frame loop, captions
    sing-on-the-beat/
      levels.ts      the 9 levels: which deck, how many cards per round, speed-up on top of the tempo setting
      scoring.ts     judging what was said on each card's beat, points and perfect-round streak bonus (pure, tested)
      deal.ts        card dealing rules (pure, tested)
      timeline.ts    beat -> screen step mapping (pure, tested)
    shooter/         shared shooting game: targets, shots, streaks and scoring (hunt.ts, pure, tested),
                     the turn screen (Shooter.tsx), and the ShooterSkin each festivity's version fills in
    bat-blitz/       Halloween skin: zap bats in a cave
    snowball-showdown/  Christmas skin: pelt imps with snowballs on a snowy night
scripts/extract-icons.mjs   copies the icons we use from game-icons.net
```

- **New game:** add `src/games/<game>/index.ts` exporting a `GameDefinition`, then add it to `games/registry.ts`.
  Every game has an `enabled` flag: set it to `false` to hide the game from every menu (e.g. while it's unfinished).
  Build the turn from `games/kit` (TurnIntro, TurnScreen, useCountdown, useFrameLoop…) and use the theme's
  `createSounds()` for sound effects, so the game looks and sounds right in every festivity.
  Give it a `thumbnail` (a 16:9-ish screenshot of the game in play, e.g. `assets/thumbnail.jpg`) for its menu tile.
  `thumbnail` can also be one screenshot per theme (`{ halloween, christmas }`) for games played in several festivities.
  The game component plays **one turn for one player** and calls `onTurnEnd({ score, detail })`; `core/match` handles
  choosing players or teams, passing the device between turns and showing the standings as soon as the last turn ends.
  A game with `levels: n` gets one turn per player per level: everyone plays level 1, then everyone plays level 2…
  (the component receives the `level` to play). A game's `options` (e.g. rounds per level) show up in the game night
  settings and reach the component as `options`.
- **Game night settings** (theme menu): pick which games are played and in what order (default: registry order), and
  whether each game is scored on its own (retry it or go to the next game) or as a **tournament** where everyone plays
  every game in order and the scores add up to a final winner. Games with options (e.g. Sing on the Beat's rounds per
  level, default 3) can be tuned there too. Saved per theme in `localStorage`.
- **Same game, another festivity:** games are built as a theme-neutral engine folder (mechanics, pure and tested,
  plus the turn screen) and one small skin folder per festivity (names, icons, words, scenery CSS under
  `.<engine>--<skin id>`), each registered as its own game. To bring a game to a new festivity, add a skin folder.
- **Shooting game for a new festivity:** add a game folder with a `ShooterSkin` (title, target names and icons,
  sounds) and CSS under `.shooter--<skin id>` for the scenery; the mechanics are shared.
- **New festivity:** add `src/themes/<theme>/theme.ts` and register it in `themes/registry.ts`; colours live under `:root[data-theme='<id>']` in `index.css`.
- **New icons:** add them to `scripts/extract-icons.mjs` and run `node scripts/extract-icons.mjs`.

Icons by [game-icons.net](https://game-icons.net), licensed CC BY 3.0.
