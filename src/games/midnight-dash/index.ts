import sparkler from '../../themes/newyear/assets/sparkler.svg';
import { runnerGame } from '../runner/game';
import bin from './assets/bin.svg';
import cone from './assets/cone.svg';
import runner from './assets/runner.svg';
import thumbnail from './assets/thumbnail.jpg';
import './MidnightDash.css';

export const midnightDash = runnerGame(
  {
    id: 'midnight-dash',
    title: { 'en-US': 'Midnight Dash', 'pt-PT': 'Corrida da Meia-Noite' },
    intro: {
      'en-US':
        "It's almost midnight and you're late for the party! Race through the city streets, jumping over traffic cones and bins. Bump into three and you'll miss the countdown! The run gets faster the longer you go, and every sparkler and every step counts.",
      'pt-PT':
        'Está quase a dar a meia-noite e estás atrasado para a festa! Corre pelas ruas da cidade, a saltar por cima de cones e caixotes do lixo. Se chocares com três, perdes a contagem decrescente! A corrida fica mais rápida quanto mais tempo durar, e cada estrelinha e cada passo contam.',
    },
    runner,
    obstacles: {
      low: { name: { 'en-US': 'Traffic cone', 'pt-PT': 'Cone' }, image: cone },
      tall: { name: { 'en-US': 'Bin', 'pt-PT': 'Caixote do lixo' }, image: bin },
    },
    treat: { name: { 'en-US': 'Sparkler', 'pt-PT': 'Estrelinha' }, image: sparkler },
    treatNoun: { 'en-US': ['sparkler', 'sparklers'], 'pt-PT': ['estrelinha', 'estrelinhas'] },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Race through the city to the party before midnight, jumping cones and bins and grabbing sparklers!',
      'pt-PT': 'Corre pela cidade até à festa antes da meia-noite, a saltar cones e caixotes e a apanhar estrelinhas!',
    },
    themes: ['newyear'],
    thumbnail,
  },
);
