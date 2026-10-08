import bunny from '../../themes/easter/assets/bunny.svg';
import egg from '../../themes/easter/assets/egg.svg';
import { runnerGame } from '../runner/game';
import fence from './assets/fence.svg';
import flowerPot from './assets/flower-pot.svg';
import thumbnail from './assets/thumbnail.jpg';
import './BunnyHop.css';

export const bunnyHop = runnerGame(
  {
    id: 'bunny-hop',
    title: { 'en-US': 'Bunny Hop', 'pt-PT': 'Salto do Coelho' },
    intro: {
      'en-US':
        "The Easter bunny is late delivering the eggs! Help it hop through the garden, over flowerpots and fences. Bump into three and the bunny has to stop for a rest! The run gets faster the longer you go, and every egg and every hop counts.",
      'pt-PT':
        'O coelho da Páscoa está atrasado a entregar os ovos! Ajuda-o a saltar pelo jardim, por cima de vasos e cercas. Se chocar com três, o coelho tem de parar para descansar! A corrida fica mais rápida quanto mais tempo durar, e cada ovo e cada salto contam.',
    },
    runner: bunny,
    obstacles: {
      low: { name: { 'en-US': 'Flowerpot', 'pt-PT': 'Vaso' }, image: flowerPot },
      tall: { name: { 'en-US': 'Fence', 'pt-PT': 'Cerca' }, image: fence },
    },
    treat: { name: { 'en-US': 'Easter egg', 'pt-PT': 'Ovo da Páscoa' }, image: egg },
    treatNoun: { 'en-US': ['egg', 'eggs'], 'pt-PT': ['ovo', 'ovos'] },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Help the Easter bunny hop through the garden, jumping flowerpots and fences and grabbing eggs!',
      'pt-PT': 'Ajuda o coelho da Páscoa a saltar pelo jardim, por cima de vasos e cercas, a apanhar ovos!',
    },
    themes: ['easter'],
    thumbnail,
  },
);
