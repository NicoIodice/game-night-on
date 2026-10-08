import type { GameDefinition } from '../../core/types';
import birthdayThumbnail from './assets/thumbnail-birthday.jpg';
import easterThumbnail from './assets/thumbnail-easter.jpg';
import christmasThumbnail from './assets/thumbnail-christmas.jpg';
import halloweenThumbnail from './assets/thumbnail-halloween.jpg';
import { LOCALES } from '../../core/i18n/locales';
import { DEFAULT_ROUNDS, DEFAULT_TEMPO, LEVELS } from './levels';
import { singOnTheBeatName } from './name';
import { SingOnTheBeat } from './SingOnTheBeat';
import { VoiceSettings } from './VoiceSettings';

export const singOnTheBeat: GameDefinition = {
  id: 'sing-on-the-beat',
  enabled: true,
  name: singOnTheBeatName,
  description: {
    'en-US': 'Say each card out loud right on the beat. Faster than it sounds!',
    'pt-PT': 'Diz cada carta em voz alta mesmo ao ritmo. É mais difícil do que parece!',
  },
  kind: 'voice',
  players: { min: 1, max: 8 },
  thumbnail: { halloween: halloweenThumbnail, christmas: christmasThumbnail, birthday: birthdayThumbnail, easter: easterThumbnail },
  themes: 'all',
  // Every language needs a deck for every level.
  supports: (theme) =>
    LOCALES.every(({ id }) =>
      LEVELS.every((level) => {
        const deck = theme.decks[id][level.deck];
        return deck !== undefined && deck.length * level.maxRepeats >= level.cardCount;
      }),
    ),
  levels: LEVELS.length,
  options: [
    {
      id: 'rounds',
      label: { 'en-US': 'Rounds per level', 'pt-PT': 'Rondas por nível' },
      min: 1,
      max: 10,
      default: DEFAULT_ROUNDS,
    },
    {
      id: 'tempo',
      label: { 'en-US': 'Tempo (beats per minute)', 'pt-PT': 'Ritmo (batidas por minuto)' },
      min: 60,
      max: 110,
      step: 5,
      default: DEFAULT_TEMPO,
      easy: 70,
      hard: 95,
    },
  ],
  Settings: VoiceSettings,
  Component: SingOnTheBeat,
};
