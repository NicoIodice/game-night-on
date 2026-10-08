# Theme ideas

New festivities to add after Halloween and Christmas, with what each of the 8 games would look like in them.
Nothing here is built yet.

**Recommended first: Birthday Party.** It gets played several times a year instead of once, and every game
has an obvious version of it.

## What a new theme needs

Use `src/themes/halloween/` and `src/themes/christmas/` as the reference.

1. **Theme id**: add it to `ThemeId` in `src/core/types.ts`.
2. **`src/themes/<id>/theme.ts`**: name, tagline, icon, favicon, `enabled`, and three picture-card `decks`.
   Sing on the Beat uses these decks automatically:
   - deck 1: 4 short words that rhyme (cat, rat, bat, hat)
   - deck 2: 4–5 trickier words that rhyme (snake, cake, rake…)
   - deck 3: about 7 words of different lengths
   - Memory needs at least 10 picture cards across all decks, not counting the one used on the card backs.
   - Add `sayAs` for words speech recognition often mishears (e.g. stake → steak).
3. **`music.ts`** (menu loop, see the existing ones) and **`sounds.ts`** (a `ThemeSounds`: good, bad, tap,
   note, cue, timeUp). Every game uses these sounds, so the new theme sounds right everywhere.
4. **Colours and font**: a `:root[data-theme='<id>']` block in `src/index.css`, the theme tile colour in
   `src/App.css`, and the display font in the Google Fonts link in `index.html`.
5. **Register** the theme in `src/themes/registry.ts`.
6. **Icons**: add them to `scripts/extract-icons.mjs` (game-icons.net names) and run
   `node scripts/extract-icons.mjs`.
7. **A version of each game**: one small folder per game, copied from the Halloween or Christmas one. Set
   `themes: ['<id>']`, then change the names, icons, words and scenery CSS. Register each in
   `src/games/registry.ts`, and set `enabled: false` on any that aren't ready yet.

| Game engine | Copy from | What the theme fills in |
|---|---|---|
| `shooter/` | `bat-blitz/`, `snowball-showdown/` | 3 targets (common, swift, golden), intro text, `sfx.ts`, arena scenery |
| `memory/` | `pumpkin-patch-memory/`, `present-pairs/` | card-back picture, table and card colours |
| `sequence/` | `witchs-cauldron/`, `bell-choir/` | centre picture, 6 pads (name, icon, colour, note) |
| `peekaboo/` | `haunted-house/`, `advent-ambush/` | rascal, boss and friend (don't tap!), hole styling, optional hole labels |
| `charades/` | `monster-charades/`, `festive-charades/` | icon and about 40 words to act out |
| `shout/` | `scream-meter/`, `ho-ho-holler/` | mascot, the call ("SCREAM!"), 5 score ranks |
| `runner/` | `trick-or-treat-dash/`, `gingerbread-dash/` | runner, low and tall obstacle, treat, sky / hills / ground CSS |
| `sing-on-the-beat/` | (works for every theme) | nothing: it uses the theme's decks |

Every game also gets a `thumbnail.jpg` for its menu tile: a 960-pixel-wide screenshot of the game being played.

## The ideas

### 1. Birthday Party ⭐ recommended
Useful all year, not just one night.
- **Cards** (rhymes): cake, rake, snake, lake · hat, cat, bat, mat · then balloon, candle, present, party hat…
- **Shooter**: pop balloons floating up (golden = the birthday balloon).
- **Memory**: wrapped presents on the backs.
- **Sequence**: party horns and noisemakers.
- **Pop-up**: balloons pop out of party boxes. Don't tap the cake!
- **Charades**: party games and activities (blowing out candles, pin the tail, musical chairs…).
- **Shout**: a "Happy Birthday" singing meter; the cake candles flare up.
- **Runner**: dash through the party jumping presents and chairs, grabbing sweets.

### 2. Easter / Spring
- **Cards** (rhymes): egg, leg, peg, keg · hen, pen, ten, den · then bunny, basket, tulip, chick…
- **Shooter**: catch or tap falling eggs (golden egg).
- **Memory**: painted eggs on the backs.
- **Sequence**: chicks chirping a tune.
- **Pop-up**: bunnies pop out of meadow burrows. Don't tap the hen!
- **Charades**: spring things (egg hunt, hopping bunny, planting flowers…).
- **Shout**: a "chick cheep" meter.
- **Runner**: a bunny hopping over flowerpots, grabbing eggs.

### 3. Summer Beach / Pool Party
- **Cards** (rhymes): sun, bun, run · shell, bell, well · then surfboard, sandcastle, crab, ice cream…
- **Shooter**: splash beach balls with a water pistol.
- **Memory**: seashells on the backs.
- **Sequence**: steel-drum notes on beach things.
- **Pop-up**: crabs pop out of sand holes. Don't tap the seagull!
- **Charades**: summer activities (surfing, building a sandcastle, sunburn…).
- **Shout**: a "Cannonball!" meter; the splash gets bigger.
- **Runner**: a surfer jumping waves and rocks, grabbing ice creams.

### 4. Valentine's Day
Fits the "couples" side of the app.
- **Cards** (rhymes): heart, dart, cart, tart · rose, nose, toes · then chocolate, letter, cupid, ring…
- **Shooter**: Cupid's arrows at floating hearts.
- **Memory**: hearts and roses.
- **Sequence**: love-song notes on hearts.
- **Pop-up**: hearts pop out of windows. Don't tap the grumpy cat!
- **Charades**: famous couples and romantic moments.
- **Shout**: an "I LOVE YOU!" meter.
- **Runner**: Cupid flying over clouds, collecting hearts.

### 5. New Year's Eve
- **Cards** (rhymes): clock, sock, rock, lock · then fireworks, confetti, party popper, countdown…
- **Shooter**: pop the fireworks before they fade.
- **Memory**: party poppers on the backs.
- **Sequence**: a countdown bell sequence.
- **Pop-up**: confetti cannons pop up. Don't tap the sleeping guest!
- **Charades**: New Year's resolutions.
- **Shout**: a "HAPPY NEW YEAR!" meter.
- **Runner**: racing to the party before midnight.

### 6. Carnival
- **Cards** (rhymes): mask, flask, task · drum, gum, thumb · then confetti, juggler, parade, costume…
- **Shooter**: catch flying confetti and streamers.
- **Memory**: masks on the backs.
- **Sequence**: samba drums.
- **Pop-up**: clowns pop out of the parade float. Don't tap the mime!
- **Charades**: costumes and carnival characters.
- **Shout**: a carnival-crowd cheer meter.
- **Runner**: dancing through the parade, jumping drums.

### 7. Space Night
Not tied to a date, so it works any night.
- **Cards** (rhymes): star, car, jar · moon, spoon, balloon · then rocket, astronaut, planet, alien…
- **Shooter**: zap aliens and asteroids.
- **Memory**: planets on the backs.
- **Sequence**: control-panel beeps.
- **Pop-up**: aliens peek out of craters. Don't tap the astronaut!
- **Charades**: space things (moonwalk, rocket launch, zero gravity…).
- **Shout**: a "3, 2, 1, LIFT OFF!" meter; the rocket climbs.
- **Runner**: an astronaut bouncing across the Moon with low gravity, jumping craters.
