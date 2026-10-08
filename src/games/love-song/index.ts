import chocolate from '../../themes/valentine/assets/chocolate.svg';
import heart from '../../themes/valentine/assets/heart.svg';
import letter from '../../themes/valentine/assets/letter.svg';
import lips from '../../themes/valentine/assets/lips.svg';
import ring from '../../themes/valentine/assets/ring.svg';
import rose from '../../themes/valentine/assets/rose.svg';
import { sequenceGame } from '../sequence/game';
import lyre from './assets/lyre.svg';
import thumbnail from './assets/thumbnail.jpg';
import './LoveSong.css';

export const loveSong = sequenceGame(
  {
    id: 'love-song',
    title: { 'en-US': 'Love Song', 'pt-PT': 'Canção de Amor' },
    intro: {
      'en-US':
        'Cupid is writing a love song! Watch which sweet things sing, in order, then tap them back the same way. Each time you get it right, the serenade grows by one note. Hit a wrong note and the romance is over!',
      'pt-PT':
        'O Cupido está a escrever uma canção de amor! Observa que coisas doces cantam, e por que ordem, e depois toca-lhes da mesma maneira. Sempre que acertas, a serenata cresce mais uma nota. Falha uma nota e o romance acaba!',
    },
    center: lyre,
    // A tender minor scale for a serenade.
    pads: [
      { name: { 'en-US': 'Heart', 'pt-PT': 'Coração' }, image: heart, color: '#ff4d8d', note: 'A4' },
      { name: { 'en-US': 'Rose', 'pt-PT': 'Rosa' }, image: rose, color: '#e0234f', note: 'C5' },
      { name: { 'en-US': 'Love letter', 'pt-PT': 'Carta de amor' }, image: letter, color: '#ffd1e3', note: 'D5' },
      { name: { 'en-US': 'Ring', 'pt-PT': 'Anel' }, image: ring, color: '#ffc857', note: 'E5' },
      { name: { 'en-US': 'Kiss', 'pt-PT': 'Beijo' }, image: lips, color: '#ff8fb8', note: 'G5' },
      { name: { 'en-US': 'Chocolate', 'pt-PT': 'Chocolate' }, image: chocolate, color: '#c48a5a', note: 'A5' },
    ],
    outTitle: { 'en-US': 'Heartbreak!', 'pt-PT': 'Desgosto!' },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Watch the sweet things sing, then play them back in the same order. The love song grows every round!',
      'pt-PT': 'Observa as coisas doces a cantar e repete-as pela mesma ordem. A canção de amor cresce a cada ronda!',
    },
    themes: ['valentine'],
    thumbnail,
  },
);
