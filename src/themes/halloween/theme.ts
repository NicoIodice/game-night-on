import type { Theme } from '../../core/types';
import bat from './assets/bat.svg';
import broom from './assets/broom.svg';
import cake from './assets/cake.svg';
import cat from './assets/cat.svg';
import cauldron from './assets/cauldron.svg';
import cave from './assets/cave.svg';
import coffin from './assets/coffin.svg';
import dog from './assets/dog.svg';
import dragon from './assets/dragon.svg';
import duck from './assets/duck.svg';
import favicon from './assets/favicon.svg';
import ghost from './assets/ghost.svg';
import grave from './assets/grave.svg';
import hand from './assets/hand.svg';
import hat from './assets/hat.svg';
import pumpkin from './assets/pumpkin.svg';
import rat from './assets/rat.svg';
import shoe from './assets/shoe.svg';
import skeleton from './assets/skeleton.svg';
import snake from './assets/snake.svg';
import spider from './assets/spider.svg';
import stake from './assets/stake.svg';
import witch from './assets/witch.svg';
import { halloweenMusic } from './music';
import { createHalloweenSounds } from './sounds';

export const halloween: Theme = {
  id: 'halloween',
  name: { 'en-US': 'Halloween', 'pt-PT': 'Halloween' },
  tagline: { 'en-US': 'Spooky games for a frightful night', 'pt-PT': 'Jogos assustadores para uma noite de arrepiar' },
  icon: pumpkin,
  favicon,
  enabled: true,
  decks: {
    'en-US': [
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
    // The English rhymes don't rhyme in Portuguese (gato, rato, morcego, chapéu), so the decks keep
    // the idea instead of the words: "-ato" pairs that differ by one sound, then "-ão" words of
    // different lengths, then the classic Halloween words.
    'pt-PT': [
      [
        { id: 'gato', label: 'Gato', image: cat },
        { id: 'rato', label: 'Rato', image: rat },
        { id: 'pato', label: 'Pato', image: duck },
        { id: 'sapato', label: 'Sapato', image: shoe },
      ],
      [
        { id: 'caixao', label: 'Caixão', image: coffin, sayAs: ['caixões'] },
        { id: 'caldeirao', label: 'Caldeirão', image: cauldron, sayAs: ['caldeirões'] },
        { id: 'dragao', label: 'Dragão', image: dragon, sayAs: ['dragões'] },
        { id: 'mao', label: 'Mão', image: hand },
        { id: 'cao', label: 'Cão', image: dog, sayAs: ['cães'] },
      ],
      [
        { id: 'abobora', label: 'Abóbora', image: pumpkin },
        { id: 'bruxa', label: 'Bruxa', image: witch },
        { id: 'vassoura', label: 'Vassoura', image: broom },
        { id: 'fantasma', label: 'Fantasma', image: ghost },
        { id: 'aranha', label: 'Aranha', image: spider },
        { id: 'esqueleto', label: 'Esqueleto', image: skeleton },
        { id: 'morcego', label: 'Morcego', image: bat },
      ],
    ],
  },
  music: halloweenMusic,
  createSounds: createHalloweenSounds,
};
