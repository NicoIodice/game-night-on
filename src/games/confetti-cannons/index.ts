import popper from '../../themes/newyear/assets/popper.svg';
import { peekGame } from '../peekaboo/game';
import cork from './assets/cork.svg';
import sleepy from './assets/sleepy.svg';
import thumbnail from './assets/thumbnail.jpg';
import './ConfettiCannons.css';

export const confettiCannons = peekGame(
  {
    id: 'confetti-cannons',
    title: { 'en-US': 'Confetti Cannons', 'pt-PT': 'Canhões de Confetes' },
    intro: {
      'en-US':
        "The party is getting ready for midnight! Tap the confetti cannons as they pop up, and catch the flying cork for extra points. But one guest already fell asleep on the sofa, so don't wake them up!",
      'pt-PT':
        'A festa está a preparar-se para a meia-noite! Toca nos canhões de confetes quando aparecerem, e apanha a rolha voadora para ganhares pontos extra. Mas um convidado já adormeceu no sofá, por isso não o acordes!',
    },
    kinds: {
      rascal: { name: { 'en-US': 'Confetti cannon', 'pt-PT': 'Canhão de confetes' }, image: popper },
      boss: { name: { 'en-US': 'Flying cork', 'pt-PT': 'Rolha voadora' }, image: cork },
      friend: { name: { 'en-US': 'Sleepy guest', 'pt-PT': 'Convidado ensonado' }, image: sleepy },
    },
    caughtNoun: { 'en-US': ['cannon popped', 'cannons popped'], 'pt-PT': ['canhão rebentado', 'canhões rebentados'] },
    holeLabel: (hole) => String(hole + 1).padStart(2, '0'),
  },
  {
    enabled: true,
    description: {
      'en-US': 'Confetti cannons pop up all over the party. Tap them quick, but let the sleepy guest snooze!',
      'pt-PT': 'Os canhões de confetes aparecem por toda a festa. Toca-lhes depressa, mas deixa o convidado ensonado dormir!',
    },
    themes: ['newyear'],
    thumbnail,
  },
);
