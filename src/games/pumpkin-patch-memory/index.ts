import pumpkin from '../../themes/halloween/assets/pumpkin.svg';
import { memoryGame } from '../memory/game';
import thumbnail from './assets/thumbnail.jpg';
import './PumpkinPatchMemory.css';

export const pumpkinPatchMemory = memoryGame(
  {
    id: 'pumpkin-patch-memory',
    title: { 'en-US': 'Pumpkin Patch Memory', 'pt-PT': 'Memória das Abóboras' },
    intro: {
      'en-US':
        'A spooky friend hides under every pumpkin, and each one has a twin. Turn two pumpkins at a time to find the pairs before the clock runs out. Pairs in a row earn a bonus, and spare seconds count too!',
      'pt-PT':
        'Debaixo de cada abóbora esconde-se um amigo assustador, e cada um tem um gémeo. Vira duas abóboras de cada vez para encontrares os pares antes que o tempo acabe. Pares seguidos dão bónus, e os segundos que sobrarem também contam!',
    },
    back: pumpkin,
  },
  {
    enabled: true,
    description: {
      'en-US': 'Every pumpkin hides a spooky friend with a twin. Find all the pairs before time runs out!',
      'pt-PT': 'Cada abóbora esconde um amigo assustador com um gémeo. Encontra todos os pares antes que o tempo acabe!',
    },
    themes: ['halloween'],
    thumbnail,
  },
);
