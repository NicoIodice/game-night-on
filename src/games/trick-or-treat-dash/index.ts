import grave from '../../themes/halloween/assets/grave.svg';
import pumpkin from '../../themes/halloween/assets/pumpkin.svg';
import { runnerGame } from '../runner/game';
import runner from './assets/runner.svg';
import sweet from './assets/sweet.svg';
import thumbnail from './assets/thumbnail.jpg';
import './TrickOrTreatDash.css';

export const trickOrTreatDash = runnerGame(
  {
    id: 'trick-or-treat-dash',
    title: 'Trick or Treat Dash',
    intro:
      "Run down the spooky street collecting sweets! Jump over the pumpkins and graves in your way: bump into three and your night is over. The street gets faster the longer you run, and every sweet and every step counts.",
    runner,
    obstacles: {
      low: { name: 'Pumpkin', image: pumpkin },
      tall: { name: 'Grave', image: grave },
    },
    treat: { name: 'Sweet', image: sweet },
    treatNoun: ['sweet', 'sweets'],
  },
  {
    enabled: true,
    description: 'Dash down the spooky street, jumping pumpkins and graves and grabbing every sweet you can!',
    themes: ['halloween'],
    thumbnail,
  },
);
