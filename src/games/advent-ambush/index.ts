import reindeer from '../../themes/christmas/assets/reindeer.svg';
import { peekGame } from '../peekaboo/game';
import impBoss from './assets/imp-boss.svg';
import imp from './assets/imp.svg';
import thumbnail from './assets/thumbnail.jpg';
import './AdventAmbush.css';

/** The calendar's door numbers, jumbled like a real advent calendar. */
const DOORS = [7, 15, 3, 22, 11, 18, 1, 24, 9, 13, 5, 20];

export const adventAmbush = peekGame(
  {
    id: 'advent-ambush',
    title: { 'en-US': 'Advent Ambush', 'pt-PT': 'Emboscada no Advento' },
    intro: {
      'en-US':
        "Naughty imps are hiding in the advent calendar and stealing the chocolates! Tap them as they pop out of the doors, and catch the imp boss for extra points. But the reindeer is just looking for a carrot, so don't bonk it!",
      'pt-PT':
        'Uns diabretes marotos estão escondidos no calendário do Advento a roubar os chocolates! Toca-lhes quando saírem pelas portas, e apanha o chefe dos diabretes para ganhares pontos extra. Mas a rena só anda à procura de uma cenoura, por isso não lhe toques!',
    },
    kinds: {
      rascal: { name: { 'en-US': 'Imp', 'pt-PT': 'Diabrete' }, image: imp },
      boss: { name: { 'en-US': 'Imp boss', 'pt-PT': 'Chefe dos diabretes' }, image: impBoss },
      friend: { name: { 'en-US': 'Reindeer', 'pt-PT': 'Rena' }, image: reindeer },
    },
    caughtNoun: { 'en-US': ['imp caught', 'imps caught'], 'pt-PT': ['diabrete apanhado', 'diabretes apanhados'] },
    holeLabel: (hole) => String(DOORS[hole % DOORS.length]),
  },
  {
    enabled: true,
    description: {
      'en-US': 'Imps pop out of the advent calendar doors. Tap them quick, but leave the reindeer alone!',
      'pt-PT': 'Os diabretes saltam das portas do calendário do Advento. Toca-lhes depressa, mas deixa a rena em paz!',
    },
    themes: ['christmas'],
    thumbnail,
  },
);
