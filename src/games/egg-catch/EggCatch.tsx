import type { GameProps } from '../../core/types';
import bunny from '../../themes/easter/assets/bunny.svg';
import egg from '../../themes/easter/assets/egg.svg';
import { Shooter } from '../shooter/Shooter';
import type { ShooterSkin } from '../shooter/skin';
import { createSfx } from './sfx';
import './EggCatch.css';

const SKIN: ShooterSkin = {
  id: 'egg-catch',
  title: { 'en-US': 'Egg Catch', 'pt-PT': 'Apanha-Ovos' },
  intro: {
    'en-US':
      "The Easter eggs are bouncing all over the meadow! Tap or click to catch them before they roll away, and grab the chocolate bunnies and the golden egg for extra points. Catch several in a row to multiply your points, but a miss breaks the streak.",
    'pt-PT':
      'Os ovos da Páscoa andam aos saltos pelo prado! Toca ou clica para os apanhares antes que fujam a rebolar, e apanha os coelhos de chocolate e o ovo dourado para ganhares pontos extra. Apanha vários seguidos para multiplicar os pontos, mas um falhanço quebra a sequência.',
  },
  kinds: {
    common: { name: { 'en-US': 'Painted egg', 'pt-PT': 'Ovo pintado' }, image: egg },
    swift: { name: { 'en-US': 'Chocolate bunny', 'pt-PT': 'Coelho de chocolate' }, image: bunny },
    golden: { name: { 'en-US': 'Golden egg', 'pt-PT': 'Ovo dourado' }, image: egg },
  },
  hitNoun: { 'en-US': ['catch', 'catches'], 'pt-PT': ['ovo apanhado', 'ovos apanhados'] },
  createSfx,
};

export function EggCatch(props: GameProps) {
  return <Shooter {...props} skin={SKIN} />;
}
