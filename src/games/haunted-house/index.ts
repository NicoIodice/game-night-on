import cat from '../../themes/halloween/assets/cat.svg';
import ghost from '../../themes/halloween/assets/ghost.svg';
import { peekGame } from '../peekaboo/game';
import thumbnail from './assets/thumbnail.jpg';
import vampire from './assets/vampire.svg';
import './HauntedHouse.css';

export const hauntedHouse = peekGame(
  {
    id: 'haunted-house',
    title: { 'en-US': 'Haunted House', 'pt-PT': 'Casa Assombrada' },
    intro: {
      'en-US':
        "Ghosts are peeking out of every window of the haunted house! Tap them before they hide again, and catch the vampire for extra points. But watch out for the black cat: it lives here, so don't bonk it!",
      'pt-PT':
        'Há fantasmas a espreitar por todas as janelas da casa assombrada! Toca-lhes antes que se escondam outra vez, e apanha o vampiro para ganhares pontos extra. Mas cuidado com o gato preto: ele vive aqui, por isso não lhe toques!',
    },
    kinds: {
      rascal: { name: { 'en-US': 'Ghost', 'pt-PT': 'Fantasma' }, image: ghost },
      boss: { name: { 'en-US': 'Vampire', 'pt-PT': 'Vampiro' }, image: vampire },
      friend: { name: { 'en-US': 'Cat', 'pt-PT': 'Gato' }, image: cat },
    },
    caughtNoun: { 'en-US': ['ghost caught', 'ghosts caught'], 'pt-PT': ['fantasma apanhado', 'fantasmas apanhados'] },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Ghosts peek out of the haunted windows. Tap them quick, but leave the black cat alone!',
      'pt-PT': 'Os fantasmas espreitam pelas janelas assombradas. Toca-lhes depressa, mas deixa o gato preto em paz!',
    },
    themes: ['halloween'],
    thumbnail,
  },
);
