import chair from '../../themes/birthday/assets/chair.svg';
import cupcake from '../../themes/birthday/assets/cupcake.svg';
import gift from '../../themes/birthday/assets/gift.svg';
import { runnerGame } from '../runner/game';
import runner from './assets/runner.svg';
import thumbnail from './assets/thumbnail.jpg';
import './PartyDash.css';

export const partyDash = runnerGame(
  {
    id: 'party-dash',
    title: { 'en-US': 'Party Dash', 'pt-PT': 'Corrida da Festa' },
    intro: {
      'en-US':
        "You're late for the cake! Race through the party, jumping over presents and chairs. Bump into three and you'll miss the candles! The run gets faster the longer you go, and every cupcake and every step counts.",
      'pt-PT':
        'Estás atrasado para o bolo! Corre pela festa, a saltar por cima de prendas e cadeiras. Se chocares com três, perdes as velas! A corrida fica mais rápida quanto mais tempo durar, e cada queque e cada passo contam.',
    },
    runner,
    obstacles: {
      low: { name: { 'en-US': 'Present', 'pt-PT': 'Prenda' }, image: gift },
      tall: { name: { 'en-US': 'Chair', 'pt-PT': 'Cadeira' }, image: chair },
    },
    treat: { name: { 'en-US': 'Cupcake', 'pt-PT': 'Queque' }, image: cupcake },
    treatNoun: { 'en-US': ['cupcake', 'cupcakes'], 'pt-PT': ['queque', 'queques'] },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Race through the party before the candles are blown out, jumping presents and chairs and grabbing cupcakes!',
      'pt-PT': 'Corre pela festa antes que soprem as velas, a saltar prendas e cadeiras e a apanhar queques!',
    },
    themes: ['birthday'],
    thumbnail,
  },
);
