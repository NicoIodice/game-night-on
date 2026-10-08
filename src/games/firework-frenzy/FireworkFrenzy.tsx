import type { GameProps } from '../../core/types';
import rocket from '../../themes/newyear/assets/rocket.svg';
import { Shooter } from '../shooter/Shooter';
import type { ShooterSkin } from '../shooter/skin';
import firework from './assets/firework.svg';
import shootingStar from './assets/shooting-star.svg';
import { createSfx } from './sfx';
import './FireworkFrenzy.css';

const SKIN: ShooterSkin = {
  id: 'firework-frenzy',
  title: { 'en-US': 'Firework Frenzy', 'pt-PT': 'Fogo de Artifício' },
  intro: {
    'en-US':
      "It's almost midnight and the sky is full of fireworks! Tap or click to burst them before they fade away. Rockets zoom by fast, and a shooting star brings luck for the new year. Hit several in a row to multiply your points, but a miss breaks the streak.",
    'pt-PT':
      'Está quase a dar a meia-noite e o céu está cheio de fogo de artifício! Toca ou clica para os rebentares antes que se apaguem. Os foguetes passam a correr, e uma estrela cadente dá sorte para o ano novo. Acerta em vários seguidos para multiplicar os pontos, mas um falhanço quebra a sequência.',
  },
  kinds: {
    common: { name: { 'en-US': 'Firework', 'pt-PT': 'Fogo de artifício' }, image: firework },
    swift: { name: { 'en-US': 'Rocket', 'pt-PT': 'Foguete' }, image: rocket },
    golden: { name: { 'en-US': 'Shooting star', 'pt-PT': 'Estrela cadente' }, image: shootingStar },
  },
  hitNoun: { 'en-US': ['firework', 'fireworks'], 'pt-PT': ['foguete', 'foguetes'] },
  createSfx,
};

export function FireworkFrenzy(props: GameProps) {
  return <Shooter {...props} skin={SKIN} />;
}
