import present from '../../themes/christmas/assets/present.svg';
import { memoryGame } from '../memory/game';
import thumbnail from './assets/thumbnail.jpg';
import './PresentPairs.css';

export const presentPairs = memoryGame(
  {
    id: 'present-pairs',
    title: { 'en-US': 'Present Pairs', 'pt-PT': 'Pares de Presentes' },
    intro: {
      'en-US':
        'Every present under the tree hides a festive surprise, and each one has a twin. Unwrap two at a time to find the pairs before the clock runs out. Pairs in a row earn a bonus, and spare seconds count too!',
      'pt-PT':
        'Cada presente debaixo da árvore esconde uma surpresa natalícia, e cada uma tem uma gémea. Desembrulha dois de cada vez para encontrares os pares antes que o tempo acabe. Pares seguidos dão bónus, e os segundos que sobrarem também contam!',
    },
    back: present,
  },
  {
    enabled: true,
    description: {
      'en-US': 'Every present hides a festive surprise with a twin. Find all the pairs before time runs out!',
      'pt-PT': 'Cada presente esconde uma surpresa natalícia com uma gémea. Encontra todos os pares antes que o tempo acabe!',
    },
    themes: ['christmas'],
    thumbnail,
  },
);
