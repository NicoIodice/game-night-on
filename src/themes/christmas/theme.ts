import type { Theme } from '../../core/types';
import favicon from './assets/favicon.svg';
import santaHat from './assets/santa-hat.svg';
import { christmasMusic } from './music';

export const christmas: Theme = {
  id: 'christmas',
  name: 'Christmas',
  tagline: 'Festive games for the holidays',
  icon: santaHat,
  favicon,
  enabled: false,
  decks: [],
  music: christmasMusic,
};
