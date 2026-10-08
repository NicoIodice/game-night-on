import ghost from '../../themes/halloween/assets/ghost.svg';
import { shoutGame } from '../shout/game';
import thumbnail from './assets/thumbnail.jpg';
import './ScreamMeter.css';

export const screamMeter = shoutGame(
  {
    id: 'scream-meter',
    title: { 'en-US': 'Scream Meter', 'pt-PT': 'Gritómetro' },
    intro: {
      'en-US':
        'Let out your scariest scream! Stay quiet while we listen to the room, then scream as loud as you can, for as long as you can. The louder you are, the higher the ghost flies.',
      'pt-PT':
        'Solta o teu grito mais assustador! Fica em silêncio enquanto ouvimos a sala, e depois grita o mais alto que conseguires, durante o máximo de tempo. Quanto mais alto gritares, mais alto voa o fantasma.',
    },
    mascot: ghost,
    call: { 'en-US': 'SCREAM!', 'pt-PT': 'GRITA!' },
    ranks: [
      { from: 0, label: { 'en-US': 'A tiny squeak', 'pt-PT': 'Um guinchinho' } },
      { from: 150, label: { 'en-US': 'A spooky whisper', 'pt-PT': 'Um sussurro arrepiante' } },
      { from: 350, label: { 'en-US': 'A ghostly wail', 'pt-PT': 'Um lamento fantasmagórico' } },
      { from: 550, label: { 'en-US': 'A terrifying shriek', 'pt-PT': 'Um berro aterrador' } },
      { from: 800, label: { 'en-US': 'Blood-curdling!', 'pt-PT': 'De gelar o sangue!' } },
    ],
  },
  {
    enabled: true,
    description: {
      'en-US': 'Who has the scariest scream? Make the ghost fly as high as it can with your loudest, longest scream!',
      'pt-PT': 'Quem tem o grito mais assustador? Faz o fantasma voar o mais alto possível com o teu grito mais forte e mais longo!',
    },
    themes: ['halloween'],
    thumbnail,
  },
);
