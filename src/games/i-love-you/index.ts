import wingedHeart from '../../themes/valentine/assets/winged-heart.svg';
import { shoutGame } from '../shout/game';
import thumbnail from './assets/thumbnail.jpg';
import './ILoveYou.css';

export const iLoveYou = shoutGame(
  {
    id: 'i-love-you',
    title: { 'en-US': 'I Love You!', 'pt-PT': 'Amo-te!' },
    intro: {
      'en-US':
        "Tell the whole world how you feel! Stay quiet while we listen to the room, then give your loudest, longest I LOVE YOU. The louder you are, the higher the winged heart flies.",
      'pt-PT':
        'Diz ao mundo inteiro o que sentes! Fica em silêncio enquanto ouvimos a sala, e depois solta o teu AMO-TE mais forte e mais longo. Quanto mais alto, mais alto voa o coração com asas.',
    },
    mascot: wingedHeart,
    call: { 'en-US': 'I LOVE YOU!', 'pt-PT': 'AMO-TE!' },
    ranks: [
      { from: 0, label: { 'en-US': 'A shy whisper', 'pt-PT': 'Um sussurro tímido' } },
      { from: 150, label: { 'en-US': 'A secret crush', 'pt-PT': 'Uma paixoneta secreta' } },
      { from: 350, label: { 'en-US': 'Head over heels', 'pt-PT': 'Perdido de amores' } },
      { from: 550, label: { 'en-US': 'A love song', 'pt-PT': 'Uma canção de amor' } },
      { from: 800, label: { 'en-US': 'True love!', 'pt-PT': 'Amor verdadeiro!' } },
    ],
  },
  {
    enabled: true,
    description: {
      'en-US': 'Who says it loudest? Make the winged heart fly as high as it can with your biggest, longest I LOVE YOU!',
      'pt-PT': 'Quem o diz mais alto? Faz o coração com asas voar o mais alto possível com o teu AMO-TE maior e mais longo!',
    },
    themes: ['valentine'],
    thumbnail,
  },
);
