import { runnerGame } from '../runner/game';
import iceCream from './assets/ice-cream.svg';
import rock from './assets/rock.svg';
import surfer from './assets/surfer.svg';
import thumbnail from './assets/thumbnail.jpg';
import wave from './assets/wave.svg';
import './SurfDash.css';

export const surfDash = runnerGame(
  {
    id: 'surf-dash',
    title: { 'en-US': 'Surf Dash', 'pt-PT': 'Corrida de Surf' },
    intro: {
      'en-US':
        "Surf's up! Ride along the shore, jumping over rocks and big waves. Bump into three and you're wiped out! The ride gets faster the longer you go, and every ice cream and every wave counts.",
      'pt-PT':
        'As ondas estão boas! Surfa ao longo da costa, a saltar por cima de rochas e ondas grandes. Se chocares com três, levas um trambolhão! A corrida fica mais rápida quanto mais tempo durar, e cada gelado e cada onda contam.',
    },
    runner: surfer,
    obstacles: {
      low: { name: { 'en-US': 'Rock', 'pt-PT': 'Rocha' }, image: rock },
      tall: { name: { 'en-US': 'Big wave', 'pt-PT': 'Onda grande' }, image: wave },
    },
    treat: { name: { 'en-US': 'Ice cream', 'pt-PT': 'Gelado' }, image: iceCream },
    treatNoun: { 'en-US': ['ice cream', 'ice creams'], 'pt-PT': ['gelado', 'gelados'] },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Surf along the shore, jumping rocks and big waves and grabbing ice creams!',
      'pt-PT': 'Surfa ao longo da costa, a saltar rochas e ondas grandes e a apanhar gelados!',
    },
    themes: ['summer'],
    thumbnail,
  },
);
