import popper from '../../themes/newyear/assets/popper.svg';
import { memoryGame } from '../memory/game';
import thumbnail from './assets/thumbnail.jpg';
import './MidnightPairs.css';

export const midnightPairs = memoryGame(
  {
    id: 'midnight-pairs',
    title: { 'en-US': 'Midnight Pairs', 'pt-PT': 'Pares da Meia-Noite' },
    intro: {
      'en-US':
        'Every party popper hides a New Year surprise, and each one has a twin. Pop two at a time to find the pairs before the countdown runs out. Pairs in a row earn a bonus, and spare seconds count too!',
      'pt-PT':
        'Cada lança-confetes esconde uma surpresa de Ano Novo, e cada uma tem uma gémea. Rebenta dois de cada vez para encontrares os pares antes que a contagem acabe. Pares seguidos dão bónus, e os segundos que sobrarem também contam!',
    },
    back: popper,
  },
  {
    enabled: true,
    description: {
      'en-US': 'Every party popper hides a New Year surprise with a twin. Find all the pairs before midnight!',
      'pt-PT': 'Cada lança-confetes esconde uma surpresa de Ano Novo com uma gémea. Encontra todos os pares antes da meia-noite!',
    },
    themes: ['newyear'],
    thumbnail,
  },
);
