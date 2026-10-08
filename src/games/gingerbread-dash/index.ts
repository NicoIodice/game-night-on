import gingerbread from '../../themes/christmas/assets/gingerbread.svg';
import present from '../../themes/christmas/assets/present.svg';
import snowman from '../../themes/christmas/assets/snowman.svg';
import { runnerGame } from '../runner/game';
import candyCane from './assets/candy-cane.svg';
import thumbnail from './assets/thumbnail.jpg';
import './GingerbreadDash.css';

export const gingerbreadDash = runnerGame(
  {
    id: 'gingerbread-dash',
    title: { 'en-US': 'Gingerbread Dash', 'pt-PT': 'Corrida do Boneco de Gengibre' },
    intro: {
      'en-US':
        "Run, run, as fast as you can! Help the gingerbread man race through the snow, jumping over presents and snowmen. Bump into three and he's caught! The run gets faster the longer you go, and every candy cane and every step counts.",
      'pt-PT':
        'Corre, corre, o mais depressa que puderes! Ajuda o boneco de gengibre a correr pela neve, a saltar por cima de presentes e bonecos de neve. Se chocar com três, é apanhado! A corrida fica mais rápida quanto mais tempo durar, e cada bengala doce e cada passo contam.',
    },
    runner: gingerbread,
    obstacles: {
      low: { name: { 'en-US': 'Present', 'pt-PT': 'Presente' }, image: present },
      tall: { name: { 'en-US': 'Snowman', 'pt-PT': 'Boneco de neve' }, image: snowman },
    },
    treat: { name: { 'en-US': 'Candy cane', 'pt-PT': 'Bengala doce' }, image: candyCane },
    treatNoun: { 'en-US': ['candy cane', 'candy canes'], 'pt-PT': ['bengala doce', 'bengalas doces'] },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Help the gingerbread man race through the snow, jumping presents and snowmen and grabbing candy canes!',
      'pt-PT': 'Ajuda o boneco de gengibre a correr pela neve, a saltar presentes e bonecos de neve e a apanhar bengalas doces!',
    },
    themes: ['christmas'],
    thumbnail,
  },
);
