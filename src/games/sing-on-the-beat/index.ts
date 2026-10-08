import type { GameDefinition } from '../../core/types';
import thumbnail from './assets/thumbnail.jpg';
import { LEVELS } from './levels';
import { SingOnTheBeat } from './SingOnTheBeat';

export const singOnTheBeat: GameDefinition = {
  id: 'sing-on-the-beat',
  name: 'Sing on the Beat',
  description: 'Say each card out loud right on the beat. Faster than it sounds!',
  kind: 'voice',
  players: '1–8 players or teams',
  thumbnail,
  themes: 'all',
  supports: (theme) => LEVELS.every((level) => theme.cards.length >= level.cardTypes),
  Component: SingOnTheBeat,
};
