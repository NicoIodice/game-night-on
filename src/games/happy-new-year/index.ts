import rocket from '../../themes/newyear/assets/rocket.svg';
import { shoutGame } from '../shout/game';
import thumbnail from './assets/thumbnail.jpg';
import './HappyNewYear.css';

export const happyNewYear = shoutGame(
  {
    id: 'happy-new-year',
    title: { 'en-US': 'Happy New Year!', 'pt-PT': 'Feliz Ano Novo!' },
    intro: {
      'en-US':
        "The countdown is over, it's time to cheer! Stay quiet while we listen to the room, then give your loudest, longest HAPPY NEW YEAR. The louder you are, the higher the firework goes.",
      'pt-PT':
        'A contagem acabou, está na hora de festejar! Fica em silêncio enquanto ouvimos a sala, e depois solta o teu FELIZ ANO NOVO mais forte e mais longo. Quanto mais alto, mais alto sobe o foguete.',
    },
    mascot: rocket,
    call: { 'en-US': 'HAPPY NEW YEAR!', 'pt-PT': 'FELIZ ANO NOVO!' },
    ranks: [
      { from: 0, label: { 'en-US': 'Still asleep', 'pt-PT': 'Ainda a dormir' } },
      { from: 150, label: { 'en-US': 'A little sparkler', 'pt-PT': 'Uma estrelinha' } },
      { from: 350, label: { 'en-US': 'A party popper', 'pt-PT': 'Um lança-confetes' } },
      { from: 550, label: { 'en-US': 'A big firework', 'pt-PT': 'Um grande foguete' } },
      { from: 800, label: { 'en-US': 'Midnight finale!', 'pt-PT': 'O grande final!' } },
    ],
  },
  {
    enabled: true,
    description: {
      'en-US': 'Who cheers loudest at midnight? Send the firework sky-high with your biggest, longest HAPPY NEW YEAR!',
      'pt-PT': 'Quem festeja mais alto à meia-noite? Manda o foguete lá para cima com o teu FELIZ ANO NOVO maior e mais longo!',
    },
    themes: ['newyear'],
    thumbnail,
  },
);
