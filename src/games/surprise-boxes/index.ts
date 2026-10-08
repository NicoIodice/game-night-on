import balloon from '../../themes/birthday/assets/balloon.svg';
import cake from '../../themes/birthday/assets/cake.svg';
import { peekGame } from '../peekaboo/game';
import pinata from './assets/pinata.svg';
import thumbnail from './assets/thumbnail.jpg';
import './SurpriseBoxes.css';

export const surpriseBoxes = peekGame(
  {
    id: 'surprise-boxes',
    title: { 'en-US': 'Surprise Boxes', 'pt-PT': 'Caixas Surpresa' },
    intro: {
      'en-US':
        "The party boxes are full of surprises! Tap the balloons as they pop out, and catch the piñata for extra points. But the birthday cake is for later, so don't bonk it!",
      'pt-PT':
        'As caixas da festa estão cheias de surpresas! Toca nos balões quando saltarem cá para fora, e apanha a piñata para ganhares pontos extra. Mas o bolo de anos é para mais logo, por isso não lhe toques!',
    },
    kinds: {
      rascal: { name: { 'en-US': 'Balloon', 'pt-PT': 'Balão' }, image: balloon },
      boss: { name: { 'en-US': 'Piñata', 'pt-PT': 'Piñata' }, image: pinata },
      friend: { name: { 'en-US': 'Birthday cake', 'pt-PT': 'Bolo de anos' }, image: cake },
    },
    caughtNoun: { 'en-US': ['surprise caught', 'surprises caught'], 'pt-PT': ['surpresa apanhada', 'surpresas apanhadas'] },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Balloons pop out of the party boxes. Tap them quick, but leave the birthday cake alone!',
      'pt-PT': 'Os balões saltam das caixas da festa. Toca-lhes depressa, mas deixa o bolo de anos em paz!',
    },
    themes: ['birthday'],
    thumbnail,
  },
);
