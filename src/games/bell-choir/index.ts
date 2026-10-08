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
    title: { 'en-US': 'Bell Choir', 'pt-PT': 'Coro de Sinos' },
    intro: {
      'en-US':
        'The Christmas choir is rehearsing! Watch which ornaments chime, in order, then tap them back the same way. Each time you get it right, the carol grows by one note. Hit a wrong note and the song is over!',
      'pt-PT':
        'O coro de Natal está a ensaiar! Observa que enfeites tocam, e por que ordem, e depois toca-lhes da mesma maneira. Sempre que acertas, a canção cresce mais uma nota. Falha uma nota e a canção acaba!',
    },
    center: bell,
    // A cheerful major scale on the chimes.
    pads: [
      { name: { 'en-US': 'Star', 'pt-PT': 'Estrela' }, image: star, color: '#ffcc4d', note: 'C5' },
      { name: { 'en-US': 'Tree', 'pt-PT': 'Árvore' }, image: tree, color: '#7ee08a', note: 'D5' },
      { name: { 'en-US': 'Candle', 'pt-PT': 'Vela' }, image: candle, color: '#ff8c42', note: 'E5' },
      { name: { 'en-US': 'Snowman', 'pt-PT': 'Boneco de neve' }, image: snowman, color: '#9ad8ff', note: 'G5' },
      { name: { 'en-US': 'Reindeer', 'pt-PT': 'Rena' }, image: reindeer, color: '#e0a46a', note: 'A5' },
      { name: { 'en-US': 'Gingerbread', 'pt-PT': 'Boneco de gengibre' }, image: gingerbread, color: '#ff6b6b', note: 'C6' },
    ],
    outTitle: { 'en-US': 'Wrong note!', 'pt-PT': 'Nota errada!' },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Watch the ornaments chime, then play them back in the same order. The carol grows every round!',
      'pt-PT': 'Observa os enfeites a tocar e repete-os pela mesma ordem. A canção cresce a cada ronda!',
    },
    themes: ['christmas'],
    thumbnail,
  },
);
