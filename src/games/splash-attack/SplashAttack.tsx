import type { GameProps } from '../../core/types';
import seagull from '../../themes/summer/assets/seagull.svg';
import starfish from '../../themes/summer/assets/starfish.svg';
import { Shooter } from '../shooter/Shooter';
import type { ShooterSkin } from '../shooter/skin';
import beachBall from './assets/beach-ball.svg';
import { createSfx } from './sfx';
import './SplashAttack.css';

const SKIN: ShooterSkin = {
  id: 'splash-attack',
  title: { 'en-US': 'Splash Attack', 'pt-PT': 'Ataque de Água' },
  intro: {
    'en-US':
      "It's a water fight on the beach! Tap or click to splash the beach balls with your water pistol before they bounce away. The seagulls are sneaky, and the golden starfish is worth the most. Splash several in a row to multiply your points, but a miss breaks the streak.",
    'pt-PT':
      'É uma guerra de água na praia! Toca ou clica para molhares as bolas de praia com a tua pistola de água antes que fujam aos saltos. As gaivotas são matreiras, e a estrela-do-mar dourada vale mais. Acerta em várias seguidas para multiplicar os pontos, mas um falhanço quebra a sequência.',
  },
  kinds: {
    common: { name: { 'en-US': 'Beach ball', 'pt-PT': 'Bola de praia' }, image: beachBall },
    swift: { name: { 'en-US': 'Sneaky seagull', 'pt-PT': 'Gaivota matreira' }, image: seagull },
    golden: { name: { 'en-US': 'Golden starfish', 'pt-PT': 'Estrela-do-mar dourada' }, image: starfish },
  },
  hitNoun: { 'en-US': ['splash', 'splashes'], 'pt-PT': ['acerto', 'acertos'] },
  createSfx,
};

export function SplashAttack(props: GameProps) {
  return <Shooter {...props} skin={SKIN} />;
}
