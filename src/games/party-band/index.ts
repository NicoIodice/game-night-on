import trumpet from '../../themes/birthday/assets/trumpet.svg';
import { sequenceGame } from '../sequence/game';
import drum from './assets/drum.svg';
import guitar from './assets/guitar.svg';
import maracas from './assets/maracas.svg';
import popper from './assets/popper.svg';
import tambourine from './assets/tambourine.svg';
import thumbnail from './assets/thumbnail.jpg';
import whistle from './assets/whistle.svg';
import './PartyBand.css';

export const partyBand = sequenceGame(
  {
    id: 'party-band',
    title: { 'en-US': 'Party Band', 'pt-PT': 'Banda da Festa' },
    intro: {
      'en-US':
        'The party band is warming up! Watch which instruments play, in order, then tap them back the same way. Each time you get it right, the tune grows by one note. Play a wrong note and the party music stops!',
      'pt-PT':
        'A banda da festa está a aquecer! Observa que instrumentos tocam, e por que ordem, e depois toca-lhes da mesma maneira. Sempre que acertas, a música cresce mais uma nota. Falha uma nota e a música da festa para!',
    },
    center: popper,
    // A happy major scale, like the first notes of a birthday song.
    pads: [
      { name: { 'en-US': 'Trumpet', 'pt-PT': 'Trompete' }, image: trumpet, color: '#ffd166', note: 'C5' },
      { name: { 'en-US': 'Drum', 'pt-PT': 'Tambor' }, image: drum, color: '#ff5fa2', note: 'D5' },
      { name: { 'en-US': 'Maracas', 'pt-PT': 'Maracas' }, image: maracas, color: '#7ee08a', note: 'E5' },
      { name: { 'en-US': 'Guitar', 'pt-PT': 'Guitarra' }, image: guitar, color: '#ff8c42', note: 'G5' },
      { name: { 'en-US': 'Tambourine', 'pt-PT': 'Pandeireta' }, image: tambourine, color: '#4de1ff', note: 'A5' },
      { name: { 'en-US': 'Whistle', 'pt-PT': 'Apito' }, image: whistle, color: '#c9a0ff', note: 'C6' },
    ],
    outTitle: { 'en-US': 'Off-key!', 'pt-PT': 'Desafinado!' },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Watch the party band play, then play the instruments back in the same order. The tune grows every round!',
      'pt-PT': 'Observa a banda da festa a tocar e repete os instrumentos pela mesma ordem. A música cresce a cada ronda!',
    },
    themes: ['birthday'],
    thumbnail,
  },
);
