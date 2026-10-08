import type { GameDefinition } from '../../core/types';
import thumbnail from './assets/thumbnail.jpg';
import { BalloonPop } from './BalloonPop';

export const balloonPop: GameDefinition = {
  id: 'balloon-pop',
  enabled: true,
  name: { 'en-US': 'Balloon Pop', 'pt-PT': 'Rebenta Balões' },
  description: {
    'en-US': 'The party balloons are floating away! Pop as many as you can before time runs out.',
    'pt-PT': 'Os balões da festa estão a voar! Rebenta o máximo que conseguires antes que o tempo acabe.',
  },
  kind: 'party',
  players: { min: 1, max: 8 },
  thumbnail,
  themes: ['birthday'],
  supports: () => true,
  Component: BalloonPop,
};
