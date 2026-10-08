import asteroid from '../../themes/space/assets/asteroid.svg';
import astronaut from '../../themes/space/assets/astronaut.svg';
import radar from '../../themes/space/assets/radar.svg';
import star from '../../themes/space/assets/star.svg';
import { runnerGame } from '../runner/game';
import thumbnail from './assets/thumbnail.jpg';
import './MoonBounce.css';

export const moonBounce = runnerGame(
  {
    id: 'moon-bounce',
    title: { 'en-US': 'Moon Bounce', 'pt-PT': 'Saltos na Lua' },
    intro: {
      'en-US':
        "Moonwalk time! Help the astronaut bounce across the Moon, jumping over moon rocks and radar dishes. Bump into three and it's back to the rocket! The run gets faster the longer you go, and every star and every step counts.",
      'pt-PT':
        'Hora de passear na Lua! Ajuda o astronauta a saltar pela Lua, por cima de pedras lunares e antenas parabólicas. Se chocar com três, tem de voltar para o foguetão! A corrida fica mais rápida quanto mais tempo durar, e cada estrela e cada passo contam.',
    },
    runner: astronaut,
    obstacles: {
      low: { name: { 'en-US': 'Moon rock', 'pt-PT': 'Pedra lunar' }, image: asteroid },
      tall: { name: { 'en-US': 'Radar dish', 'pt-PT': 'Antena parabólica' }, image: radar },
    },
    treat: { name: { 'en-US': 'Star', 'pt-PT': 'Estrela' }, image: star },
    treatNoun: { 'en-US': ['star', 'stars'], 'pt-PT': ['estrela', 'estrelas'] },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Help the astronaut bounce across the Moon, jumping moon rocks and radar dishes and collecting stars!',
      'pt-PT': 'Ajuda o astronauta a saltar pela Lua, por cima de pedras e antenas, a apanhar estrelas!',
    },
    themes: ['space'],
    thumbnail,
  },
);
