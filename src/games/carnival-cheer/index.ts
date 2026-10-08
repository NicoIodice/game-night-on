import parrot from '../../themes/carnival/assets/parrot.svg';
import { shoutGame } from '../shout/game';
import thumbnail from './assets/thumbnail.jpg';
import './CarnivalCheer.css';

export const carnivalCheer = shoutGame(
  {
    id: 'carnival-cheer',
    title: { 'en-US': 'Carnival Cheer', 'pt-PT': 'Grito de Carnaval' },
    intro: {
      'en-US':
        "The parade needs the crowd to go wild! Stay quiet while we listen to the room, then give your loudest, longest CARNIVAL cheer. The louder you are, the higher the parrot flies.",
      'pt-PT':
        'O desfile precisa que o público vá à loucura! Fica em silêncio enquanto ouvimos a sala, e depois solta o teu grito de CARNAVAL mais forte e mais longo. Quanto mais alto, mais alto voa o papagaio.',
    },
    mascot: parrot,
    call: { 'en-US': 'CARNIVAL!', 'pt-PT': 'CARNAVAL!' },
    ranks: [
      { from: 0, label: { 'en-US': 'Still putting on the costume', 'pt-PT': 'Ainda a vestir o disfarce' } },
      { from: 150, label: { 'en-US': 'A shy wave', 'pt-PT': 'Um aceno envergonhado' } },
      { from: 350, label: { 'en-US': 'Dancing along', 'pt-PT': 'A dançar com o desfile' } },
      { from: 550, label: { 'en-US': 'The whole crowd cheering', 'pt-PT': 'O público todo a gritar' } },
      { from: 800, label: { 'en-US': 'King of the carnival!', 'pt-PT': 'Rei do carnaval!' } },
    ],
  },
  {
    enabled: true,
    description: {
      'en-US': 'Who cheers loudest at the parade? Make the parrot fly as high as it can with your biggest, longest cheer!',
      'pt-PT': 'Quem grita mais alto no desfile? Faz o papagaio voar o mais alto possível com o teu grito maior e mais longo!',
    },
    themes: ['carnival'],
    thumbnail,
  },
);
