# game-night-on
Fun little games for couples, families, and friends — made for memorable game nights. 🎮❤️

## Setting up a new machine

A checklist to follow top to bottom; it also works as instructions for an AI assistant ("set up this project
following the README"). Check each tool first and only install what's missing or too old; installing system-wide
software needs the developer's OK.

| Tool | Needed for | Check | Install if missing |
|---|---|---|---|
| Git | cloning, committing | `git --version` | Windows: `winget install Git.Git` · macOS: `xcode-select --install` · Linux: `sudo apt install git` |
| Node.js 22+ (with npm) | everything (CI uses 22) | `node --version` | Windows: `winget install OpenJS.NodeJS.LTS` · macOS: `brew install node@22` · Linux: [nodejs.org](https://nodejs.org) or nvm |
| Google Chrome 135+ | playing the voice games (Chrome or Edge), `check:voices` | open `chrome://version` | [google.com/chrome](https://www.google.com/chrome/) · Windows: `winget install Google.Chrome` |
| Python 3.9+ | `check:voices` only | `python --version` (or `python3`) | Windows: `winget install Python.Python.3.13` · macOS: `brew install python` · Linux: `sudo apt install python3 python3-pip` |
| edge-tts | `check:voices` only | `python -m edge_tts --help` | `python -m pip install --user edge-tts` |

Then, in the project folder:

1. `npm install`: the project's packages (React, Vite, Vitest, Tone.js, playwright-core…). No global npm
   packages are needed. playwright-core uses the installed Chrome, so don't run `playwright install`.
2. Verify, in this order:
   - `npm test`: all unit tests pass.
   - `npm run build`: type-checks and builds without errors.
   - `npm run dev`: open http://localhost:5173/game-night-on/ in Chrome. The splash screen shows, and the language
     button (EN/PT) and sound button sit bottom right.
   - Optional, needs the internet: `npm run check:voices` passes (about 4 minutes).
3. Only if something isn't found: set `CHROME_PATH` to the Chrome binary, or `PYTHON` to the Python command, for
   `check:voices`.

Nothing else is needed: no database, no environment file, no accounts. Settings, voice checks and rosters are
saved in the browser. Pushing to `main` deploys to GitHub Pages (`.github/workflows/deploy.yml`).

## Running

```bash
npm install
npm run dev     # http://localhost:5173/game-night-on/
npm test        # unit tests (Vitest)
npm run build
npm run check:voices   # can the browser hear every Sing on the Beat card? (see below)
```

### Voice check for the cards

`npm run check:voices` makes sure Chrome's speech recognition (the one Sing on the Beat uses) can hear every card,
in every theme and language, before a game night finds out. Two neural voices per language (a female and a male
one) say each card alone and each deck in one go like a round. Chrome listens in the language's default accent,
over quiet room noise like a real microphone. The game's own word matching then judges what it heard. It fails when a card is
taken for another card of its deck, or is never heard right, alone or in a round. The report (also saved to
`node_modules/.cache/voice-check/report.md`) shows what each voice was heard as, so a new deck's words can be
checked, or a `sayAs` variant added.

- Needs Google Chrome 135+ (set `CHROME_PATH` if it's not found), Python with `pip install edge-tts` (set `PYTHON`
  if it's not `python`), and the internet. Only the card words go to the speech services; voice clips are cached.
- `VOICE_CHECK_LOCALES=pt-PT` or `VOICE_CHECK_THEMES=christmas` checks just those. Takes about 4 minutes for all.
- Synthetic voices are a good early warning, not a guarantee for every accent or room; results vary a little between
  runs. A lone short word ("bee", "cão") often gets no transcript at all. The game is fine with that, since words
  come in a stream, but the in-game voice check will say it heard nothing.

## Project layout

```
src/
  core/              shared, game-agnostic pieces
    audio/           BeatClock (Tone.js, beat-synced callbacks) + useBeatClock hook;
                     themeSounds.ts = the sound-effects contract every festivity fills in; micMeter.ts = mic loudness
    match/           player/team setup, turns, podium + standings (wraps every game);
                     lineup.ts = per-theme game night settings (games, order, single vs tournament)
    ui/              shared components (Icon…)
    voice/           speech recognition (SpeechListener), word matching (exact, learned and near-miss words),
                     and the voice check: calibration.ts (saved per device) + VoiceCheck.tsx (the check's screens)
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
      VoiceSettings.tsx   accent, strictness and voice check buttons in the game night settings
      VoiceDebug.tsx      `?debug` panel: every word heard, when, and which card it counted for
    shooter/         shared shooting game: targets, shots, streaks and scoring (hunt.ts, pure, tested),
                     the turn screen (Shooter.tsx), and the ShooterSkin each festivity's version fills in
    bat-blitz/       Halloween skin: zap bats in a cave
    snowball-showdown/  Christmas skin: pelt imps with snowballs on a snowy night
    balloon-pop/     Birthday skin: pop the party balloons before they float away
    egg-catch/       Easter skin: catch the painted eggs over a spring meadow
    splash-attack/   Summer skin: splash beach balls with a water pistol
    cupids-arrows/   Valentine skin: shoot Cupid's arrows at floating hearts
    firework-frenzy/ New Year skin: burst the fireworks before they fade
    feather-catch/   Carnival skin: catch the feathers flying off the parade
    alien-zapper/    Space skin: zap aliens and asteroids around the space station
    memory/          shared memory game: pairs, streaks and scoring (board.ts, pure, tested), the turn screen
                     and memoryGame() which turns a MemorySkin into a game
    pumpkin-patch-memory/  Halloween skin: spooky friends under pumpkins
    present-pairs/   Christmas skin: festive surprises in presents
    party-pairs/     Birthday skin: party surprises in birthday presents
    painted-pairs/   Easter skin: spring surprises under painted eggs
    shell-pairs/     Summer skin: beach surprises under seashells
    sweetheart-pairs/  Valentine skin: sweethearts under roses
    midnight-pairs/  New Year skin: New Year surprises under party poppers
    mask-pairs/      Carnival skin: carnival surprises behind masks
    planet-pairs/    Space skin: space surprises under planets
    sequence/        shared repeat-the-sequence game: growing sequence, lives and scoring (sequence.ts, pure, tested),
                     the turn screen (pads in a ring) and sequenceGame() which turns a SequenceSkin into a game
    witchs-cauldron/ Halloween skin: add the ingredients to the brew in order
    bell-choir/      Christmas skin: chime the ornaments back in order
    party-band/      Birthday skin: play the party band's instruments back in order
    spring-chorus/   Easter skin: sing back the spring animals in order
    beach-beats/     Summer skin: play the steel-drum beach things back in order
    love-song/       Valentine skin: sing the sweet things back in order
    midnight-chimes/ New Year skin: chime the party things back in order
    samba-parade/    Carnival skin: play the samba school back in order
    mission-control/ Space skin: beep the control panel back in order
    peekaboo/        shared pop-up game: characters peek out of holes, catch the rascals but not the friend
                     (peek.ts, pure, tested), the turn screen and peekGame() which turns a PeekSkin into a game
    haunted-house/   Halloween skin: ghosts in the windows, don't bonk the black cat
    advent-ambush/   Christmas skin: imps behind advent calendar doors, don't bonk the reindeer
    surprise-boxes/  Birthday skin: balloons out of gift boxes, don't bonk the birthday cake
    bunny-burrows/   Easter skin: bunnies out of meadow burrows, don't bonk the hen
    sandy-crabs/     Summer skin: crabs out of sand holes, don't bonk the seagull
    heart-windows/   Valentine skin: hearts in the windows, don't bonk the grumpy cat
    confetti-cannons/  New Year skin: confetti cannons pop up, don't wake the sleepy guest
    parade-float/    Carnival skin: clowns on the parade float, don't bonk the mime
    crater-critters/ Space skin: aliens out of Moon craters, don't bonk the astronaut
    charades/        shared charades game: a no-repeat word bag per night and scoring (words.ts, pure, tested),
                     the turn screen and charadesGame() which turns a CharadesSkin (title + word list) into a game
    monster-charades/   Halloween skin: spooky words to act out
    festive-charades/   Christmas skin: Christmas words to act out
    party-charades/     Birthday skin: party games and birthday moments to act out
    spring-charades/    Easter skin: spring things to act out
    summer-charades/    Summer skin: summer things to act out
    love-charades/      Valentine skin: famous couples and romantic moments to act out
    resolution-charades/  New Year skin: New Year's resolutions to act out
    costume-charades/   Carnival skin: costumes and carnival characters to act out
    space-charades/     Space skin: space things to act out
    shout/           shared shouting game: room noise, loudness and scoring (loudness.ts, pure, tested), the
                     microphone meter screen and shoutGame() which turns a ShoutSkin into a game
    scream-meter/    Halloween skin: scream to make the ghost fly
    ho-ho-holler/    Christmas skin: HO HO HO to make the reindeer fly
    birthday-cheer/  Birthday skin: HAPPY BIRTHDAY to make the candle flames flare up
    cheep-cheep/     Easter skin: CHEEP CHEEP to make the bird fly
    cannonball/      Summer skin: CANNONBALL! to make the biggest splash
    i-love-you/      Valentine skin: I LOVE YOU! to make the winged heart fly
    happy-new-year/  New Year skin: HAPPY NEW YEAR! to send the firework sky-high
    carnival-cheer/  Carnival skin: CARNIVAL! to make the parrot fly
    lift-off/        Space skin: 3, 2, 1, LIFT OFF! to make the rocket climb
    runner/          shared running game: jumping, obstacles, treats and lives (dash.ts, pure, tested; a test checks a
                     whole run stays jumpable), the scrolling screen and runnerGame() which turns a RunnerSkin into a game
    trick-or-treat-dash/  Halloween skin: jump pumpkins and graves, grab sweets
    gingerbread-dash/     Christmas skin: the gingerbread man jumps presents and snowmen, grabs candy canes
    party-dash/           Birthday skin: race through the party, jumping presents and chairs, grabbing cupcakes
    bunny-hop/            Easter skin: the bunny hops flowerpots and fences, grabs eggs
    surf-dash/            Summer skin: surf the shore, jumping rocks and big waves, grabbing ice creams
    cupids-flight/        Valentine skin: Cupid dashes across the clouds, jumping cactuses and rain clouds
    midnight-dash/        New Year skin: race to the party before midnight, jumping cones and bins
    parade-dash/          Carnival skin: the juggler dances down the parade, jumping drums and unicycles
    moon-bounce/          Space skin: the astronaut bounces across the Moon, jumping rocks and radar dishes
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
  settings and reach the component as `options`. A game can also add its own controls there with `Settings`.
- **Voice check** (Sing on the Beat): the first time the game is played on a device, a short check sets the accent,
  measures how late this device's speech recognition reports words (so on-time words aren't marked wrong), learns
  words it mishears for each card, and asks for strict or relaxed scoring. A new festivity only re-checks its own
  words. The result is saved in the browser's `localStorage` under `game-night-on:voice-check`: delete that entry
  (or clear the site's data), or use **Run the voice check again** / **Forget it** in the game night settings (also
  "Voice check" on the game's intro screen) to run it again. Add `?debug` to the address to see the voice debug panel.
- **Game night settings** (theme menu): pick which games are played and in what order (default: registry order), and
  whether each game is scored on its own (retry it or go to the next game) or as a **tournament** where everyone plays
  every game in order and the scores add up to a final winner. Games with options (e.g. Sing on the Beat's rounds per
  level, default 3) can be tuned there too. Saved per theme in `localStorage`.
- **Same game, another festivity:** games are built as a theme-neutral engine folder (mechanics, pure and tested,
  plus the turn screen) and one small skin folder per festivity (names, icons, words, scenery CSS under
  `.<engine>--<skin id>`), each registered as its own game. To bring a game to a new festivity, add a skin folder.
- **Shooting game for a new festivity:** add a game folder with a `ShooterSkin` (title, target names and icons,
  sounds) and CSS under `.shooter--<skin id>` for the scenery; the mechanics are shared.
- **Languages:** English (US) and Portuguese (Portugal). The app starts in the browser's language when it speaks it
  (`pt-PT` or plain `pt`; `pt-BR` and anything else fall back to English), and the picker next to the sound button
  switches it (saved in `localStorage` under `game-night-on:locale`). Every text a player sees is a
  `Localized<…>` value (`core/i18n/locales.ts`) with one entry per language: data such as game names, skins' intros,
  charades words and theme card decks carries its own translations, and each component's texts live in a
  `messages.ts(x)` next to it, read with `useMessages(MESSAGES)`. **New language:** add it to `LOCALES` and run
  `npm run build`: the type checker lists every text still to translate. Sing on the Beat's decks are chosen per
  language, not translated: early decks need words that *rhyme in that language* (`gato, rato, pato, sapato`), so
  pick words with pictures, and add an accent list for it in `ACCENTS` (`core/voice/calibration.ts`). The voice check
  tests each theme's words again in each language, since the cards are other words; card ids must stay unique across
  languages, as learned words are saved by card id (a test checks this).
- **New festivity:** add `src/themes/<theme>/theme.ts` and register it in `themes/registry.ts`; colours live under `:root[data-theme='<id>']` in `index.css`.
- **New icons:** add them to `scripts/extract-icons.mjs` and run `node scripts/extract-icons.mjs`.

Icons by [game-icons.net](https://game-icons.net), licensed CC BY 3.0.
