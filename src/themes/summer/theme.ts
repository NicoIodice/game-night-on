import type { Theme } from '../../core/types';
import boat from './assets/boat.svg';
import coat from './assets/coat.svg';
import crab from './assets/crab.svg';
import favicon from './assets/favicon.svg';
import goat from './assets/goat.svg';
import hook from './assets/hook.svg';
import lighthouse from './assets/lighthouse.svg';
import mermaid from './assets/mermaid.svg';
import note from './assets/note.svg';
import octopus from './assets/octopus.svg';
import pail from './assets/pail.svg';
import sail from './assets/sail.svg';
import seagull from './assets/seagull.svg';
import shell from './assets/shell.svg';
import snail from './assets/snail.svg';
import socks from './assets/socks.svg';
import starfish from './assets/starfish.svg';
import sun from './assets/sun.svg';
import sunglasses from './assets/sunglasses.svg';
import surfboard from './assets/surfboard.svg';
import umbrella from './assets/umbrella.svg';
import web from './assets/web.svg';
import whale from './assets/whale.svg';
import { summerMusic } from './music';
import { createSummerSounds } from './sounds';

export const summer: Theme = {
  id: 'summer',
  name: { 'en-US': 'Summer Beach', 'pt-PT': 'Praia de Verão' },
  tagline: { 'en-US': 'Sunny games for beach days and pool parties', 'pt-PT': 'Jogos de sol para dias de praia e festas na piscina' },
  icon: sun,
  favicon,
  enabled: true,
  decks: {
    'en-US': [
      [
        { id: 'sail', label: 'Sail', image: sail, sayAs: ['sale'] },
        { id: 'pail', label: 'Pail', image: pail, sayAs: ['pale', 'bucket'] },
        { id: 'whale', label: 'Whale', image: whale, sayAs: ['wail', 'well'] },
        { id: 'snail', label: 'Snail', image: snail },
      ],
      [
        { id: 'boat', label: 'Boat', image: boat },
        { id: 'goat', label: 'Goat', image: goat },
        { id: 'coat', label: 'Coat', image: coat },
        { id: 'note', label: 'Note', image: note, sayAs: ['notes'] },
      ],
      [
        { id: 'crab', label: 'Crab', image: crab },
        { id: 'seagull', label: 'Seagull', image: seagull, sayAs: ['gull'] },
        { id: 'starfish', label: 'Starfish', image: starfish },
        { id: 'surfboard', label: 'Surfboard', image: surfboard },
        { id: 'sunglasses', label: 'Sunglasses', image: sunglasses, sayAs: ['glasses'] },
        { id: 'umbrella', label: 'Umbrella', image: umbrella },
        { id: 'octopus', label: 'Octopus', image: octopus },
      ],
    ],
    // The English rhymes don't rhyme in Portuguese, so the decks keep the idea instead of the
    // words: seaside things ending in "-ol", then "-eia" words, then the beach words of different lengths.
    'pt-PT': [
      [
        { id: 'sol', label: 'Sol', image: sun },
        { id: 'farol', label: 'Farol', image: lighthouse },
        { id: 'anzol', label: 'Anzol', image: hook },
        { id: 'caracol', label: 'Caracol', image: snail },
      ],
      [
        { id: 'baleia', label: 'Baleia', image: whale },
        { id: 'sereia', label: 'Sereia', image: mermaid },
        { id: 'meia', label: 'Meia', image: socks, sayAs: ['maia'] },
        { id: 'teia', label: 'Teia', image: web },
      ],
      [
        { id: 'caranguejo', label: 'Caranguejo', image: crab },
        { id: 'gaivota', label: 'Gaivota', image: seagull },
        { id: 'prancha', label: 'Prancha', image: surfboard },
        { id: 'polvo', label: 'Polvo', image: octopus },
        { id: 'oculos', label: 'Óculos', image: sunglasses },
        { id: 'barco', label: 'Barco', image: boat },
        { id: 'concha', label: 'Concha', image: shell },
      ],
    ],
  },
  music: summerMusic,
  createSounds: createSummerSounds,
};
