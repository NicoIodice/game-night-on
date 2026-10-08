import type { Theme } from '../../core/types';
import bee from './assets/bee.svg';
import bell from './assets/bell.svg';
import candle from './assets/candle.svg';
import favicon from './assets/favicon.svg';
import gingerbread from './assets/gingerbread.svg';
import key from './assets/key.svg';
import king from './assets/king.svg';
import present from './assets/present.svg';
import reindeer from './assets/reindeer.svg';
import ring from './assets/ring.svg';
import santaHat from './assets/santa-hat.svg';
import ski from './assets/ski.svg';
import snowman from './assets/snowman.svg';
import star from './assets/star.svg';
import swing from './assets/swing.svg';
import tree from './assets/tree.svg';
import wing from './assets/wing.svg';
import { christmasMusic } from './music';

export const christmas: Theme = {
  id: 'christmas',
  name: 'Christmas',
  tagline: 'Festive games for the holidays',
  icon: santaHat,
  favicon,
  enabled: true,
  decks: [
    [
      { id: 'tree', label: 'Tree', image: tree },
      { id: 'ski', label: 'Ski', image: ski, sayAs: ['skee'] },
      { id: 'key', label: 'Key', image: key },
      { id: 'bee', label: 'Bee', image: bee, sayAs: ['b', 'be'] },
    ],
    [
      { id: 'king', label: 'King', image: king },
      { id: 'ring', label: 'Ring', image: ring, sayAs: ['wring'] },
      { id: 'wing', label: 'Wing', image: wing },
      { id: 'swing', label: 'Swing', image: swing },
    ],
    [
      { id: 'star', label: 'Star', image: star },
      { id: 'bell', label: 'Bell', image: bell, sayAs: ['belle'] },
      { id: 'candle', label: 'Candle', image: candle },
      { id: 'present', label: 'Present', image: present, sayAs: ['gift', 'presence'] },
      { id: 'snowman', label: 'Snowman', image: snowman, sayAs: ['snowmen', 'snow'] },
      { id: 'reindeer', label: 'Reindeer', image: reindeer, sayAs: ['deer', 'raindeer'] },
      { id: 'gingerbread', label: 'Gingerbread', image: gingerbread, sayAs: ['gingerbreadman', 'ginger'] },
    ],
  ],
  music: christmasMusic,
};
