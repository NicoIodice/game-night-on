import alien from '../../themes/space/assets/alien.svg';
import astronaut from '../../themes/space/assets/astronaut.svg';
import ufo from '../../themes/space/assets/ufo.svg';
import { peekGame } from '../peekaboo/game';
import thumbnail from './assets/thumbnail.jpg';
import './CraterCritters.css';

export const craterCritters = peekGame(
  {
    id: 'crater-critters',
    title: { 'en-US': 'Crater Critters', 'pt-PT': 'Bichos das Crateras' },
    intro: {
      'en-US':
        "Little aliens are hiding in the Moon's craters! Tap them as they peek out, and catch the UFO for extra points. But the astronaut is busy collecting moon rocks, so don't bonk them!",
      'pt-PT':
        'Há pequenos extraterrestres escondidos nas crateras da Lua! Toca-lhes quando espreitarem, e apanha o disco voador para ganhares pontos extra. Mas o astronauta está a apanhar pedras da Lua, por isso não lhe toques!',
    },
    kinds: {
      rascal: { name: { 'en-US': 'Alien', 'pt-PT': 'Extraterrestre' }, image: alien },
      boss: { name: { 'en-US': 'UFO', 'pt-PT': 'Disco voador' }, image: ufo },
      friend: { name: { 'en-US': 'Astronaut', 'pt-PT': 'Astronauta' }, image: astronaut },
    },
    caughtNoun: { 'en-US': ['alien caught', 'aliens caught'], 'pt-PT': ['extraterrestre apanhado', 'extraterrestres apanhados'] },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Aliens peek out of the Moon craters. Tap them quick, but leave the astronaut alone!',
      'pt-PT': 'Os extraterrestres espreitam das crateras da Lua. Toca-lhes depressa, mas deixa o astronauta em paz!',
    },
    themes: ['space'],
    thumbnail,
  },
);
