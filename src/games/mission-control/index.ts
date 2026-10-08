import comet from '../../themes/space/assets/comet.svg';
import moon from '../../themes/space/assets/moon.svg';
import planet from '../../themes/space/assets/planet.svg';
import radar from '../../themes/space/assets/radar.svg';
import rocket from '../../themes/space/assets/rocket.svg';
import satellite from '../../themes/space/assets/satellite.svg';
import star from '../../themes/space/assets/star.svg';
import { sequenceGame } from '../sequence/game';
import thumbnail from './assets/thumbnail.jpg';
import './MissionControl.css';

export const missionControl = sequenceGame(
  {
    id: 'mission-control',
    title: { 'en-US': 'Mission Control', 'pt-PT': 'Controlo da Missão' },
    intro: {
      'en-US':
        'Mission control is sending the launch code! Watch which buttons beep, in order, then tap them back the same way. Each time you get it right, the code grows by one beep. Press a wrong button and the launch is aborted!',
      'pt-PT':
        'O controlo da missão está a enviar o código de lançamento! Observa que botões apitam, e por que ordem, e depois toca-lhes da mesma maneira. Sempre que acertas, o código cresce mais um apito. Carrega no botão errado e o lançamento é cancelado!',
    },
    center: radar,
    // Computer beeps on a whole-tone scale: futuristic in any order.
    pads: [
      { name: { 'en-US': 'Rocket', 'pt-PT': 'Foguetão' }, image: rocket, color: '#ff7a5c', note: 'C5' },
      { name: { 'en-US': 'Planet', 'pt-PT': 'Planeta' }, image: planet, color: '#ff7ad9', note: 'D5' },
      { name: { 'en-US': 'Moon', 'pt-PT': 'Lua' }, image: moon, color: '#eef3ff', note: 'E5' },
      { name: { 'en-US': 'Comet', 'pt-PT': 'Cometa' }, image: comet, color: '#ffd166', note: 'F#5' },
      { name: { 'en-US': 'Satellite', 'pt-PT': 'Satélite' }, image: satellite, color: '#7ee08a', note: 'G#5' },
      { name: { 'en-US': 'Star', 'pt-PT': 'Estrela' }, image: star, color: '#5ef0ff', note: 'A#5' },
    ],
    outTitle: { 'en-US': 'Launch aborted!', 'pt-PT': 'Lançamento cancelado!' },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Watch the control panel beep, then press the buttons back in the same order. The launch code grows every round!',
      'pt-PT': 'Observa o painel de controlo a apitar e carrega nos botões pela mesma ordem. O código cresce a cada ronda!',
    },
    themes: ['space'],
    thumbnail,
  },
);
