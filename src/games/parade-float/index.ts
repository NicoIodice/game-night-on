import clown from '../../themes/carnival/assets/clown.svg';
import jester from '../../themes/carnival/assets/jester.svg';
import { peekGame } from '../peekaboo/game';
import mime from './assets/mime.svg';
import thumbnail from './assets/thumbnail.jpg';
import './ParadeFloat.css';

export const paradeFloat = peekGame(
  {
    id: 'parade-float',
    title: { 'en-US': 'Parade Float', 'pt-PT': 'Carro Alegórico' },
    intro: {
      'en-US':
        "The clowns are playing peekaboo on the parade float! Tap them as they pop out, and catch the jester for extra points. But the mime is doing a very serious show, so don't bonk them!",
      'pt-PT':
        'Os palhaços estão a brincar às escondidas no carro alegórico! Toca-lhes quando aparecerem, e apanha o bobo para ganhares pontos extra. Mas o mimo está a fazer um espetáculo muito sério, por isso não lhe toques!',
    },
    kinds: {
      rascal: { name: { 'en-US': 'Clown', 'pt-PT': 'Palhaço' }, image: clown },
      boss: { name: { 'en-US': 'Jester', 'pt-PT': 'Bobo' }, image: jester },
      friend: { name: { 'en-US': 'Mime', 'pt-PT': 'Mimo' }, image: mime },
    },
    caughtNoun: { 'en-US': ['clown caught', 'clowns caught'], 'pt-PT': ['palhaço apanhado', 'palhaços apanhados'] },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Clowns pop out of the parade float. Tap them quick, but leave the mime alone!',
      'pt-PT': 'Os palhaços saltam do carro alegórico. Toca-lhes depressa, mas deixa o mimo em paz!',
    },
    themes: ['carnival'],
    thumbnail,
  },
);
