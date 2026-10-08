import ghost from '../../themes/halloween/assets/ghost.svg';
import { shoutGame } from '../shout/game';
import thumbnail from './assets/thumbnail.jpg';
import './ScreamMeter.css';

export const screamMeter = shoutGame(
  {
    id: 'scream-meter',
    title: 'Scream Meter',
    intro:
      'Let out your scariest scream! Stay quiet while we listen to the room, then scream as loud as you can, for as long as you can. The louder you are, the higher the ghost flies.',
    mascot: ghost,
    call: 'SCREAM!',
    ranks: [
      { from: 0, label: 'A tiny squeak' },
      { from: 150, label: 'A spooky whisper' },
      { from: 350, label: 'A ghostly wail' },
      { from: 550, label: 'A terrifying shriek' },
      { from: 800, label: 'Blood-curdling!' },
    ],
  },
  {
    enabled: true,
    description: 'Who has the scariest scream? Make the ghost fly as high as it can with your loudest, longest scream!',
    themes: ['halloween'],
    thumbnail,
  },
);
