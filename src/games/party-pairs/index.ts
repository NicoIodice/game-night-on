import gift from '../../themes/birthday/assets/gift.svg';
import { memoryGame } from '../memory/game';
import thumbnail from './assets/thumbnail.jpg';
import './PartyPairs.css';

export const partyPairs = memoryGame(
  {
    id: 'party-pairs',
    title: { 'en-US': 'Party Pairs', 'pt-PT': 'Pares da Festa' },
    intro: {
      'en-US':
        'The birthday presents are piled high, and each one hides a party surprise with a twin. Unwrap two at a time to find the pairs before the clock runs out. Pairs in a row earn a bonus, and spare seconds count too!',
      'pt-PT':
        'As prendas de anos estão empilhadas, e cada uma esconde uma surpresa da festa com uma gémea. Desembrulha duas de cada vez para encontrares os pares antes que o tempo acabe. Pares seguidos dão bónus, e os segundos que sobrarem também contam!',
    },
    back: gift,
  },
  {
    enabled: true,
    description: {
      'en-US': 'Every birthday present hides a party surprise with a twin. Find all the pairs before time runs out!',
      'pt-PT': 'Cada prenda de anos esconde uma surpresa da festa com uma gémea. Encontra todos os pares antes que o tempo acabe!',
    },
    themes: ['birthday'],
    thumbnail,
  },
);
