import cat from '../../themes/halloween/assets/cat.svg';
import ghost from '../../themes/halloween/assets/ghost.svg';
import { peekGame } from '../peekaboo/game';
import thumbnail from './assets/thumbnail.jpg';
import vampire from './assets/vampire.svg';
import './HauntedHouse.css';

export const hauntedHouse = peekGame(
  {
    id: 'haunted-house',
    title: 'Haunted House',
    intro:
      "Ghosts are peeking out of every window of the haunted house! Tap them before they hide again, and catch the vampire for extra points. But watch out for the black cat: it lives here, so don't bonk it!",
    kinds: {
      rascal: { name: 'Ghost', image: ghost },
      boss: { name: 'Vampire', image: vampire },
      friend: { name: 'Cat', image: cat },
    },
    caughtNoun: ['ghost caught', 'ghosts caught'],
  },
  {
    enabled: true,
    description: 'Ghosts peek out of the haunted windows. Tap them quick, but leave the black cat alone!',
    themes: ['halloween'],
    thumbnail,
  },
);
