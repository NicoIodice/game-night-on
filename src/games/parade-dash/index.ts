import drum from '../../themes/carnival/assets/drum.svg';
import feather from '../../themes/carnival/assets/feather.svg';
import juggler from '../../themes/carnival/assets/juggler.svg';
import unicycle from '../../themes/carnival/assets/unicycle.svg';
import { runnerGame } from '../runner/game';
import thumbnail from './assets/thumbnail.jpg';
import './ParadeDash.css';

export const paradeDash = runnerGame(
  {
    id: 'parade-dash',
    title: { 'en-US': 'Parade Dash', 'pt-PT': 'Corrida do Desfile' },
    intro: {
      'en-US':
        "The juggler is late for the parade! Dance down the street, jumping over drums and unicycles without dropping a ball. Bump into three and the balls go flying! The run gets faster the longer you go, and every feather and every step counts.",
      'pt-PT':
        'O malabarista está atrasado para o desfile! Dança pela rua abaixo, a saltar por cima de tambores e monociclos sem deixar cair uma bola. Se chocares com três, as bolas voam pelo ar! A corrida fica mais rápida quanto mais tempo durar, e cada pena e cada passo contam.',
    },
    runner: juggler,
    obstacles: {
      low: { name: { 'en-US': 'Drum', 'pt-PT': 'Tambor' }, image: drum },
      tall: { name: { 'en-US': 'Unicycle', 'pt-PT': 'Monociclo' }, image: unicycle },
    },
    treat: { name: { 'en-US': 'Feather', 'pt-PT': 'Pena' }, image: feather },
    treatNoun: { 'en-US': ['feather', 'feathers'], 'pt-PT': ['pena', 'penas'] },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Dance down the parade route, jumping drums and unicycles and grabbing feathers!',
      'pt-PT': 'Dança pelo percurso do desfile, a saltar tambores e monociclos e a apanhar penas!',
    },
    themes: ['carnival'],
    thumbnail,
  },
);
