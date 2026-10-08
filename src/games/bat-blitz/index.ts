import type { GameDefinition } from '../../core/types';
import thumbnail from './assets/thumbnail.jpg';
import { BatBlitz } from './BatBlitz';

export const batBlitz: GameDefinition = {
  id: 'bat-blitz',
  enabled: true,
  name: 'Bat Blitz',
  description: 'The cave is swarming with bats! Zap as many as you can before time runs out.',
  kind: 'party',
  players: '1–8 players or teams',
  thumbnail,
  themes: ['halloween'],
  supports: () => true,
  Component: BatBlitz,
};
