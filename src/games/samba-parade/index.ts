import crown from '../../themes/carnival/assets/crown.svg';
import drum from '../../themes/carnival/assets/drum.svg';
import feather from '../../themes/carnival/assets/feather.svg';
import maracas from '../../themes/carnival/assets/maracas.svg';
import parrot from '../../themes/carnival/assets/parrot.svg';
import tambourine from '../../themes/carnival/assets/tambourine.svg';
import { sequenceGame } from '../sequence/game';
import thumbnail from './assets/thumbnail.jpg';
import whistle from './assets/whistle.svg';
import './SambaParade.css';

export const sambaParade = sequenceGame(
  {
    id: 'samba-parade',
    title: { 'en-US': 'Samba Parade', 'pt-PT': 'Desfile de Samba' },
    intro: {
      'en-US':
        'The samba school is warming up for the parade! Watch who plays, in order, then tap them back the same way. Each time you get it right, the rhythm grows by one beat. Miss a beat and the parade stops!',
      'pt-PT':
        'A escola de samba está a aquecer para o desfile! Observa quem toca, e por que ordem, e depois toca-lhes da mesma maneira. Sempre que acertas, o ritmo cresce mais uma batida. Falha uma batida e o desfile para!',
    },
    center: drum,
    // A bright mixolydian scale, like a samba brass section.
    pads: [
      { name: { 'en-US': 'Tambourine', 'pt-PT': 'Pandeireta' }, image: tambourine, color: '#ffcc00', note: 'G4' },
      { name: { 'en-US': 'Maracas', 'pt-PT': 'Maracas' }, image: maracas, color: '#00d68f', note: 'A4' },
      { name: { 'en-US': 'Whistle', 'pt-PT': 'Apito' }, image: whistle, color: '#4de1ff', note: 'B4' },
      { name: { 'en-US': 'Feather', 'pt-PT': 'Pena' }, image: feather, color: '#ff5fa2', note: 'D5' },
      { name: { 'en-US': 'Crown', 'pt-PT': 'Coroa' }, image: crown, color: '#e0b04a', note: 'E5' },
      { name: { 'en-US': 'Parrot', 'pt-PT': 'Papagaio' }, image: parrot, color: '#ff5f5f', note: 'F5' },
    ],
    outTitle: { 'en-US': 'Missed a beat!', 'pt-PT': 'Falhaste a batida!' },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Watch the samba school play, then play it back in the same order. The rhythm grows every round!',
      'pt-PT': 'Observa a escola de samba a tocar e repete pela mesma ordem. O ritmo cresce a cada ronda!',
    },
    themes: ['carnival'],
    thumbnail,
  },
);
