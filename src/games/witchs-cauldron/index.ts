import bat from '../../themes/halloween/assets/bat.svg';
import cauldron from '../../themes/halloween/assets/cauldron.svg';
import ghost from '../../themes/halloween/assets/ghost.svg';
import rat from '../../themes/halloween/assets/rat.svg';
import skeleton from '../../themes/halloween/assets/skeleton.svg';
import snake from '../../themes/halloween/assets/snake.svg';
import spider from '../../themes/halloween/assets/spider.svg';
import { sequenceGame } from '../sequence/game';
import thumbnail from './assets/thumbnail.jpg';
import './WitchsCauldron.css';

export const witchsCauldron = sequenceGame(
  {
    id: 'witchs-cauldron',
    title: { 'en-US': "Witch's Cauldron", 'pt-PT': 'Caldeirão da Bruxa' },
    intro: {
      'en-US':
        'The witch is brewing a spell! Watch which ingredients glow, in order, then tap them back the same way. Each time you get it right, the recipe grows by one. Add the wrong ingredient and… poof!',
      'pt-PT':
        'A bruxa está a preparar um feitiço! Observa que ingredientes brilham, e por que ordem, e depois toca-lhes da mesma maneira. Sempre que acertas, a receita cresce mais um. Junta o ingrediente errado e… puf!',
    },
    center: cauldron,
    // A spooky minor scale on the organ.
    pads: [
      { name: { 'en-US': 'Spider', 'pt-PT': 'Aranha' }, image: spider, color: '#8cff5a', note: 'A3' },
      { name: { 'en-US': 'Bat', 'pt-PT': 'Morcego' }, image: bat, color: '#b388ff', note: 'C4' },
      { name: { 'en-US': 'Snake', 'pt-PT': 'Cobra' }, image: snake, color: '#ff7a18', note: 'D4' },
      { name: { 'en-US': 'Rat', 'pt-PT': 'Rato' }, image: rat, color: '#ff4d6d', note: 'E4' },
      { name: { 'en-US': 'Ghost', 'pt-PT': 'Fantasma' }, image: ghost, color: '#4cc9f0', note: 'G4' },
      { name: { 'en-US': 'Bones', 'pt-PT': 'Ossos' }, image: skeleton, color: '#ffd166', note: 'A4' },
    ],
    outTitle: { 'en-US': 'Wrong ingredient!', 'pt-PT': 'Ingrediente errado!' },
  },
  {
    enabled: true,
    description: {
      'en-US': 'Watch the ingredients glow, then add them to the cauldron in the same order. The spell grows every round!',
      'pt-PT': 'Observa os ingredientes a brilhar e junta-os ao caldeirão pela mesma ordem. O feitiço cresce a cada ronda!',
    },
    themes: ['halloween'],
    thumbnail,
  },
);
