import mask from '../../themes/carnival/assets/mask.svg';
import { memoryGame } from '../memory/game';
import thumbnail from './assets/thumbnail.jpg';
import './MaskPairs.css';

export const maskPairs = memoryGame(
  {
    id: 'mask-pairs',
    title: { 'en-US': 'Mask Pairs', 'pt-PT': 'Pares de Máscaras' },
    intro: {
      'en-US':
        'Everyone at the carnival is hiding behind a mask, and each one has a twin. Lift two masks at a time to find the pairs before the parade ends. Pairs in a row earn a bonus, and spare seconds count too!',
      'pt-PT':
        'Toda a gente no carnaval está escondida atrás de uma máscara, e cada uma tem uma gémea. Levanta duas máscaras de cada vez para encontrares os pares antes que o desfile acabe. Pares seguidos dão bónus, e os segundos que sobrarem também contam!',
    },
    back: mask,
  },
  {
    enabled: true,
    description: {
      'en-US': 'Every carnival mask hides a surprise with a twin. Find all the pairs before the parade ends!',
      'pt-PT': 'Cada máscara de carnaval esconde uma surpresa com uma gémea. Encontra todos os pares antes que o desfile acabe!',
    },
    themes: ['carnival'],
    thumbnail,
  },
);
