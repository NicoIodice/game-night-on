import type { Theme } from '../../core/types';
import santaHat from './assets/santa-hat.svg';
import { christmasMusic } from './music';

export const christmas: Theme = {
  id: 'christmas',
  name: 'Christmas',
  tagline: 'Festive games for the holidays',
  icon: santaHat,
  enabled: false,
  cards: [],
  music: christmasMusic,
};
