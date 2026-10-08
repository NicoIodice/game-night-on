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
  title: 'Bat Blitz',
  intro:
    'The cave is swarming! Tap or click bats to zap them before they fly away. Hit several in a row to multiply your points, but a miss breaks the streak.',
  kinds: {
    common: { name: 'Bat', image: bat },
    swift: { name: 'Swift bat', image: swiftBat },
    golden: { name: 'Vampire bat', image: goldenBat },
  },
  hitNoun: ['bat', 'bats'],
  createSfx,
};

export function BatBlitz(props: GameProps) {
  return <Shooter {...props} skin={SKIN} />;
}
