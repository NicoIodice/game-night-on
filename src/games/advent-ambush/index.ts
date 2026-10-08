import reindeer from '../../themes/christmas/assets/reindeer.svg';
import { peekGame } from '../peekaboo/game';
import impBoss from './assets/imp-boss.svg';
import imp from './assets/imp.svg';
import thumbnail from './assets/thumbnail.jpg';
import './AdventAmbush.css';

/** The calendar's door numbers, jumbled like a real advent calendar. */
const DOORS = [7, 15, 3, 22, 11, 18, 1, 24, 9, 13, 5, 20];

export const adventAmbush = peekGame(
  {
    id: 'advent-ambush',
    title: 'Advent Ambush',
    intro:
      "Naughty imps are hiding in the advent calendar and stealing the chocolates! Tap them as they pop out of the doors, and catch the imp boss for extra points. But the reindeer is just looking for a carrot, so don't bonk it!",
    kinds: {
      rascal: { name: 'Imp', image: imp },
      boss: { name: 'Imp boss', image: impBoss },
      friend: { name: 'Reindeer', image: reindeer },
    },
    caughtNoun: ['imp caught', 'imps caught'],
    holeLabel: (hole) => String(DOORS[hole % DOORS.length]),
  },
  {
    enabled: true,
    description: 'Imps pop out of the advent calendar doors. Tap them quick, but leave the reindeer alone!',
    themes: ['christmas'],
    thumbnail,
  },
);
