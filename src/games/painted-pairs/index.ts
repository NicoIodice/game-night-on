import egg from '../../themes/easter/assets/egg.svg';
import { memoryGame } from '../memory/game';
import thumbnail from './assets/thumbnail.jpg';
import './PaintedPairs.css';

export const paintedPairs = memoryGame(
  {
    id: 'painted-pairs',
    title: { 'en-US': 'Painted Pairs', 'pt-PT': 'Pares Pintados' },
    intro: {
      'en-US':
        'Every painted egg hides a spring surprise, and each one has a twin. Turn over two at a time to find the pairs before the clock runs out. Pairs in a row earn a bonus, and spare seconds count too!',
      'pt-PT':
        'Cada ovo pintado esconde uma surpresa da primavera, e cada uma tem uma gémea. Vira dois de cada vez para encontrares os pares antes que o tempo acabe. Pares seguidos dão bónus, e os segundos que sobrarem também contam!',
    },
    back: egg,
  },
  {
    enabled: true,
    description: {
      'en-US': 'Every painted egg hides a spring surprise with a twin. Find all the pairs before time runs out!',
      'pt-PT': 'Cada ovo pintado esconde uma surpresa da primavera com uma gémea. Encontra todos os pares antes que o tempo acabe!',
    },
    themes: ['easter'],
    thumbnail,
  },
);
