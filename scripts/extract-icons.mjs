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
  'src/themes/birthday/assets': {
    box: 'cardboard-box-closed',
    fox: 'fox',
    socks: 'socks',
    rocks: 'rock',
    bear: 'bear-head',
    chair: 'wooden-chair',
    pear: 'pear',
    stairs: 'stairs',
    balloon: 'balloons',
    cupcake: 'cupcake',
    gift: 'present',
    candles: 'candles',
    lollipop: 'spiral-lollipop',
    clown: 'clown',
    trumpet: 'trumpet',
    'party-hat': 'party-hat',
    // Extra cards for the Portuguese decks, which need words that rhyme in Portuguese.
    truck: 'truck',
    lion: 'lion',
    airplane: 'airplane',
    horn: 'hunting-horn',
    pen: 'fountain-pen',
    butterfly: 'butterfly',
    briefcase: 'briefcase',
    cake: 'stairs-cake',
    sweet: 'wrapped-sweet',
    'ice-cream': 'ice-cream-cone',
    favicon: { name: 'party-hat', fill: '#ff5fa2' },
  },
  'src/games/balloon-pop/assets': {
    'balloon-dog': 'balloon-dog',
    // Scenery: party bunting along the top.
    bunting: 'party-flags',
  },
  'src/games/party-band/assets': {
    popper: 'party-popper',
    drum: 'drum',
    maracas: 'maracas',
    tambourine: 'tambourine',
    guitar: 'guitar',
    whistle: 'whistle',
  },
  'src/games/surprise-boxes/assets': {
    pinata: 'pinata',
  },
  'src/games/party-dash/assets': {
    runner: 'run',
  },
  'src/themes/easter/assets': {
    frog: 'frog',
    log: 'log',
    dog: 'hound',
    hog: 'pig',
    rain: 'raining',
    train: 'steam-locomotive',
    chain: 'crossed-chains',
    plane: 'airplane',
    bunny: 'rabbit',
    egg: 'easter-egg',
    basket: 'basket',
    carrot: 'carrot',
    ladybug: 'ladybug',
    butterfly: 'butterfly',
    sheep: 'sheep',
    chicken: 'chicken',
    // Extra cards for the Portuguese decks, which need words that rhyme in Portuguese.
    nest: 'nest-eggs',
    windmill: 'windmill',
    bird: 'hummingbird',
    ball: 'soccer-ball',
    cage: 'bird-cage',
    guitar: 'guitar',
    pot: 'cooking-pot',
    favicon: { name: 'easter-egg', fill: '#ffd84d' },
  },
  'src/games/egg-catch/assets': {
    // Scenery: daisies along the meadow.
    daisy: 'daisy',
  },
  'src/games/spring-chorus/assets': {
    nest: 'nest-birds',
    duck: 'duck',
    bee: 'bee',
  },
  'src/games/bunny-burrows/assets': {
    mole: 'mole',
  },
  'src/games/bunny-hop/assets': {
    'flower-pot': 'flower-pot',
    fence: 'wooden-fence',
  },
  'src/themes/summer/assets': {
    sail: 'sailboat',
    pail: 'beach-bucket',
    whale: 'sperm-whale',
    snail: 'snail',
    boat: 'speed-boat',
    goat: 'goat',
    coat: 'lab-coat',
    note: 'musical-notes',
    crab: 'crab',
    seagull: 'seagull',
    starfish: 'sea-star',
    surfboard: 'surf-board',
    sunglasses: 'sunglasses',
    umbrella: 'umbrella',
    octopus: 'octopus',
    // Extra cards for the Portuguese decks, which need words that rhyme in Portuguese.
    sun: 'sun',
    lighthouse: 'lighthouse',
    hook: 'fishing-hook',
    mermaid: 'mermaid',
    socks: 'socks',
    web: 'spider-web',
    shell: 'spiral-shell',
    favicon: { name: 'sun', fill: '#ffb347' },
  },
  'src/games/splash-attack/assets': {
    'beach-ball': 'beach-ball',
  },
  'src/games/beach-beats/assets': {
    drum: 'drum',
    palm: 'palm-tree',
    pineapple: 'pineapple',
  },
  'src/games/cannonball/assets': {
    diver: 'pool-dive',
  },
  'src/games/surf-dash/assets': {
    surfer: 'wave-surfer',
    rock: 'rock',
    wave: 'big-wave',
    'ice-cream': 'ice-cream-cone',
  },
  'src/themes/valentine/assets': {
    heart: 'hearts',
    dart: 'dart',
    cart: 'shopping-cart',
    chart: 'pie-chart',
    rose: 'rose',
    nose: 'nose-front',
    toes: 'footprint',
    bows: 'bow-tie-ribbon',
    chocolate: 'chocolate-bar',
    letter: 'love-letter',
    cupid: 'angel-wings',
    lips: 'lips',
    ring: 'diamond-ring',
    flowers: 'flowers',
    cookie: 'cookie',
    'winged-heart': 'heart-wings',
    // Extra cards for the Portuguese decks, which need words that rhyme in Portuguese.
    button: 'shirt-button',
    lemon: 'lemon',
    soap: 'soap',
    queen: 'queen-crown',
    wand: 'fairy-wand',
    thread: 'sewing-string',
    flour: 'flour',
    favicon: { name: 'hearts', fill: '#ff4d8d' },
  },
  'src/games/cupids-arrows/assets': {
    'golden-heart': 'crowned-heart',
  },
  'src/games/love-song/assets': {
    lyre: 'lyre',
  },
  'src/games/heart-windows/assets': {
    cat: 'cat',
  },
  'src/games/cupids-flight/assets': {
    cactus: 'cactus',
    cloud: 'raining',
  },
  'src/themes/newyear/assets': {
    clock: 'alarm-clock',
    sock: 'socks',
    rock: 'rock',
    lock: 'padlock',
    ear: 'human-ear',
    deer: 'deer',
    spear: 'spears',
    pier: 'wooden-pier',
    rocket: 'firework-rocket',
    sparkler: 'sparkles',
    grapes: 'grapes',
    calendar: 'calendar',
    hourglass: 'hourglass',
    stopwatch: 'stopwatch',
    ticket: 'ticket',
    popper: 'party-popper',
    // Extra cards for the Portuguese decks, which need words that rhyme in Portuguese.
    carpet: 'red-carpet',
    soap: 'soap',
    sword: 'pointy-sword',
    ladder: 'ladder',
    pillow: 'pillow',
    fairy: 'fairy',
    favicon: { name: 'firework-rocket', fill: '#c77dff' },
  },
  'src/games/firework-frenzy/assets': {
    firework: 'circle-sparks',
    'shooting-star': 'comet-spark',
  },
  'src/games/midnight-chimes/assets': {
    'clock-tower': 'clock-tower',
  },
  'src/games/confetti-cannons/assets': {
    cork: 'champagne-cork',
    sleepy: 'sleepy',
  },
  'src/games/midnight-dash/assets': {
    runner: 'run',
    cone: 'traffic-cone',
    bin: 'trash-can',
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
