import planet from '../../themes/space/assets/planet.svg';
import { memoryGame } from '../memory/game';
import thumbnail from './assets/thumbnail.jpg';
import './PlanetPairs.css';

export const planetPairs = memoryGame(
  {
    id: 'planet-pairs',
    title: { 'en-US': 'Planet Pairs', 'pt-PT': 'Pares de Planetas' },
    intro: {
      'en-US':
        'Every planet in the galaxy hides a space surprise, and each one has a twin. Explore two planets at a time to find the pairs before your oxygen runs out. Pairs in a row earn a bonus, and spare seconds count too!',
      'pt-PT':
        'Cada planeta da galáxia esconde uma surpresa espacial, e cada uma tem uma gémea. Explora dois planetas de cada vez para encontrares os pares antes que o oxigénio acabe. Pares seguidos dão bónus, e os segundos que sobrarem também contam!',
    },
    back: planet,
  },
  {
    enabled: true,
    description: {
      'en-US': 'Every planet hides a space surprise with a twin. Find all the pairs before your oxygen runs out!',
      'pt-PT': 'Cada planeta esconde uma surpresa espacial com uma gémea. Encontra todos os pares antes que o oxigénio acabe!',
    },
    themes: ['space'],
    thumbnail,
  },
);
