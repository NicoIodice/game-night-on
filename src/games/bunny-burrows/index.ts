import bunny from '../../themes/easter/assets/bunny.svg';
import chicken from '../../themes/easter/assets/chicken.svg';
import { peekGame } from '../peekaboo/game';
import mole from './assets/mole.svg';
import thumbnail from './assets/thumbnail.jpg';
import './BunnyBurrows.css';

export const bunnyBurrows = peekGame(
  {
    id: 'bunny-burrows',
    title: { 'en-US': 'Bunny Burrows', 'pt-PT': 'Tocas dos Coelhos' },
    intro: {
      'en-US':
        "The Easter bunnies are hiding the eggs and won't sit still! Tap them as they pop out of their burrows, and catch the cheeky mole for extra points. But the hen is only looking for her eggs, so don't bonk her!",
      'pt-PT':
        'Os coelhos da Páscoa andam a esconder os ovos e não param quietos! Toca-lhes quando saírem das tocas, e apanha a toupeira marota para ganhares pontos extra. Mas a galinha só anda à procura dos ovos dela, por isso não lhe toques!',
    },
    kinds: {
      rascal: { name: { 'en-US': 'Bunny', 'pt-PT': 'Coelho' }, image: bunny },
      boss: { name: { 'en-US': 'Cheeky mole', 'pt-PT': 'Toupeira marota' }, image: mole },
      friend: { name: { 'en-US': 'Hen', 'pt-PT': 'Galinha' }, image: chicken },
    },
    caughtNoun: { 'en-US': ['bunny caught', 'bunnies caught'], 'pt-PT': ['coelho apanhado', 'coelhos apanhados'] },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Bunnies pop out of their meadow burrows. Tap them quick, but leave the hen alone!',
      'pt-PT': 'Os coelhos saltam das tocas no prado. Toca-lhes depressa, mas deixa a galinha em paz!',
    },
    themes: ['easter'],
    thumbnail,
  },
);
