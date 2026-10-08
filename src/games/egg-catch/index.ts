import type { GameDefinition } from '../../core/types';
import thumbnail from './assets/thumbnail.jpg';
import { EggCatch } from './EggCatch';

export const eggCatch: GameDefinition = {
  id: 'egg-catch',
  enabled: true,
  name: { 'en-US': 'Egg Catch', 'pt-PT': 'Apanha-Ovos' },
  description: {
    'en-US': 'Easter eggs are bouncing all over the meadow! Catch as many as you can before time runs out.',
    'pt-PT': 'Os ovos da Páscoa andam aos saltos pelo prado! Apanha o máximo que conseguires antes que o tempo acabe.',
  },
  kind: 'party',
  players: { min: 1, max: 8 },
  thumbnail,
  themes: ['easter'],
  supports: () => true,
  Component: EggCatch,
};
