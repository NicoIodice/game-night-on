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
  title: { 'en-US': 'Snowball Showdown', 'pt-PT': 'Guerra de Bolas de Neve' },
  intro: {
    'en-US':
      "Naughty imps have raided Santa's workshop! Tap or click to pelt them with snowballs before they fly off, and knock the stolen presents out of the sky. Hit several in a row to multiply your points, but a miss breaks the streak.",
    'pt-PT':
      'Uns diabretes marotos assaltaram a oficina do Pai Natal! Toca ou clica para os atingires com bolas de neve antes que fujam, e deita abaixo os presentes roubados. Acerta em vários seguidos para multiplicar os pontos, mas um falhanço quebra a sequência.',
  },
  kinds: {
    common: { name: { 'en-US': 'Imp', 'pt-PT': 'Diabrete' }, image: imp },
    swift: { name: { 'en-US': 'Speedy imp', 'pt-PT': 'Diabrete veloz' }, image: speedyImp },
    golden: { name: { 'en-US': 'Stolen present', 'pt-PT': 'Presente roubado' }, image: stolenPresent },
  },
  hitNoun: { 'en-US': ['hit', 'hits'], 'pt-PT': ['acerto', 'acertos'] },
  createSfx,
};

export function SnowballShowdown(props: GameProps) {
  return <Shooter {...props} skin={SKIN} />;
}
