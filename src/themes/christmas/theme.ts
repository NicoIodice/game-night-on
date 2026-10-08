import type { Theme } from '../../core/types';
import bee from './assets/bee.svg';
import bell from './assets/bell.svg';
import camel from './assets/camel.svg';
import candle from './assets/candle.svg';
import castle from './assets/castle.svg';
import favicon from './assets/favicon.svg';
import gingerbread from './assets/gingerbread.svg';
import hammer from './assets/hammer.svg';
import ice from './assets/ice.svg';
import key from './assets/key.svg';
import king from './assets/king.svg';
import pot from './assets/pot.svg';
import present from './assets/present.svg';
import reindeer from './assets/reindeer.svg';
import ring from './assets/ring.svg';
import santaHat from './assets/santa-hat.svg';
import ski from './assets/ski.svg';
import snowman from './assets/snowman.svg';
import star from './assets/star.svg';
import swing from './assets/swing.svg';
import tree from './assets/tree.svg';
import windowPane from './assets/window.svg';
import wing from './assets/wing.svg';
import { christmasMusic } from './music';
import { createChristmasSounds } from './sounds';

export const christmas: Theme = {
  id: 'christmas',
  name: { 'en-US': 'Christmas', 'pt-PT': 'Natal' },
  tagline: { 'en-US': 'Festive games for the holidays', 'pt-PT': 'Jogos festivos para a quadra natalícia' },
  icon: santaHat,
  favicon,
  enabled: true,
  decks: {
    'en-US': [
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
    // The English rhymes don't rhyme in Portuguese, so the decks keep the idea instead of the
    // words: "-ela" words, then "-elo" words, then the classic Christmas words of different lengths.
    'pt-PT': [
      [
        // Portuguese speech recognition often hears "vela" as "bela".
        { id: 'vela', label: 'Vela', image: candle, sayAs: ['bela'] },
        { id: 'estrela', label: 'Estrela', image: star },
        { id: 'janela', label: 'Janela', image: windowPane },
        { id: 'panela', label: 'Panela', image: pot },
      ],
      [
        { id: 'gelo', label: 'Gelo', image: ice },
        { id: 'camelo', label: 'Camelo', image: camel },
        { id: 'martelo', label: 'Martelo', image: hammer },
        { id: 'castelo', label: 'Castelo', image: castle },
      ],
      [
        { id: 'rei', label: 'Rei', image: king },
        { id: 'sino', label: 'Sino', image: bell },
        { id: 'rena', label: 'Rena', image: reindeer },
        { id: 'gorro', label: 'Gorro', image: santaHat, sayAs: ['barrete'] },
        { id: 'arvore', label: 'Árvore', image: tree },
        { id: 'presente', label: 'Presente', image: present, sayAs: ['prenda'] },
        { id: 'bolacha', label: 'Bolacha', image: gingerbread, sayAs: ['boneco', 'gengibre'] },
      ],
    ],
  },
  music: christmasMusic,
  createSounds: createChristmasSounds,
};
