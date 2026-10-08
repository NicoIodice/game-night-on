# Theme ideas

New festivities to add after Halloween and Christmas, with what each of the 8 games would look like in them.
Themes marked ✅ are built; the notes under them describe what was made.

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

### 1. Birthday Party ✅ built (`birthday`)
Useful all year, not just one night.
- **Cards**: box, fox, socks, rocks · bear, chair, pear, stairs · then balloon, cupcake, gift, candles, lollipop,
  clown, trumpet. Portuguese: balão, camião, leão, avião · corneta, caneta, borboleta, maleta · then bolo, velas,
  prenda, palhaço, chapéu, rebuçado, gelado. (Halloween already has cat, bat, hat, snake and cake.)
- **Balloon Pop** (shooter): pop balloons floating up; balloon dogs are quick, the golden one is the birthday balloon.
- **Party Pairs** (memory): wrapped presents on the backs.
- **Party Band** (sequence): trumpet, drum, maracas, guitar, tambourine and whistle around a party popper.
- **Surprise Boxes** (pop-up): balloons pop out of gift boxes, the piñata is the boss. Don't tap the cake!
- **Party Charades**: party games and birthday moments (blowing out candles, pin the tail, musical chairs…).
- **Birthday Cheer** (shout): HAPPY BIRTHDAY! / PARABÉNS!; the candles ride up the meter.
- **Party Dash** (runner): race through the party jumping presents and chairs, grabbing cupcakes.

### 2. Easter / Spring ✅ built (`easter`)
- **Cards**: frog, log, dog, hog · rain, train, chain, plane · then bunny, egg, basket, carrot, ladybug, butterfly,
  sheep. Portuguese: ninho, moinho, coelhinho, passarinho · bola, gaiola, viola, caçarola · then ovo, galinha,
  cenoura, cesto, joaninha, ovelha, sapo. (game-icons has no chick or peg, hence different rhymes from the idea.)
- **Egg Catch** (shooter): catch painted eggs over a spring meadow; chocolate bunnies are quick, plus a golden egg.
- **Painted Pairs** (memory): painted eggs on the backs.
- **Spring Chorus** (sequence): bird, hen, frog, sheep, duck and bee sing around a nest.
- **Bunny Burrows** (pop-up): bunnies pop out of meadow burrows, a cheeky mole is the boss. Don't tap the hen!
- **Spring Charades**: spring things (egg hunt, hopping bunny, planting flowers…).
- **Cheep Cheep** (shout): CHEEP CHEEP! / PIU PIU!; a little bird learns to fly.
- **Bunny Hop** (runner): the Easter bunny hops flowerpots and fences, grabbing eggs.

### 3. Summer Beach / Pool Party ✅ built (`summer`)
- **Cards**: sail, pail, whale, snail · boat, goat, coat, note · then crab, seagull, starfish, surfboard, sunglasses,
  umbrella, octopus. Portuguese: sol, farol, anzol, caracol · baleia, sereia, meia, teia · then caranguejo, gaivota,
  prancha, polvo, óculos, barco, concha. (Christmas already has bell, and Birthday the ice cream.)
- **Splash Attack** (shooter): splash beach balls with a water pistol; sneaky seagulls are quick, plus a golden starfish.
- **Seashell Pairs** (memory): seashells on the backs.
- **Beach Beats** (sequence): steel-drum notes on the sun, a shell, a palm tree, a crab, a starfish and a pineapple.
- **Sandy Crabs** (pop-up): crabs pop out of sand holes, a sneaky octopus is the boss. Don't tap the seagull!
- **Summer Charades**: summer activities (surfing, building a sandcastle, sunburn…).
- **Cannonball!** (shout): CANNONBALL! / BOMBA!; the diver rides up the meter.
- **Surf Dash** (runner): a surfer jumping rocks and big waves at sunset, grabbing ice creams.

### 4. Valentine's Day ✅ built (`valentine`)
Fits the "couples" side of the app.
- **Cards**: heart, dart, cart, chart · rose, nose, toes, bows · then chocolate, letter, cupid, lips, diamond, flowers,
  cookie. Portuguese: coração, botão, limão, sabão · rainha, varinha, linha, farinha · then rosa, beijo, carta, anel,
  chocolate, cupido, flores. ("Bombom" was dropped: speech recognition sometimes hears "bumbum".)
- **Cupid's Arrows** (shooter): shoot floating hearts; winged hearts are quick, the crowned heart is true love.
- **Sweetheart Pairs** (memory): roses on the backs.
- **Love Song** (sequence): heart, rose, love letter, ring, kiss and chocolate around a lyre.
- **Heart Windows** (pop-up): hearts pop out of windows, Cupid is the boss. Don't tap the grumpy cat!
- **Love Charades**: famous couples and romantic moments.
- **I Love You!** (shout): I LOVE YOU! / AMO-TE!; a winged heart rides up the meter.
- **Cupid's Flight** (runner): Cupid dashes across the clouds, jumping cactuses and rain clouds, collecting hearts.

### 5. New Year's Eve ✅ built (`newyear`)
- **Cards**: clock, sock, rock, lock · ear, deer, spear, pier · then fireworks, sparkler, grapes, calendar, hourglass,
  stopwatch, ticket. Portuguese: foguete, bilhete, tapete, sabonete · espada, escada, almofada, fada · then relógio,
  passas, calendário, ampulheta, cronómetro, estrelinha, confetes. ("Gear" was dropped: it was heard as "here" and
  "dear".)
- **Firework Frenzy** (shooter): burst fireworks over the city skyline; rockets are quick, a shooting star brings luck.
- **Midnight Pairs** (memory): party poppers on the backs.
- **Midnight Chimes** (sequence): clock, firework, grapes, party popper, hourglass and sparkler around a clock tower.
- **Confetti Cannons** (pop-up): confetti cannons pop up from numbered spotlights, a flying cork is the boss. Don't
  wake the sleepy guest!
- **Resolution Charades**: New Year's resolutions.
- **Happy New Year!** (shout): HAPPY NEW YEAR! / FELIZ ANO NOVO!; the firework climbs the meter.
- **Midnight Dash** (runner): racing through the city to the party before midnight, jumping cones and bins.

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
