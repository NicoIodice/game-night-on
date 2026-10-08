import bird from '../../themes/easter/assets/bird.svg';
import { shoutGame } from '../shout/game';
import thumbnail from './assets/thumbnail.jpg';
import './CheepCheep.css';

export const cheepCheep = shoutGame(
  {
    id: 'cheep-cheep',
    title: { 'en-US': 'Cheep Cheep', 'pt-PT': 'Piu-Piu' },
    intro: {
      'en-US':
        "A little bird is learning to fly, and it needs the whole meadow cheering! Stay quiet while we listen to the room, then give your loudest, longest CHEEP CHEEP. The louder you are, the higher the bird flies.",
      'pt-PT':
        'Um passarinho está a aprender a voar e precisa que o prado inteiro o anime! Fica em silêncio enquanto ouvimos a sala, e depois solta o teu PIU PIU mais forte e mais longo. Quanto mais alto, mais alto voa o passarinho.',
    },
    mascot: bird,
    call: { 'en-US': 'CHEEP CHEEP!', 'pt-PT': 'PIU PIU!' },
    ranks: [
      { from: 0, label: { 'en-US': 'Still in the egg', 'pt-PT': 'Ainda no ovo' } },
      { from: 150, label: { 'en-US': 'A sleepy peep', 'pt-PT': 'Um piu ensonado' } },
      { from: 350, label: { 'en-US': 'A happy chirp', 'pt-PT': 'Um chilreio alegre' } },
      { from: 550, label: { 'en-US': 'The dawn chorus', 'pt-PT': 'O coro da madrugada' } },
      { from: 800, label: { 'en-US': 'Ready to fly!', 'pt-PT': 'Pronto para voar!' } },
    ],
  },
  {
    enabled: true,
    description: {
      'en-US': 'Who has the loudest CHEEP CHEEP? Help the little bird fly as high as it can with your biggest, longest chirp!',
      'pt-PT': 'Quem tem o PIU PIU mais forte? Ajuda o passarinho a voar o mais alto possível com o teu chilreio maior e mais longo!',
    },
    themes: ['easter'],
    thumbnail,
  },
);
