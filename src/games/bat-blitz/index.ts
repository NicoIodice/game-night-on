import type { GameDefinition } from '../../core/types';
import thumbnail from './assets/thumbnail.jpg';
import { BatBlitz } from './BatBlitz';

export const batBlitz: GameDefinition = {
  id: 'bat-blitz',
  enabled: true,
  name: { 'en-US': 'Bat Blitz', 'pt-PT': 'Ataque de Morcegos' },
  description: {
    'en-US': 'The cave is swarming with bats! Zap as many as you can before time runs out.',
    'pt-PT': 'A gruta está cheia de morcegos! Apanha o máximo que conseguires antes que o tempo acabe.',
  },
  kind: 'party',
  players: { min: 1, max: 8 },
  thumbnail,
  themes: ['halloween'],
  supports: () => true,
  Component: BatBlitz,
};
