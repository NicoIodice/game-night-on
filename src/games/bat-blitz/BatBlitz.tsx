import type { GameProps } from '../../core/types';
import { Shooter } from '../shooter/Shooter';
import type { ShooterSkin } from '../shooter/skin';
import bat from '../../themes/halloween/assets/bat.svg';
import goldenBat from './assets/golden-bat.svg';
import swiftBat from './assets/swift-bat.svg';
import { createSfx } from './sfx';
import './BatBlitz.css';

const SKIN: ShooterSkin = {
  id: 'bat-blitz',
  title: { 'en-US': 'Bat Blitz', 'pt-PT': 'Ataque de Morcegos' },
  intro: {
    'en-US':
      'The cave is swarming! Tap or click bats to zap them before they fly away. Hit several in a row to multiply your points, but a miss breaks the streak.',
    'pt-PT':
      'A gruta está cheia de morcegos! Toca ou clica neles para os apanhar antes que fujam. Acerta em vários seguidos para multiplicar os pontos, mas um falhanço quebra a sequência.',
  },
  kinds: {
    common: { name: { 'en-US': 'Bat', 'pt-PT': 'Morcego' }, image: bat },
    swift: { name: { 'en-US': 'Swift bat', 'pt-PT': 'Morcego veloz' }, image: swiftBat },
    golden: { name: { 'en-US': 'Vampire bat', 'pt-PT': 'Morcego-vampiro' }, image: goldenBat },
  },
  hitNoun: { 'en-US': ['bat', 'bats'], 'pt-PT': ['morcego', 'morcegos'] },
  createSfx,
};

export function BatBlitz(props: GameProps) {
  return <Shooter {...props} skin={SKIN} />;
}
