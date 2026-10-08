import gingerbread from '../../themes/christmas/assets/gingerbread.svg';
import present from '../../themes/christmas/assets/present.svg';
import snowman from '../../themes/christmas/assets/snowman.svg';
import { runnerGame } from '../runner/game';
import candyCane from './assets/candy-cane.svg';
import thumbnail from './assets/thumbnail.jpg';
import './GingerbreadDash.css';

export const gingerbreadDash = runnerGame(
  {
    id: 'gingerbread-dash',
    title: 'Gingerbread Dash',
    intro:
      "Run, run, as fast as you can! Help the gingerbread man race through the snow, jumping over presents and snowmen. Bump into three and he's caught! The run gets faster the longer you go, and every candy cane and every step counts.",
    runner: gingerbread,
    obstacles: {
      low: { name: 'Present', image: present },
      tall: { name: 'Snowman', image: snowman },
    },
    treat: { name: 'Candy cane', image: candyCane },
    treatNoun: ['candy cane', 'candy canes'],
  },
  {
    enabled: true,
    description: 'Help the gingerbread man race through the snow, jumping presents and snowmen and grabbing candy canes!',
    themes: ['christmas'],
    thumbnail,
  },
);
