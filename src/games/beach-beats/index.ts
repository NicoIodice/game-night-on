import crab from '../../themes/summer/assets/crab.svg';
import shell from '../../themes/summer/assets/shell.svg';
import starfish from '../../themes/summer/assets/starfish.svg';
import sun from '../../themes/summer/assets/sun.svg';
import { sequenceGame } from '../sequence/game';
import drum from './assets/drum.svg';
import palm from './assets/palm.svg';
import pineapple from './assets/pineapple.svg';
import thumbnail from './assets/thumbnail.jpg';
import './BeachBeats.css';

export const beachBeats = sequenceGame(
  {
    id: 'beach-beats',
    title: { 'en-US': 'Beach Beats', 'pt-PT': 'Ritmos da Praia' },
    intro: {
      'en-US':
        'The steel drum band is playing on the beach! Watch which beach things ring out, in order, then tap them back the same way. Each time you get it right, the tune grows by one note. Hit a wrong note and the beach party is over!',
      'pt-PT':
        'A banda de tambores de aço está a tocar na praia! Observa que coisas da praia tocam, e por que ordem, e depois toca-lhes da mesma maneira. Sempre que acertas, a música cresce mais uma nota. Falha uma nota e a festa na praia acaba!',
    },
    center: drum,
    // A sunny major scale on the steel drum.
    pads: [
      { name: { 'en-US': 'Sun', 'pt-PT': 'Sol' }, image: sun, color: '#ffd166', note: 'C5' },
      { name: { 'en-US': 'Shell', 'pt-PT': 'Concha' }, image: shell, color: '#ff8f7a', note: 'D5' },
      { name: { 'en-US': 'Palm tree', 'pt-PT': 'Palmeira' }, image: palm, color: '#7ee08a', note: 'E5' },
      { name: { 'en-US': 'Crab', 'pt-PT': 'Caranguejo' }, image: crab, color: '#ff6b6b', note: 'G5' },
      { name: { 'en-US': 'Starfish', 'pt-PT': 'Estrela-do-mar' }, image: starfish, color: '#ffb347', note: 'A5' },
      { name: { 'en-US': 'Pineapple', 'pt-PT': 'Ananás' }, image: pineapple, color: '#3ee6d0', note: 'C6' },
    ],
    outTitle: { 'en-US': 'Wipeout!', 'pt-PT': 'Trambolhão!' },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Watch the beach things ring out, then play them back in the same order. The tune grows every round!',
      'pt-PT': 'Observa as coisas da praia a tocar e repete-as pela mesma ordem. A música cresce a cada ronda!',
    },
    themes: ['summer'],
    thumbnail,
  },
);
