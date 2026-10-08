import type { GameProps } from '../../core/types';
import balloon from '../../themes/birthday/assets/balloon.svg';
import { Shooter } from '../shooter/Shooter';
import type { ShooterSkin } from '../shooter/skin';
import balloonDog from './assets/balloon-dog.svg';
import { createSfx } from './sfx';
import './BalloonPop.css';

const SKIN: ShooterSkin = {
  id: 'balloon-pop',
  title: { 'en-US': 'Balloon Pop', 'pt-PT': 'Rebenta Balões' },
  intro: {
    'en-US':
      "The party balloons have come loose and are floating away! Tap or click to pop them before they're gone, and don't miss the golden birthday balloon. Pop several in a row to multiply your points, but a miss breaks the streak.",
    'pt-PT':
      'Os balões da festa soltaram-se e estão a voar! Toca ou clica para os rebentares antes que desapareçam, e não deixes escapar o balão dourado dos anos. Rebenta vários seguidos para multiplicar os pontos, mas um falhanço quebra a sequência.',
  },
  kinds: {
    common: { name: { 'en-US': 'Balloon', 'pt-PT': 'Balão' }, image: balloon },
    swift: { name: { 'en-US': 'Balloon dog', 'pt-PT': 'Cão de balão' }, image: balloonDog },
    golden: { name: { 'en-US': 'Birthday balloon', 'pt-PT': 'Balão dos anos' }, image: balloon },
  },
  hitNoun: { 'en-US': ['balloon', 'balloons'], 'pt-PT': ['balão', 'balões'] },
  createSfx,
};

export function BalloonPop(props: GameProps) {
  return <Shooter {...props} skin={SKIN} />;
}
