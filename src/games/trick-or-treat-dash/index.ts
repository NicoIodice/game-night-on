import grave from '../../themes/halloween/assets/grave.svg';
import pumpkin from '../../themes/halloween/assets/pumpkin.svg';
import { runnerGame } from '../runner/game';
import runner from './assets/runner.svg';
import sweet from './assets/sweet.svg';
import thumbnail from './assets/thumbnail.jpg';
import './TrickOrTreatDash.css';

export const trickOrTreatDash = runnerGame(
  {
    id: 'trick-or-treat-dash',
    title: { 'en-US': 'Trick or Treat Dash', 'pt-PT': 'Corrida Doçura ou Travessura' },
    intro: {
      'en-US':
        'Run down the spooky street collecting sweets! Jump over the pumpkins and graves in your way: bump into three and your night is over. The street gets faster the longer you run, and every sweet and every step counts.',
      'pt-PT':
        'Corre pela rua assombrada a apanhar doces! Salta por cima das abóboras e das campas que te aparecem à frente: se chocares com três, a tua noite acaba. A rua fica mais rápida quanto mais tempo correres, e cada doce e cada passo contam.',
    },
    runner,
    obstacles: {
      low: { name: { 'en-US': 'Pumpkin', 'pt-PT': 'Abóbora' }, image: pumpkin },
      tall: { name: { 'en-US': 'Grave', 'pt-PT': 'Campa' }, image: grave },
    },
    treat: { name: { 'en-US': 'Sweet', 'pt-PT': 'Doce' }, image: sweet },
    treatNoun: { 'en-US': ['sweet', 'sweets'], 'pt-PT': ['doce', 'doces'] },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Dash down the spooky street, jumping pumpkins and graves and grabbing every sweet you can!',
      'pt-PT': 'Corre pela rua assombrada, salta abóboras e campas e apanha todos os doces que conseguires!',
    },
    themes: ['halloween'],
    thumbnail,
  },
);
