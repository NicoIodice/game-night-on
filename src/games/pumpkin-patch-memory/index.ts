import pumpkin from '../../themes/halloween/assets/pumpkin.svg';
import { memoryGame } from '../memory/game';
import thumbnail from './assets/thumbnail.jpg';
import './PumpkinPatchMemory.css';

export const pumpkinPatchMemory = memoryGame(
  {
    id: 'pumpkin-patch-memory',
    title: 'Pumpkin Patch Memory',
    intro:
      'A spooky friend hides under every pumpkin, and each one has a twin. Turn two pumpkins at a time to find the pairs before the clock runs out. Pairs in a row earn a bonus, and spare seconds count too!',
    back: pumpkin,
    skip: ['pumpkin'],
  },
  {
    enabled: true,
    description: 'Every pumpkin hides a spooky friend with a twin. Find all the pairs before time runs out!',
    themes: ['halloween'],
    thumbnail,
  },
);
