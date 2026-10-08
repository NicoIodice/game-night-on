import type { GameDefinition } from '../../core/types';
import thumbnail from './assets/thumbnail.jpg';
import { SnowballShowdown } from './SnowballShowdown';

export const snowballShowdown: GameDefinition = {
  id: 'snowball-showdown',
  enabled: true,
  name: { 'en-US': 'Snowball Showdown', 'pt-PT': 'Guerra de Bolas de Neve' },
  description: {
    'en-US': "Naughty imps are flying off with Santa's presents! Pelt them with snowballs before time runs out.",
    'pt-PT': 'Uns diabretes marotos estão a fugir com os presentes do Pai Natal! Atira-lhes bolas de neve antes que o tempo acabe.',
  },
  kind: 'party',
  players: { min: 1, max: 8 },
  thumbnail,
  themes: ['christmas'],
  supports: () => true,
  Component: SnowballShowdown,
};
