import cupid from '../../themes/valentine/assets/cupid.svg';
import heart from '../../themes/valentine/assets/heart.svg';
import { peekGame } from '../peekaboo/game';
import cat from './assets/cat.svg';
import thumbnail from './assets/thumbnail.jpg';
import './HeartWindows.css';

export const heartWindows = peekGame(
  {
    id: 'heart-windows',
    title: { 'en-US': 'Heart Windows', 'pt-PT': 'Janelas do Coração' },
    intro: {
      'en-US':
        "Love is in the air, and hearts are popping out of every window! Tap them as they appear, and catch Cupid for extra points. But the grumpy cat doesn't like Valentine's Day, so don't bonk it!",
      'pt-PT':
        'Anda amor no ar, e há corações a espreitar de todas as janelas! Toca-lhes quando aparecerem, e apanha o Cupido para ganhares pontos extra. Mas o gato rabugento não gosta do Dia dos Namorados, por isso não lhe toques!',
    },
    kinds: {
      rascal: { name: { 'en-US': 'Heart', 'pt-PT': 'Coração' }, image: heart },
      boss: { name: { 'en-US': 'Cupid', 'pt-PT': 'Cupido' }, image: cupid },
      friend: { name: { 'en-US': 'Grumpy cat', 'pt-PT': 'Gato rabugento' }, image: cat },
    },
    caughtNoun: { 'en-US': ['heart caught', 'hearts caught'], 'pt-PT': ['coração apanhado', 'corações apanhados'] },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Hearts pop out of every window. Tap them quick, but leave the grumpy cat alone!',
      'pt-PT': 'Os corações espreitam de todas as janelas. Toca-lhes depressa, mas deixa o gato rabugento em paz!',
    },
    themes: ['valentine'],
    thumbnail,
  },
);
