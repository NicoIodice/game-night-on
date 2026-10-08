import shell from '../../themes/summer/assets/shell.svg';
import { memoryGame } from '../memory/game';
import thumbnail from './assets/thumbnail.jpg';
import './ShellPairs.css';

export const shellPairs = memoryGame(
  {
    id: 'shell-pairs',
    title: { 'en-US': 'Seashell Pairs', 'pt-PT': 'Pares de Conchas' },
    intro: {
      'en-US':
        'Every seashell on the beach hides a summer surprise, and each one has a twin. Turn over two at a time to find the pairs before the tide comes in. Pairs in a row earn a bonus, and spare seconds count too!',
      'pt-PT':
        'Cada concha da praia esconde uma surpresa de verão, e cada uma tem uma gémea. Vira duas de cada vez para encontrares os pares antes que a maré suba. Pares seguidos dão bónus, e os segundos que sobrarem também contam!',
    },
    back: shell,
  },
  {
    enabled: true,
    description: {
      'en-US': 'Every seashell hides a summer surprise with a twin. Find all the pairs before the tide comes in!',
      'pt-PT': 'Cada concha esconde uma surpresa de verão com uma gémea. Encontra todos os pares antes que a maré suba!',
    },
    themes: ['summer'],
    thumbnail,
  },
);
