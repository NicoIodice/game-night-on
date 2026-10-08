import type { Theme } from '../../core/types';
import airplane from './assets/airplane.svg';
import balloon from './assets/balloon.svg';
import bear from './assets/bear.svg';
import box from './assets/box.svg';
import briefcase from './assets/briefcase.svg';
import butterfly from './assets/butterfly.svg';
import cake from './assets/cake.svg';
import candles from './assets/candles.svg';
import chair from './assets/chair.svg';
import clown from './assets/clown.svg';
import cupcake from './assets/cupcake.svg';
import favicon from './assets/favicon.svg';
import fox from './assets/fox.svg';
import gift from './assets/gift.svg';
import horn from './assets/horn.svg';
import iceCream from './assets/ice-cream.svg';
import lion from './assets/lion.svg';
import lollipop from './assets/lollipop.svg';
import partyHat from './assets/party-hat.svg';
import pear from './assets/pear.svg';
import pen from './assets/pen.svg';
import rocks from './assets/rocks.svg';
import socks from './assets/socks.svg';
import stairs from './assets/stairs.svg';
import sweet from './assets/sweet.svg';
import truck from './assets/truck.svg';
import trumpet from './assets/trumpet.svg';
import { birthdayMusic } from './music';
import { createBirthdaySounds } from './sounds';

export const birthday: Theme = {
  id: 'birthday',
  name: { 'en-US': 'Birthday Party', 'pt-PT': 'Festa de Anos' },
  tagline: { 'en-US': 'Party games for every birthday', 'pt-PT': 'Jogos de festa para todos os aniversários' },
  icon: partyHat,
  favicon,
  enabled: true,
  decks: {
    'en-US': [
      [
        { id: 'box', label: 'Box', image: box },
        { id: 'fox', label: 'Fox', image: fox },
        { id: 'socks', label: 'Socks', image: socks, sayAs: ['sock', 'sox'] },
        { id: 'rocks', label: 'Rocks', image: rocks, sayAs: ['rock'] },
      ],
      [
        { id: 'bear', label: 'Bear', image: bear, sayAs: ['bare'] },
        { id: 'chair', label: 'Chair', image: chair },
        { id: 'pear', label: 'Pear', image: pear, sayAs: ['pair', 'pare'] },
        { id: 'stairs', label: 'Stairs', image: stairs, sayAs: ['stair', 'stares', 'stare'] },
      ],
      [
        { id: 'balloon', label: 'Balloon', image: balloon },
        { id: 'cupcake', label: 'Cupcake', image: cupcake, sayAs: ['cup'] },
        { id: 'gift', label: 'Gift', image: gift, sayAs: ['present'] },
        { id: 'candles', label: 'Candles', image: candles, sayAs: ['candle'] },
        { id: 'lollipop', label: 'Lollipop', image: lollipop, sayAs: ['lolly'] },
        { id: 'clown', label: 'Clown', image: clown },
        { id: 'trumpet', label: 'Trumpet', image: trumpet },
      ],
    ],
    // The English rhymes don't rhyme in Portuguese, so the decks keep the idea instead of the
    // words: toys ending in "-ão", then "-eta" words, then the party things of different lengths.
    'pt-PT': [
      [
        { id: 'balao', label: 'Balão', image: balloon, sayAs: ['balões'] },
        { id: 'camiao', label: 'Camião', image: truck, sayAs: ['camiões'] },
        { id: 'leao', label: 'Leão', image: lion, sayAs: ['leões'] },
        { id: 'aviao', label: 'Avião', image: airplane, sayAs: ['aviões'] },
      ],
      [
        { id: 'corneta', label: 'Corneta', image: horn },
        { id: 'caneta', label: 'Caneta', image: pen },
        { id: 'borboleta', label: 'Borboleta', image: butterfly },
        { id: 'maleta', label: 'Maleta', image: briefcase },
      ],
      [
        { id: 'bolo', label: 'Bolo', image: cake },
        { id: 'velas', label: 'Velas', image: candles, sayAs: ['vela'] },
        { id: 'prenda', label: 'Prenda', image: gift, sayAs: ['presente'] },
        { id: 'palhaco', label: 'Palhaço', image: clown },
        { id: 'chapeu', label: 'Chapéu', image: partyHat, sayAs: ['chapéus'] },
        { id: 'rebucado', label: 'Rebuçado', image: sweet, sayAs: ['doce'] },
        { id: 'gelado', label: 'Gelado', image: iceCream },
      ],
    ],
  },
  music: birthdayMusic,
  createSounds: createBirthdaySounds,
};
