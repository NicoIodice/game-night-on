// Copies the icons we use from the game-icons.net set (CC BY 3.0) into theme asset folders.
// An entry is an icon name, or { name, viewBox, fill }: viewBox crops the icon to part of its picture,
// fill paints it a fixed colour (favicons can't inherit `currentColor` from the page).
// Usage: node scripts/extract-icons.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const ICONS = {
  // The browser tab icon on the landing page and festivity picker.
  public: {
    favicon: { name: 'rolling-dices', fill: '#ffc83d' },
  },
  'src/core/ui/icons': {
    'sound-on': 'speaker',
    'sound-off': 'speaker-off',
    microphone: 'microphone',
    person: 'person',
    team: 'three-friends',
    trophy: 'trophy-cup',
    globe: 'globe',
  },
  'src/themes/halloween/assets': {
    cat: 'cat',
    rat: 'rat',
    bat: 'bat',
    hat: 'pointy-hat',
    pumpkin: 'pumpkin-lantern',
    snake: 'snake',
    // Just the stake, without the hammer beside it.
    stake: { name: 'stake-hammer', viewBox: '330 0 182 512' },
    cake: 'cake-slice',
    grave: 'hasty-grave',
    cave: 'cave-entrance',
    witch: 'witch-face',
    cauldron: 'cauldron',
    broom: 'broom',
    ghost: 'ghost',
    spider: 'hanging-spider',
    skeleton: 'skeleton',
    // Extra cards for the Portuguese decks, which need words that rhyme in Portuguese.
    duck: 'duck',
    shoe: 'high-heel',
    coffin: 'coffin',
    dragon: 'dragon-head',
    hand: 'skeletal-hand',
    dog: 'hound',
    favicon: { name: 'pumpkin-lantern', fill: '#ff7a18' },
  },
  'src/games/bat-blitz/assets': {
    'swift-bat': 'swamp-bat',
    'golden-bat': 'evil-bat',
    stalactites: 'stalactites',
  },
  'src/games/snowball-showdown/assets': {
    imp: 'imp',
    'speedy-imp': 'imp-laugh',
    'stolen-present': 'present',
    // Scenery: a row of pines along the snow, and icicles hanging from the top.
    pine: 'pine-tree',
    icicles: 'stalactites',
  },
  'src/games/haunted-house/assets': {
    vampire: 'vampire-dracula',
  },
  'src/games/advent-ambush/assets': {
    imp: 'imp',
    'imp-boss': 'imp-laugh',
  },
  'src/games/trick-or-treat-dash/assets': {
    runner: 'run',
    sweet: 'wrapped-sweet',
  },
  'src/games/gingerbread-dash/assets': {
    'candy-cane': 'candy-canes',
  },
  'src/themes/christmas/assets': {
    tree: 'pine-tree',
    ski: 'skis',
    key: 'key',
    bee: 'bee',
    king: 'king',
    ring: 'ring',
    wing: 'feathered-wing',
    swing: 'tree-swing',
    star: 'polar-star',
    bell: 'ringing-bell',
    candle: 'candle-light',
    present: 'present',
    snowman: 'snowman',
    reindeer: 'deer',
    gingerbread: 'gingerbread-man',
    'santa-hat': 'santa-hat',
    // Extra cards for the Portuguese decks, which need words that rhyme in Portuguese.
    window: 'window',
    pot: 'cooking-pot',
    ice: 'ice-cube',
    camel: 'camel',
    hammer: 'claw-hammer',
    castle: 'castle',
    favicon: { name: 'santa-hat', fill: '#e63946' },
  },
};

const set = JSON.parse(readFileSync('node_modules/@iconify-json/game-icons/icons.json', 'utf8'));
const size = set.width ?? 512;

for (const [dir, icons] of Object.entries(ICONS)) {
  for (const [file, entry] of Object.entries(icons)) {
    const { name, viewBox = `0 0 ${size} ${size}`, fill } = typeof entry === 'string' ? { name: entry } : entry;
    const icon = set.icons[name];
    if (!icon) throw new Error(`Icon "${name}" not found in game-icons`);
    const body = fill ? icon.body.replaceAll('currentColor', fill) : icon.body;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>\n`;
    writeFileSync(`${dir}/${file}.svg`, svg);
    console.log(`${dir}/${file}.svg  <-  game-icons:${name}`);
  }
}
