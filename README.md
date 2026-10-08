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
                     themeSounds.ts = the sound-effects contract every festivity fills in; micMeter.ts = mic loudness
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
    memory/          shared memory game: pairs, streaks and scoring (board.ts, pure, tested), the turn screen
                     and memoryGame() which turns a MemorySkin into a game
    pumpkin-patch-memory/  Halloween skin: spooky friends under pumpkins
    present-pairs/   Christmas skin: festive surprises in presents
    sequence/        shared repeat-the-sequence game: growing sequence, lives and scoring (sequence.ts, pure, tested),
                     the turn screen (pads in a ring) and sequenceGame() which turns a SequenceSkin into a game
    witchs-cauldron/ Halloween skin: add the ingredients to the brew in order
    bell-choir/      Christmas skin: chime the ornaments back in order
    peekaboo/        shared pop-up game: characters peek out of holes, catch the rascals but not the friend
                     (peek.ts, pure, tested), the turn screen and peekGame() which turns a PeekSkin into a game
    haunted-house/   Halloween skin: ghosts in the windows, don't bonk the black cat
    advent-ambush/   Christmas skin: imps behind advent calendar doors, don't bonk the reindeer
    charades/        shared charades game: a no-repeat word bag per night and scoring (words.ts, pure, tested),
                     the turn screen and charadesGame() which turns a CharadesSkin (title + word list) into a game
    monster-charades/   Halloween skin: spooky words to act out
    festive-charades/   Christmas skin: Christmas words to act out
    shout/           shared shouting game: room noise, loudness and scoring (loudness.ts, pure, tested), the
                     microphone meter screen and shoutGame() which turns a ShoutSkin into a game
    scream-meter/    Halloween skin: scream to make the ghost fly
    ho-ho-holler/    Christmas skin: HO HO HO to make the reindeer fly
    runner/          shared running game: jumping, obstacles, treats and lives (dash.ts, pure, tested; a test checks a
                     whole run stays jumpable), the scrolling screen and runnerGame() which turns a RunnerSkin into a game
    trick-or-treat-dash/  Halloween skin: jump pumpkins and graves, grab sweets
    gingerbread-dash/     Christmas skin: the gingerbread man jumps presents and snowmen, grabs candy canes
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
