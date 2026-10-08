import type { GameProps } from '../../core/types';
import { Shooter } from '../shooter/Shooter';
import type { ShooterSkin } from '../shooter/skin';
import imp from './assets/imp.svg';
import speedyImp from './assets/speedy-imp.svg';
import stolenPresent from './assets/stolen-present.svg';
import { createSfx } from './sfx';
import './SnowballShowdown.css';

const SKIN: ShooterSkin = {
  id: 'snowball-showdown',
  title: 'Snowball Showdown',
  intro:
    "Naughty imps have raided Santa's workshop! Tap or click to pelt them with snowballs before they fly off, and knock the stolen presents out of the sky. Hit several in a row to multiply your points, but a miss breaks the streak.",
  kinds: {
    common: { name: 'Imp', image: imp },
    swift: { name: 'Speedy imp', image: speedyImp },
    golden: { name: 'Stolen present', image: stolenPresent },
  },
  hitNoun: ['hit', 'hits'],
  createSfx,
};

export function SnowballShowdown(props: GameProps) {
  return <Shooter {...props} skin={SKIN} />;
}
