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
    favicon: { name: 'pumpkin-lantern', fill: '#ff7a18' },
  },
  'src/games/bat-blitz/assets': {
    'swift-bat': 'swamp-bat',
    'golden-bat': 'evil-bat',
    stalactites: 'stalactites',
  },
  'src/themes/christmas/assets': {
    'santa-hat': 'santa-hat',
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
