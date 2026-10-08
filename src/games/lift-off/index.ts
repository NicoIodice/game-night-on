import rocket from '../../themes/space/assets/rocket.svg';
import { shoutGame } from '../shout/game';
import thumbnail from './assets/thumbnail.jpg';
import './LiftOff.css';

export const liftOff = shoutGame(
  {
    id: 'lift-off',
    title: { 'en-US': 'Lift Off!', 'pt-PT': 'Descolar!' },
    intro: {
      'en-US':
        "The rocket's engines need your voice to fire up! Stay quiet while we listen to the room, then give your loudest, longest 3, 2, 1, LIFT OFF! The louder you are, the higher the rocket climbs.",
      'pt-PT':
        'Os motores do foguetão precisam da tua voz para arrancar! Fica em silêncio enquanto ouvimos a sala, e depois solta o teu 3, 2, 1, DESCOLAR! mais forte e mais longo. Quanto mais alto, mais alto sobe o foguetão.',
    },
    mascot: rocket,
    call: { 'en-US': '3, 2, 1, LIFT OFF!', 'pt-PT': '3, 2, 1, DESCOLAR!' },
    ranks: [
      { from: 0, label: { 'en-US': 'Still on the launch pad', 'pt-PT': 'Ainda na rampa' } },
      { from: 150, label: { 'en-US': 'Engines warming up', 'pt-PT': 'Motores a aquecer' } },
      { from: 350, label: { 'en-US': 'Up in the clouds', 'pt-PT': 'Lá em cima nas nuvens' } },
      { from: 550, label: { 'en-US': 'In orbit', 'pt-PT': 'Em órbita' } },
      { from: 800, label: { 'en-US': 'To the Moon!', 'pt-PT': 'Até à Lua!' } },
    ],
  },
  {
    enabled: true,
    description: {
      'en-US': 'Who launches the rocket highest? Fire up the engines with your loudest, longest LIFT OFF!',
      'pt-PT': 'Quem lança o foguetão mais alto? Liga os motores com o teu DESCOLAR! mais forte e mais longo!',
    },
    themes: ['space'],
    thumbnail,
  },
);
