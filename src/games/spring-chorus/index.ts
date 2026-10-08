import bird from '../../themes/easter/assets/bird.svg';
import chicken from '../../themes/easter/assets/chicken.svg';
import frog from '../../themes/easter/assets/frog.svg';
import sheep from '../../themes/easter/assets/sheep.svg';
import { sequenceGame } from '../sequence/game';
import bee from './assets/bee.svg';
import duck from './assets/duck.svg';
import nest from './assets/nest.svg';
import thumbnail from './assets/thumbnail.jpg';
import './SpringChorus.css';

export const springChorus = sequenceGame(
  {
    id: 'spring-chorus',
    title: { 'en-US': 'Spring Chorus', 'pt-PT': 'Coro da Primavera' },
    intro: {
      'en-US':
        'The farm animals are singing to welcome spring! Watch who sings, in order, then tap them back the same way. Each time you get it right, the song grows by one note. Pick the wrong singer and the chorus stops!',
      'pt-PT':
        'Os animais da quinta estão a cantar para receber a primavera! Observa quem canta, e por que ordem, e depois toca-lhes da mesma maneira. Sempre que acertas, a canção cresce mais uma nota. Escolhe o cantor errado e o coro para!',
    },
    center: nest,
    // A sunny pentatonic scale: any order sounds like birdsong.
    pads: [
      { name: { 'en-US': 'Bird', 'pt-PT': 'Passarinho' }, image: bird, color: '#9ee6ff', note: 'C5' },
      { name: { 'en-US': 'Hen', 'pt-PT': 'Galinha' }, image: chicken, color: '#ffd84d', note: 'D5' },
      { name: { 'en-US': 'Frog', 'pt-PT': 'Sapo' }, image: frog, color: '#7ee08a', note: 'E5' },
      { name: { 'en-US': 'Sheep', 'pt-PT': 'Ovelha' }, image: sheep, color: '#f6fbff', note: 'G5' },
      { name: { 'en-US': 'Duck', 'pt-PT': 'Pato' }, image: duck, color: '#ff9f5a', note: 'A5' },
      { name: { 'en-US': 'Bee', 'pt-PT': 'Abelha' }, image: bee, color: '#ff9ccf', note: 'C6' },
    ],
    outTitle: { 'en-US': 'Wrong singer!', 'pt-PT': 'Cantor errado!' },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Watch the spring animals sing, then play them back in the same order. The song grows every round!',
      'pt-PT': 'Observa os animais da primavera a cantar e repete-os pela mesma ordem. A canção cresce a cada ronda!',
    },
    themes: ['easter'],
    thumbnail,
  },
);
