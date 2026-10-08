import reindeer from '../../themes/christmas/assets/reindeer.svg';
import { shoutGame } from '../shout/game';
import thumbnail from './assets/thumbnail.jpg';
import './HoHoHoller.css';

export const hoHoHoller = shoutGame(
  {
    id: 'ho-ho-holler',
    title: { 'en-US': 'Ho Ho Holler', 'pt-PT': 'Ho Ho Hoooo!' },
    intro: {
      'en-US':
        "Santa's reindeer need a jolly boost to take off! Stay quiet while we listen to the room, then give your biggest, longest HO HO HO. The louder you are, the higher the reindeer flies.",
      'pt-PT':
        'As renas do Pai Natal precisam de um empurrão alegre para levantar voo! Fica em silêncio enquanto ouvimos a sala, e depois solta o teu HO HO HO maior e mais longo. Quanto mais alto, mais alto voa a rena.',
    },
    mascot: reindeer,
    call: { 'en-US': 'HO HO HO!', 'pt-PT': 'HO HO HO!' },
    ranks: [
      { from: 0, label: { 'en-US': 'A tiny hiccup', 'pt-PT': 'Um soluço pequenino' } },
      { from: 150, label: { 'en-US': 'A polite ho', 'pt-PT': 'Um ho bem-educado' } },
      { from: 350, label: { 'en-US': 'A jolly ho ho', 'pt-PT': 'Um ho ho bem-disposto' } },
      { from: 550, label: { 'en-US': 'A big belly laugh', 'pt-PT': 'Uma grande gargalhada' } },
      { from: 800, label: { 'en-US': 'Santa-sized!', 'pt-PT': 'Digno do Pai Natal!' } },
    ],
  },
  {
    enabled: true,
    description: {
      'en-US': 'Who has the jolliest HO HO HO? Make the reindeer fly as high as it can with your loudest, longest holler!',
      'pt-PT': 'Quem tem o HO HO HO mais alegre? Faz a rena voar o mais alto possível com o teu grito mais forte e mais longo!',
    },
    themes: ['christmas'],
    thumbnail,
  },
);
