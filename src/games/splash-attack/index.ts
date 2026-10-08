import type { GameDefinition } from '../../core/types';
import thumbnail from './assets/thumbnail.jpg';
import { SplashAttack } from './SplashAttack';

export const splashAttack: GameDefinition = {
  id: 'splash-attack',
  enabled: true,
  name: { 'en-US': 'Splash Attack', 'pt-PT': 'Ataque de Água' },
  description: {
    'en-US': "It's a water fight on the beach! Splash as many beach balls as you can before time runs out.",
    'pt-PT': 'É uma guerra de água na praia! Molha o máximo de bolas de praia que conseguires antes que o tempo acabe.',
  },
  kind: 'party',
  players: { min: 1, max: 8 },
  thumbnail,
  themes: ['summer'],
  supports: () => true,
  Component: SplashAttack,
};
