import crab from '../../themes/summer/assets/crab.svg';
import octopus from '../../themes/summer/assets/octopus.svg';
import seagull from '../../themes/summer/assets/seagull.svg';
import { peekGame } from '../peekaboo/game';
import thumbnail from './assets/thumbnail.jpg';
import './SandyCrabs.css';

export const sandyCrabs = peekGame(
  {
    id: 'sandy-crabs',
    title: { 'en-US': 'Sandy Crabs', 'pt-PT': 'Caranguejos na Areia' },
    intro: {
      'en-US':
        "Cheeky crabs are pinching the picnic! Tap them as they pop out of their sand holes, and catch the sneaky octopus for extra points. But the seagull is only looking for a chip, so don't bonk it!",
      'pt-PT':
        'Uns caranguejos atrevidos andam a roubar o piquenique! Toca-lhes quando saírem dos buracos na areia, e apanha o polvo matreiro para ganhares pontos extra. Mas a gaivota só anda à procura de uma batata frita, por isso não lhe toques!',
    },
    kinds: {
      rascal: { name: { 'en-US': 'Crab', 'pt-PT': 'Caranguejo' }, image: crab },
      boss: { name: { 'en-US': 'Sneaky octopus', 'pt-PT': 'Polvo matreiro' }, image: octopus },
      friend: { name: { 'en-US': 'Seagull', 'pt-PT': 'Gaivota' }, image: seagull },
    },
    caughtNoun: { 'en-US': ['crab caught', 'crabs caught'], 'pt-PT': ['caranguejo apanhado', 'caranguejos apanhados'] },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Crabs pop out of their sand holes. Tap them quick, but leave the seagull alone!',
      'pt-PT': 'Os caranguejos saltam dos buracos na areia. Toca-lhes depressa, mas deixa a gaivota em paz!',
    },
    themes: ['summer'],
    thumbnail,
  },
);
