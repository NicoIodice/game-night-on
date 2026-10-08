import type { GameDefinition } from '../../core/types';
import thumbnail from './assets/thumbnail.jpg';
import { CupidsArrows } from './CupidsArrows';

export const cupidsArrows: GameDefinition = {
  id: 'cupids-arrows',
  enabled: true,
  name: { 'en-US': "Cupid's Arrows", 'pt-PT': 'Setas do Cupido' },
  description: {
    'en-US': "Take Cupid's bow and hit as many floating hearts as you can before time runs out.",
    'pt-PT': 'Pega no arco do Cupido e acerta no máximo de corações que conseguires antes que o tempo acabe.',
  },
  kind: 'party',
  players: { min: 1, max: 8 },
  thumbnail,
  themes: ['valentine'],
  supports: () => true,
  Component: CupidsArrows,
};
