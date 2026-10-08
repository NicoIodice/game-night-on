import type { GameProps } from '../../core/types';
import alien from '../../themes/space/assets/alien.svg';
import asteroid from '../../themes/space/assets/asteroid.svg';
import ufo from '../../themes/space/assets/ufo.svg';
import { Shooter } from '../shooter/Shooter';
import type { ShooterSkin } from '../shooter/skin';
import { createSfx } from './sfx';
import './AlienZapper.css';

const SKIN: ShooterSkin = {
  id: 'alien-zapper',
  title: { 'en-US': 'Alien Zapper', 'pt-PT': 'Caça-Alienígenas' },
  intro: {
    'en-US':
      "Cheeky aliens are floating around the space station! Tap or click to zap them before they warp away. Asteroids whizz past fast, and the mothership UFO is worth the most. Zap several in a row to multiply your points, but a miss breaks the streak.",
    'pt-PT':
      'Uns extraterrestres atrevidos andam a flutuar à volta da estação espacial! Toca ou clica para os atingires antes que desapareçam. Os asteroides passam a correr, e o disco voador vale mais. Acerta em vários seguidos para multiplicar os pontos, mas um falhanço quebra a sequência.',
  },
  kinds: {
    common: { name: { 'en-US': 'Alien', 'pt-PT': 'Extraterrestre' }, image: alien },
    swift: { name: { 'en-US': 'Asteroid', 'pt-PT': 'Asteroide' }, image: asteroid },
    golden: { name: { 'en-US': 'Mothership', 'pt-PT': 'Disco voador' }, image: ufo },
  },
  hitNoun: { 'en-US': ['zap', 'zaps'], 'pt-PT': ['acerto', 'acertos'] },
  createSfx,
};

export function AlienZapper(props: GameProps) {
  return <Shooter {...props} skin={SKIN} />;
}
