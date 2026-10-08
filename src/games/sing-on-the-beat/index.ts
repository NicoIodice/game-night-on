import type { GameDefinition } from '../../core/types';
import christmasThumbnail from './assets/thumbnail-christmas.jpg';
import halloweenThumbnail from './assets/thumbnail-halloween.jpg';
import { DEFAULT_ROUNDS, DEFAULT_TEMPO, LEVELS } from './levels';
import { SingOnTheBeat } from './SingOnTheBeat';
import { VoiceSettings } from './VoiceSettings';

export const singOnTheBeat: GameDefinition = {
  id: 'sing-on-the-beat',
  enabled: true,
  name: 'Sing on the Beat',
  description: 'Say each card out loud right on the beat. Faster than it sounds!',
  kind: 'voice',
  players: '1–8 players or teams',
  thumbnail: { halloween: halloweenThumbnail, christmas: christmasThumbnail },
  themes: 'all',
  supports: (theme) =>
    LEVELS.every((level) => {
      const deck = theme.decks[level.deck];
      return deck !== undefined && deck.length * level.maxRepeats >= level.cardCount;
    }),
  levels: LEVELS.length,
  options: [
    { id: 'rounds', label: 'Rounds per level', min: 1, max: 10, default: DEFAULT_ROUNDS },
    { id: 'tempo', label: 'Tempo (beats per minute)', min: 60, max: 110, step: 5, default: DEFAULT_TEMPO },
  ],
  Settings: VoiceSettings,
  Component: SingOnTheBeat,
};
