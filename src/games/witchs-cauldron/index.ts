import bat from '../../themes/halloween/assets/bat.svg';
import cauldron from '../../themes/halloween/assets/cauldron.svg';
import ghost from '../../themes/halloween/assets/ghost.svg';
import rat from '../../themes/halloween/assets/rat.svg';
import skeleton from '../../themes/halloween/assets/skeleton.svg';
import snake from '../../themes/halloween/assets/snake.svg';
import spider from '../../themes/halloween/assets/spider.svg';
import { sequenceGame } from '../sequence/game';
import thumbnail from './assets/thumbnail.jpg';
import './WitchsCauldron.css';

export const witchsCauldron = sequenceGame(
  {
    id: 'witchs-cauldron',
    title: "Witch's Cauldron",
    intro:
      "The witch is brewing a spell! Watch which ingredients glow, in order, then tap them back the same way. Each time you get it right, the recipe grows by one. Add the wrong ingredient and… poof!",
    center: cauldron,
    // A spooky minor scale on the organ.
    pads: [
      { name: 'Spider', image: spider, color: '#8cff5a', note: 'A3' },
      { name: 'Bat', image: bat, color: '#b388ff', note: 'C4' },
      { name: 'Snake', image: snake, color: '#ff7a18', note: 'D4' },
      { name: 'Rat', image: rat, color: '#ff4d6d', note: 'E4' },
      { name: 'Ghost', image: ghost, color: '#4cc9f0', note: 'G4' },
      { name: 'Bones', image: skeleton, color: '#ffd166', note: 'A4' },
    ],
    outTitle: 'Wrong ingredient!',
  },
  {
    enabled: true,
    description: 'Watch the ingredients glow, then add them to the cauldron in the same order. The spell grows every round!',
    themes: ['halloween'],
    thumbnail,
  },
);
