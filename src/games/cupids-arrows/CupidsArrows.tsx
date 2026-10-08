import type { GameProps } from '../../core/types';
import heart from '../../themes/valentine/assets/heart.svg';
import wingedHeart from '../../themes/valentine/assets/winged-heart.svg';
import { Shooter } from '../shooter/Shooter';
import type { ShooterSkin } from '../shooter/skin';
import goldenHeart from './assets/golden-heart.svg';
import { createSfx } from './sfx';
import './CupidsArrows.css';

const SKIN: ShooterSkin = {
  id: 'cupids-arrows',
  title: { 'en-US': "Cupid's Arrows", 'pt-PT': 'Setas do Cupido' },
  intro: {
    'en-US':
      "Cupid has handed you the bow! Tap or click to shoot an arrow at the hearts floating by before they drift away. Winged hearts are quick, and the crowned heart is the true love. Hit several in a row to multiply your points, but a miss breaks the streak.",
    'pt-PT':
      'O Cupido passou-te o arco! Toca ou clica para disparares uma seta aos corações que passam antes que se afastem. Os corações com asas são rápidos, e o coração com coroa é o verdadeiro amor. Acerta em vários seguidos para multiplicar os pontos, mas um falhanço quebra a sequência.',
  },
  kinds: {
    common: { name: { 'en-US': 'Heart', 'pt-PT': 'Coração' }, image: heart },
    swift: { name: { 'en-US': 'Winged heart', 'pt-PT': 'Coração com asas' }, image: wingedHeart },
    golden: { name: { 'en-US': 'True love', 'pt-PT': 'Amor verdadeiro' }, image: goldenHeart },
  },
  hitNoun: { 'en-US': ['heart', 'hearts'], 'pt-PT': ['coração', 'corações'] },
  createSfx,
};

export function CupidsArrows(props: GameProps) {
  return <Shooter {...props} skin={SKIN} />;
}
