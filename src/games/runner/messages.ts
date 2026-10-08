import { formatNumber, plural, type Localized } from '../../core/i18n/locales';

const enUS = {
  hint: (seconds: number, lives: number) => `${seconds} seconds · ${lives} lives · tap, click, Space or ↑ to jump`,
  you: 'You',
  jump: 'jump!',
  lives: (n: number) => `${n} ${plural('en-US', n, 'life', 'lives')}`,
  outOfLives: 'Out of lives!',
  distance: (screens: number) => `${formatNumber('en-US', screens, 1)} screens run`,
  bumps: (n: number) => `${n} ${plural('en-US', n, 'bump', 'bumps')}`,
};

export const MESSAGES: Localized<typeof enUS> = {
  'en-US': enUS,
  'pt-PT': {
    hint: (seconds, lives) => `${seconds} segundos · ${lives} vidas · toca, clica, Espaço ou ↑ para saltar`,
    you: 'Tu',
    jump: 'salta!',
    lives: (n) => `${n} ${plural('pt-PT', n, 'vida', 'vidas')}`,
    outOfLives: 'Sem vidas!',
    distance: (screens) => `${formatNumber('pt-PT', screens, 1)} ecrãs percorridos`,
    bumps: (n) => `${n} ${plural('pt-PT', n, 'choque', 'choques')}`,
  },
};
