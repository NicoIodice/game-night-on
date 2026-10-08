import clock from '../../themes/newyear/assets/clock.svg';
import grapes from '../../themes/newyear/assets/grapes.svg';
import hourglass from '../../themes/newyear/assets/hourglass.svg';
import popper from '../../themes/newyear/assets/popper.svg';
import rocket from '../../themes/newyear/assets/rocket.svg';
import sparkler from '../../themes/newyear/assets/sparkler.svg';
import { sequenceGame } from '../sequence/game';
import clockTower from './assets/clock-tower.svg';
import thumbnail from './assets/thumbnail.jpg';
import './MidnightChimes.css';

export const midnightChimes = sequenceGame(
  {
    id: 'midnight-chimes',
    title: { 'en-US': 'Midnight Chimes', 'pt-PT': 'Badaladas da Meia-Noite' },
    intro: {
      'en-US':
        'The clock tower is about to strike midnight! Watch which party things chime, in order, then tap them back the same way. Each time you get it right, the countdown grows by one chime. Miss a chime and the new year starts without you!',
      'pt-PT':
        'A torre do relógio está quase a dar a meia-noite! Observa que coisas da festa tocam, e por que ordem, e depois toca-lhes da mesma maneira. Sempre que acertas, a contagem cresce mais uma badalada. Falha uma badalada e o ano novo começa sem ti!',
    },
    center: clockTower,
    // Big-clock chimes: a bright major scale.
    pads: [
      { name: { 'en-US': 'Clock', 'pt-PT': 'Relógio' }, image: clock, color: '#f5c542', note: 'E5' },
      { name: { 'en-US': 'Firework', 'pt-PT': 'Foguete' }, image: rocket, color: '#ff5fa2', note: 'F#5' },
      { name: { 'en-US': 'Grapes', 'pt-PT': 'Passas' }, image: grapes, color: '#a46bff', note: 'G#5' },
      { name: { 'en-US': 'Party popper', 'pt-PT': 'Lança-confetes' }, image: popper, color: '#4de1ff', note: 'B5' },
      { name: { 'en-US': 'Hourglass', 'pt-PT': 'Ampulheta' }, image: hourglass, color: '#e0c9a6', note: 'C#6' },
      { name: { 'en-US': 'Sparkler', 'pt-PT': 'Estrelinha' }, image: sparkler, color: '#7ee08a', note: 'E6' },
    ],
    outTitle: { 'en-US': 'Missed the chime!', 'pt-PT': 'Falhaste a badalada!' },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Watch the party things chime, then play them back in the same order. The countdown grows every round!',
      'pt-PT': 'Observa as coisas da festa a tocar e repete-as pela mesma ordem. A contagem cresce a cada ronda!',
    },
    themes: ['newyear'],
    thumbnail,
  },
);
