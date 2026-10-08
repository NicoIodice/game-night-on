import present from '../../themes/christmas/assets/present.svg';
import { memoryGame } from '../memory/game';
import thumbnail from './assets/thumbnail.jpg';
import './PresentPairs.css';

export const presentPairs = memoryGame(
  {
    id: 'present-pairs',
    title: 'Present Pairs',
    intro:
      'Every present under the tree hides a festive surprise, and each one has a twin. Unwrap two at a time to find the pairs before the clock runs out. Pairs in a row earn a bonus, and spare seconds count too!',
    back: present,
    skip: ['present'],
  },
  {
    enabled: true,
    description: 'Every present hides a festive surprise with a twin. Find all the pairs before time runs out!',
    themes: ['christmas'],
    thumbnail,
  },
);
