import cupid from '../../themes/valentine/assets/cupid.svg';
import heart from '../../themes/valentine/assets/heart.svg';
import { runnerGame } from '../runner/game';
import cactus from './assets/cactus.svg';
import cloud from './assets/cloud.svg';
import thumbnail from './assets/thumbnail.jpg';
import './CupidsFlight.css';

export const cupidsFlight = runnerGame(
  {
    id: 'cupids-flight',
    title: { 'en-US': "Cupid's Flight", 'pt-PT': 'Voo do Cupido' },
    intro: {
      'en-US':
        "Cupid has a lot of hearts to deliver tonight! Help him dash across the clouds, jumping prickly cactuses and rain clouds. Bump into three and Cupid's wings get soggy! The flight gets faster the longer you go, and every heart and every step counts.",
      'pt-PT':
        'O Cupido tem muitos corações para entregar esta noite! Ajuda-o a correr por cima das nuvens, a saltar catos picosos e nuvens de chuva. Se chocar com três, as asas do Cupido ficam encharcadas! O voo fica mais rápido quanto mais tempo durar, e cada coração e cada passo contam.',
    },
    runner: cupid,
    obstacles: {
      low: { name: { 'en-US': 'Prickly cactus', 'pt-PT': 'Cato picoso' }, image: cactus },
      tall: { name: { 'en-US': 'Rain cloud', 'pt-PT': 'Nuvem de chuva' }, image: cloud },
    },
    treat: { name: { 'en-US': 'Heart', 'pt-PT': 'Coração' }, image: heart },
    treatNoun: { 'en-US': ['heart', 'hearts'], 'pt-PT': ['coração', 'corações'] },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Help Cupid dash across the clouds, jumping cactuses and rain clouds and collecting hearts!',
      'pt-PT': 'Ajuda o Cupido a correr por cima das nuvens, a saltar catos e nuvens de chuva e a apanhar corações!',
    },
    themes: ['valentine'],
    thumbnail,
  },
);
