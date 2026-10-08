import type { GameProps } from '../../core/types';
import feather from '../../themes/carnival/assets/feather.svg';
import mask from '../../themes/carnival/assets/mask.svg';
import parrot from '../../themes/carnival/assets/parrot.svg';
import { Shooter } from '../shooter/Shooter';
import type { ShooterSkin } from '../shooter/skin';
import { createSfx } from './sfx';
import './FeatherCatch.css';

const SKIN: ShooterSkin = {
  id: 'feather-catch',
  title: { 'en-US': 'Feather Catch', 'pt-PT': 'Apanha as Penas' },
  intro: {
    'en-US':
      "The parade is passing and feathers are flying everywhere! Tap or click to catch them before they float away. The parrots are quick, and the golden mask is the parade's top prize. Catch several in a row to multiply your points, but a miss breaks the streak.",
    'pt-PT':
      'O desfile está a passar e há penas a voar por todo o lado! Toca ou clica para as apanhares antes que voem para longe. Os papagaios são rápidos, e a máscara dourada é o grande prémio do desfile. Apanha várias seguidas para multiplicar os pontos, mas um falhanço quebra a sequência.',
  },
  kinds: {
    common: { name: { 'en-US': 'Feather', 'pt-PT': 'Pena' }, image: feather },
    swift: { name: { 'en-US': 'Parrot', 'pt-PT': 'Papagaio' }, image: parrot },
    golden: { name: { 'en-US': 'Golden mask', 'pt-PT': 'Máscara dourada' }, image: mask },
  },
  hitNoun: { 'en-US': ['catch', 'catches'], 'pt-PT': ['pena apanhada', 'penas apanhadas'] },
  createSfx,
};

export function FeatherCatch(props: GameProps) {
  return <Shooter {...props} skin={SKIN} />;
}
