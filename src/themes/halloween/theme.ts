import type { Theme } from '../../core/types';
import bat from './assets/bat.svg';
import cat from './assets/cat.svg';
import hat from './assets/hat.svg';
import pumpkin from './assets/pumpkin.svg';
import rat from './assets/rat.svg';
import { createHalloweenBeatTrack } from './beatTrack';

export const halloween: Theme = {
  id: 'halloween',
  name: 'Halloween',
  tagline: 'Spooky games for a frightful night',
  icon: pumpkin,
  enabled: true,
  cards: [
    { id: 'cat', label: 'Cat', image: cat },
    { id: 'rat', label: 'Rat', image: rat },
    { id: 'bat', label: 'Bat', image: bat },
    { id: 'hat', label: 'Hat', image: hat },
  ],
  createBeatTrack: createHalloweenBeatTrack,
};
