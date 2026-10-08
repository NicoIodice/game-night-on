import type { GameDefinition } from '../../core/types';
import thumbnail from './assets/thumbnail.jpg';
import { SnowballShowdown } from './SnowballShowdown';

export const snowballShowdown: GameDefinition = {
  id: 'snowball-showdown',
  enabled: true,
  name: 'Snowball Showdown',
  description: "Naughty imps are flying off with Santa's presents! Pelt them with snowballs before time runs out.",
  kind: 'party',
  players: '1–8 players or teams',
  thumbnail,
  themes: ['christmas'],
  supports: () => true,
  Component: SnowballShowdown,
};
