import type { Theme } from '../../core/types';
import bat from './assets/bat.svg';
import broom from './assets/broom.svg';
import cake from './assets/cake.svg';
import cat from './assets/cat.svg';
import cauldron from './assets/cauldron.svg';
import cave from './assets/cave.svg';
import favicon from './assets/favicon.svg';
import ghost from './assets/ghost.svg';
import grave from './assets/grave.svg';
import hat from './assets/hat.svg';
import pumpkin from './assets/pumpkin.svg';
import rat from './assets/rat.svg';
import skeleton from './assets/skeleton.svg';
import snake from './assets/snake.svg';
import spider from './assets/spider.svg';
import stake from './assets/stake.svg';
import witch from './assets/witch.svg';
import { halloweenMusic } from './music';
import { createHalloweenSounds } from './sounds';

export const halloween: Theme = {
  id: 'halloween',
  name: 'Halloween',
  tagline: 'Spooky games for a frightful night',
  icon: pumpkin,
  favicon,
  enabled: true,
  decks: [
    [
      { id: 'cat', label: 'Cat', image: cat, sayAs: ['kat'] },
      { id: 'rat', label: 'Rat', image: rat },
      { id: 'bat', label: 'Bat', image: bat },
      { id: 'hat', label: 'Hat', image: hat },
    ],
    [
      { id: 'snake', label: 'Snake', image: snake },
      { id: 'stake', label: 'Stake', image: stake, sayAs: ['steak'] },
      { id: 'cake', label: 'Cake', image: cake },
      { id: 'grave', label: 'Grave', image: grave },
      { id: 'cave', label: 'Cave', image: cave },
    ],
    [
      { id: 'pumpkin', label: 'Pumpkin', image: pumpkin },
      { id: 'witch', label: 'Witch', image: witch, sayAs: ['which'] },
      { id: 'cauldron', label: 'Cauldron', image: cauldron, sayAs: ['caldron'] },
      { id: 'broom', label: 'Broom', image: broom },
      { id: 'ghost', label: 'Ghost', image: ghost },
      { id: 'spider', label: 'Spider', image: spider },
      { id: 'skeleton', label: 'Skeleton', image: skeleton },
    ],
  ],
  music: halloweenMusic,
  createSounds: createHalloweenSounds,
};
