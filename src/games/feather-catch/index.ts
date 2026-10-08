import type { GameDefinition } from '../../core/types';
import thumbnail from './assets/thumbnail.jpg';
import { FeatherCatch } from './FeatherCatch';

export const featherCatch: GameDefinition = {
  id: 'feather-catch',
  enabled: true,
  name: { 'en-US': 'Feather Catch', 'pt-PT': 'Apanha as Penas' },
  description: {
    'en-US': 'Feathers are flying off the parade! Catch as many as you can before time runs out.',
    'pt-PT': 'Há penas a voar do desfile! Apanha o máximo que conseguires antes que o tempo acabe.',
  },
  kind: 'party',
  players: { min: 1, max: 8 },
  thumbnail,
  themes: ['carnival'],
  supports: () => true,
  Component: FeatherCatch,
};
