import type { Theme } from '../../core/types';
import ball from './assets/ball.svg';
import basket from './assets/basket.svg';
import bird from './assets/bird.svg';
import bunny from './assets/bunny.svg';
import butterfly from './assets/butterfly.svg';
import cage from './assets/cage.svg';
import carrot from './assets/carrot.svg';
import chain from './assets/chain.svg';
import chicken from './assets/chicken.svg';
import dog from './assets/dog.svg';
import egg from './assets/egg.svg';
import favicon from './assets/favicon.svg';
import frog from './assets/frog.svg';
import guitar from './assets/guitar.svg';
import hog from './assets/hog.svg';
import ladybug from './assets/ladybug.svg';
import log from './assets/log.svg';
import nest from './assets/nest.svg';
import plane from './assets/plane.svg';
import pot from './assets/pot.svg';
import rain from './assets/rain.svg';
import sheep from './assets/sheep.svg';
import train from './assets/train.svg';
import windmill from './assets/windmill.svg';
import { easterMusic } from './music';
import { createEasterSounds } from './sounds';

export const easter: Theme = {
  id: 'easter',
  name: { 'en-US': 'Easter', 'pt-PT': 'Páscoa' },
  tagline: { 'en-US': 'Springtime games for Easter', 'pt-PT': 'Jogos primaveris para a Páscoa' },
  icon: egg,
  favicon,
  enabled: true,
  decks: {
    'en-US': [
      [
        { id: 'frog', label: 'Frog', image: frog },
        { id: 'log', label: 'Log', image: log },
        { id: 'dog', label: 'Dog', image: dog },
        { id: 'hog', label: 'Hog', image: hog, sayAs: ['pig'] },
      ],
      [
        { id: 'rain', label: 'Rain', image: rain, sayAs: ['reign', 'rein'] },
        { id: 'train', label: 'Train', image: train },
        { id: 'chain', label: 'Chain', image: chain },
        { id: 'plane', label: 'Plane', image: plane, sayAs: ['plain'] },
      ],
      [
        { id: 'bunny', label: 'Bunny', image: bunny, sayAs: ['rabbit'] },
        { id: 'egg', label: 'Egg', image: egg },
        { id: 'basket', label: 'Basket', image: basket },
        { id: 'carrot', label: 'Carrot', image: carrot, sayAs: ['carat', 'karat'] },
        { id: 'ladybug', label: 'Ladybug', image: ladybug, sayAs: ['ladybird'] },
        { id: 'butterfly', label: 'Butterfly', image: butterfly },
        { id: 'sheep', label: 'Sheep', image: sheep, sayAs: ['lamb'] },
      ],
    ],
    // The English rhymes don't rhyme in Portuguese, so the decks keep the idea instead of the
    // words: little spring things ending in "-inho", then "-ola" words, then the Easter words of different lengths.
    'pt-PT': [
      [
        { id: 'ninho', label: 'Ninho', image: nest },
        { id: 'moinho', label: 'Moinho', image: windmill },
        { id: 'coelhinho', label: 'Coelhinho', image: bunny, sayAs: ['coelho'] },
        { id: 'passarinho', label: 'Passarinho', image: bird, sayAs: ['pássaro'] },
      ],
      [
        { id: 'bola', label: 'Bola', image: ball },
        { id: 'gaiola', label: 'Gaiola', image: cage },
        { id: 'viola', label: 'Viola', image: guitar },
        { id: 'cacarola', label: 'Caçarola', image: pot },
      ],
      [
        // A lone "ovo" is often heard as "povo" or "novo".
        { id: 'ovo', label: 'Ovo', image: egg, sayAs: ['povo', 'novo'] },
        { id: 'galinha', label: 'Galinha', image: chicken },
        { id: 'cenoura', label: 'Cenoura', image: carrot },
        { id: 'cesto', label: 'Cesto', image: basket },
        { id: 'joaninha', label: 'Joaninha', image: ladybug },
        { id: 'ovelha', label: 'Ovelha', image: sheep },
        { id: 'sapo', label: 'Sapo', image: frog },
      ],
    ],
  },
  music: easterMusic,
  createSounds: createEasterSounds,
};
