// Copies the icons we use from the game-icons.net set (CC BY 3.0) into theme asset folders.
// Usage: node scripts/extract-icons.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const ICONS = {
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
  },
  'src/games/bat-blitz/assets': {
    'swift-bat': 'swamp-bat',
    'golden-bat': 'evil-bat',
    stalactites: 'stalactites',
  },
  'src/themes/christmas/assets': {
    'santa-hat': 'santa-hat',
  },
};

const set = JSON.parse(readFileSync('node_modules/@iconify-json/game-icons/icons.json', 'utf8'));
const size = set.width ?? 512;

for (const [dir, icons] of Object.entries(ICONS)) {
  for (const [file, name] of Object.entries(icons)) {
    const icon = set.icons[name];
    if (!icon) throw new Error(`Icon "${name}" not found in game-icons`);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">${icon.body}</svg>\n`;
    writeFileSync(`${dir}/${file}.svg`, svg);
    console.log(`${dir}/${file}.svg  <-  game-icons:${name}`);
  }
}
