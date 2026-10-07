import type { GameDefinition } from '../../core/types';
import { LEVELS } from './levels';
import { SingOnTheBeat } from './SingOnTheBeat';

export const singOnTheBeat: GameDefinition = {
  id: 'sing-on-the-beat',
  name: 'Sing on the Beat',
  description: 'Watch the cards, then say each word right on the beat. Faster than it sounds!',
  kind: 'voice',
  players: '1+ players',
  themes: 'all',
  supports: (theme) =>
    Boolean(theme.createBeatTrack) && LEVELS.every((level) => theme.cards.length >= level.cardTypes),
  Component: SingOnTheBeat,
};
