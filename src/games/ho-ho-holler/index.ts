import reindeer from '../../themes/christmas/assets/reindeer.svg';
import { shoutGame } from '../shout/game';
import thumbnail from './assets/thumbnail.jpg';
import './HoHoHoller.css';

export const hoHoHoller = shoutGame(
  {
    id: 'ho-ho-holler',
    title: 'Ho Ho Holler',
    intro:
      "Santa's reindeer need a jolly boost to take off! Stay quiet while we listen to the room, then give your biggest, longest HO HO HO. The louder you are, the higher the reindeer flies.",
    mascot: reindeer,
    call: 'HO HO HO!',
    ranks: [
      { from: 0, label: 'A tiny hiccup' },
      { from: 150, label: 'A polite ho' },
      { from: 350, label: 'A jolly ho ho' },
      { from: 550, label: 'A big belly laugh' },
      { from: 800, label: 'Santa-sized!' },
    ],
  },
  {
    enabled: true,
    description: "Who has the jolliest HO HO HO? Make the reindeer fly as high as it can with your loudest, longest holler!",
    themes: ['christmas'],
    thumbnail,
  },
);
