import type { GameDefinition } from '../../core/types';
import thumbnail from './assets/thumbnail.jpg';
import { FireworkFrenzy } from './FireworkFrenzy';

export const fireworkFrenzy: GameDefinition = {
  id: 'firework-frenzy',
  enabled: true,
  name: { 'en-US': 'Firework Frenzy', 'pt-PT': 'Fogo de Artifício' },
  description: {
    'en-US': 'The midnight sky is full of fireworks! Burst as many as you can before they fade.',
    'pt-PT': 'O céu da meia-noite está cheio de fogo de artifício! Rebenta o máximo que conseguires antes que se apaguem.',
  },
  kind: 'party',
  players: { min: 1, max: 8 },
  thumbnail,
  themes: ['newyear'],
  supports: () => true,
  Component: FireworkFrenzy,
};
