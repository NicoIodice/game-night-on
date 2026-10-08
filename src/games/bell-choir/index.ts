import bell from '../../themes/christmas/assets/bell.svg';
import candle from '../../themes/christmas/assets/candle.svg';
import gingerbread from '../../themes/christmas/assets/gingerbread.svg';
import reindeer from '../../themes/christmas/assets/reindeer.svg';
import snowman from '../../themes/christmas/assets/snowman.svg';
import star from '../../themes/christmas/assets/star.svg';
import tree from '../../themes/christmas/assets/tree.svg';
import { sequenceGame } from '../sequence/game';
import thumbnail from './assets/thumbnail.jpg';
import './BellChoir.css';

export const bellChoir = sequenceGame(
  {
    id: 'bell-choir',
    title: 'Bell Choir',
    intro:
      "The Christmas choir is rehearsing! Watch which ornaments chime, in order, then tap them back the same way. Each time you get it right, the carol grows by one note. Hit a wrong note and the song is over!",
    center: bell,
    // A cheerful major scale on the chimes.
    pads: [
      { name: 'Star', image: star, color: '#ffcc4d', note: 'C5' },
      { name: 'Tree', image: tree, color: '#7ee08a', note: 'D5' },
      { name: 'Candle', image: candle, color: '#ff8c42', note: 'E5' },
      { name: 'Snowman', image: snowman, color: '#9ad8ff', note: 'G5' },
      { name: 'Reindeer', image: reindeer, color: '#e0a46a', note: 'A5' },
      { name: 'Gingerbread', image: gingerbread, color: '#ff6b6b', note: 'C6' },
    ],
    outTitle: 'Wrong note!',
  },
  {
    enabled: true,
    description: 'Watch the ornaments chime, then play them back in the same order. The carol grows every round!',
    themes: ['christmas'],
    thumbnail,
  },
);
