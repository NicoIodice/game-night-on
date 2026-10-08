import { shoutGame } from '../shout/game';
import diver from './assets/diver.svg';
import thumbnail from './assets/thumbnail.jpg';
import './Cannonball.css';

export const cannonball = shoutGame(
  {
    id: 'cannonball',
    title: { 'en-US': 'Cannonball!', 'pt-PT': 'Bomba!' },
    intro: {
      'en-US':
        "Who can make the biggest splash in the pool? Stay quiet while we listen to the room, then give your loudest, longest CANNONBALL! The louder you are, the higher the splash goes.",
      'pt-PT':
        'Quem consegue fazer o maior chapão na piscina? Fica em silêncio enquanto ouvimos a sala, e depois solta o teu BOMBA! mais forte e mais longo. Quanto mais alto, mais alto sobe o chapão.',
    },
    mascot: diver,
    call: { 'en-US': 'CANNONBALL!', 'pt-PT': 'BOMBA!' },
    ranks: [
      { from: 0, label: { 'en-US': 'A toe in the water', 'pt-PT': 'Só a pontinha do pé' } },
      { from: 150, label: { 'en-US': 'A little plop', 'pt-PT': 'Um pequeno plof' } },
      { from: 350, label: { 'en-US': 'A proper splash', 'pt-PT': 'Um belo chapão' } },
      { from: 550, label: { 'en-US': 'Everyone got wet!', 'pt-PT': 'Molhou toda a gente!' } },
      { from: 800, label: { 'en-US': 'Tidal wave!', 'pt-PT': 'Maremoto!' } },
    ],
  },
  {
    enabled: true,
    description: {
      'en-US': 'Who makes the biggest splash? Send the water flying with your loudest, longest CANNONBALL!',
      'pt-PT': 'Quem faz o maior chapão? Faz a água voar com o teu BOMBA! mais forte e mais longo!',
    },
    themes: ['summer'],
    thumbnail,
  },
);
