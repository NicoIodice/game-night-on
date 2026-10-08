import type { Theme } from '../../core/types';
import bows from './assets/bows.svg';
import button from './assets/button.svg';
import cart from './assets/cart.svg';
import chart from './assets/chart.svg';
import chocolate from './assets/chocolate.svg';
import cookie from './assets/cookie.svg';
import cupid from './assets/cupid.svg';
import dart from './assets/dart.svg';
import favicon from './assets/favicon.svg';
import flour from './assets/flour.svg';
import flowers from './assets/flowers.svg';
import heart from './assets/heart.svg';
import lemon from './assets/lemon.svg';
import letter from './assets/letter.svg';
import lips from './assets/lips.svg';
import nose from './assets/nose.svg';
import queen from './assets/queen.svg';
import ring from './assets/ring.svg';
import rose from './assets/rose.svg';
import soap from './assets/soap.svg';
import thread from './assets/thread.svg';
import toes from './assets/toes.svg';
import wand from './assets/wand.svg';
import { valentineMusic } from './music';
import { createValentineSounds } from './sounds';

export const valentine: Theme = {
  id: 'valentine',
  name: { 'en-US': "Valentine's Day", 'pt-PT': 'Dia dos Namorados' },
  tagline: { 'en-US': 'Sweet games for couples and crushes', 'pt-PT': 'Jogos doces para casais e apaixonados' },
  icon: heart,
  favicon,
  enabled: true,
  decks: {
    'en-US': [
      [
        { id: 'heart', label: 'Heart', image: heart, sayAs: ['hart'] },
        { id: 'dart', label: 'Dart', image: dart },
        { id: 'cart', label: 'Cart', image: cart, sayAs: ['kart'] },
        { id: 'chart', label: 'Chart', image: chart },
      ],
      [
        { id: 'rose', label: 'Rose', image: rose, sayAs: ['rows'] },
        { id: 'nose', label: 'Nose', image: nose, sayAs: ['knows'] },
        { id: 'toes', label: 'Toes', image: toes, sayAs: ['toe', 'tows'] },
        { id: 'bows', label: 'Bows', image: bows, sayAs: ['bow', 'beaus'] },
      ],
      [
        { id: 'chocolate', label: 'Chocolate', image: chocolate },
        { id: 'letter', label: 'Letter', image: letter },
        { id: 'cupid', label: 'Cupid', image: cupid },
        { id: 'lips', label: 'Lips', image: lips, sayAs: ['lip', 'kiss'] },
        { id: 'diamond', label: 'Diamond', image: ring, sayAs: ['ring'] },
        { id: 'flowers', label: 'Flowers', image: flowers, sayAs: ['flower'] },
        { id: 'cookie', label: 'Cookie', image: cookie },
      ],
    ],
    // The English rhymes don't rhyme in Portuguese, so the decks keep the idea instead of the
    // words: "-ão" words starting with the heart, then "-inha" words, then the Valentine words of different lengths.
    'pt-PT': [
      [
        { id: 'coracao', label: 'Coração', image: heart, sayAs: ['corações'] },
        { id: 'botao', label: 'Botão', image: button, sayAs: ['botões'] },
        { id: 'limao', label: 'Limão', image: lemon, sayAs: ['limões'] },
        { id: 'sabao', label: 'Sabão', image: soap },
      ],
      [
        { id: 'rainha', label: 'Rainha', image: queen },
        { id: 'varinha', label: 'Varinha', image: wand },
        { id: 'linha', label: 'Linha', image: thread },
        { id: 'farinha', label: 'Farinha', image: flour },
      ],
      [
        { id: 'rosa', label: 'Rosa', image: rose },
        { id: 'beijo', label: 'Beijo', image: lips },
        { id: 'carta', label: 'Carta', image: letter },
        { id: 'anel', label: 'Anel', image: ring },
        // Card ids are unique across languages, and English already has "chocolate".
        { id: 'chocolate-pt', label: 'Chocolate', image: chocolate, sayAs: ['bombom'] },
        { id: 'cupido', label: 'Cupido', image: cupid },
        { id: 'flores', label: 'Flores', image: flowers, sayAs: ['flor'] },
      ],
    ],
  },
  music: valentineMusic,
  createSounds: createValentineSounds,
};
