import type { Theme } from '../../core/types';
import alien from './assets/alien.svg';
import astronaut from './assets/astronaut.svg';
import balloon from './assets/balloon.svg';
import cape from './assets/cape.svg';
import car from './assets/car.svg';
import comet from './assets/comet.svg';
import favicon from './assets/favicon.svg';
import guitar from './assets/guitar.svg';
import jar from './assets/jar.svg';
import moon from './assets/moon.svg';
import parcel from './assets/parcel.svg';
import planet from './assets/planet.svg';
import raccoon from './assets/raccoon.svg';
import robot from './assets/robot.svg';
import rocket from './assets/rocket.svg';
import satellite from './assets/satellite.svg';
import saw from './assets/saw.svg';
import spoon from './assets/spoon.svg';
import star from './assets/star.svg';
import tag from './assets/tag.svg';
import telescope from './assets/telescope.svg';
import whip from './assets/whip.svg';
import trumpet from './assets/trumpet.svg';
import { spaceMusic } from './music';
import { createSpaceSounds } from './sounds';

export const space: Theme = {
  id: 'space',
  name: { 'en-US': 'Space Night', 'pt-PT': 'Noite no Espaço' },
  tagline: { 'en-US': 'Out-of-this-world games for any night', 'pt-PT': 'Jogos de outro mundo para qualquer noite' },
  icon: planet,
  favicon,
  enabled: true,
  decks: {
    'en-US': [
      [
        // Card ids are unique across themes, and Christmas already has a "star".
        { id: 'space-star', label: 'Star', image: star },
        { id: 'car', label: 'Car', image: car },
        { id: 'jar', label: 'Jar', image: jar },
        { id: 'guitar', label: 'Guitar', image: guitar },
      ],
      [
        { id: 'moon', label: 'Moon', image: moon },
        { id: 'spoon', label: 'Spoon', image: spoon },
        { id: 'raccoon', label: 'Raccoon', image: raccoon },
        // The birthday party already has a "balloon".
        { id: 'hot-air-balloon', label: 'Balloon', image: balloon },
      ],
      [
        { id: 'rocket', label: 'Rocket', image: rocket },
        { id: 'astronaut', label: 'Astronaut', image: astronaut },
        { id: 'planet', label: 'Planet', image: planet },
        { id: 'alien', label: 'Alien', image: alien },
        { id: 'satellite', label: 'Satellite', image: satellite },
        { id: 'comet', label: 'Comet', image: comet },
        { id: 'telescope', label: 'Telescope', image: telescope },
      ],
    ],
    // The English rhymes don't rhyme in Portuguese, so the decks keep the idea instead of the
    // words: "-ote" words, then "-eta" words starting with the planet, then the space words of different lengths.
    'pt-PT': [
      [
        { id: 'pacote', label: 'Pacote', image: parcel },
        { id: 'chicote', label: 'Chicote', image: whip },
        { id: 'serrote', label: 'Serrote', image: saw },
        { id: 'capote', label: 'Capote', image: cape },
      ],
      [
        { id: 'planeta', label: 'Planeta', image: planet },
        { id: 'cometa', label: 'Cometa', image: comet },
        { id: 'trombeta', label: 'Trombeta', image: trumpet },
        { id: 'etiqueta', label: 'Etiqueta', image: tag },
      ],
      [
        { id: 'foguetao', label: 'Foguetão', image: rocket, sayAs: ['foguete'] },
        { id: 'astronauta', label: 'Astronauta', image: astronaut },
        { id: 'lua', label: 'Lua', image: moon },
        { id: 'satelite', label: 'Satélite', image: satellite },
        { id: 'extraterrestre', label: 'Extraterrestre', image: alien, sayAs: ['alienígena'] },
        { id: 'telescopio', label: 'Telescópio', image: telescope },
        { id: 'robo', label: 'Robô', image: robot },
      ],
    ],
  },
  music: spaceMusic,
  createSounds: createSpaceSounds,
};
