import type { GameDefinition } from '../../core/types';
import { AlienZapper } from './AlienZapper';
import thumbnail from './assets/thumbnail.jpg';

export const alienZapper: GameDefinition = {
  id: 'alien-zapper',
  enabled: true,
  name: { 'en-US': 'Alien Zapper', 'pt-PT': 'Caça-Alienígenas' },
  description: {
    'en-US': 'Aliens are floating around the space station! Zap as many as you can before time runs out.',
    'pt-PT': 'Há extraterrestres a flutuar à volta da estação espacial! Atinge o máximo que conseguires antes que o tempo acabe.',
  },
  kind: 'party',
  players: { min: 1, max: 8 },
  thumbnail,
  themes: ['space'],
  supports: () => true,
  Component: AlienZapper,
};
