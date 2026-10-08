import { plural, type Localized } from '../../core/i18n/locales';

const enUS = {
  watch: 'Watch…',
  watchAgain: 'Watch again…',
  yourTurn: 'Your turn!',
  wellDone: 'Well done!',
  oops: 'Oops! Watch again…',
  hint: (pads: number, lives: number) =>
    `${pads} pads · ${lives} ${plural('en-US', lives, 'life', 'lives')} · keys 1–${pads} work too`,
  steps: (n: number) => `${n} steps`,
  lives: (n: number) => `${n} ${plural('en-US', n, 'life', 'lives')}`,
  pad: (name: string, key: number) => `${name} (key ${key})`,
  allInARow: (n: number) => `All ${n} in a row!`,
  detail: (longest: number, slips: number) => `Longest sequence ${longest} · ${slips} ${plural('en-US', slips, 'slip', 'slips')}`,
};

export const MESSAGES: Localized<typeof enUS> = {
  'en-US': enUS,
  'pt-PT': {
    watch: 'Observa…',
    watchAgain: 'Observa outra vez…',
    yourTurn: 'É a tua vez!',
    wellDone: 'Muito bem!',
    oops: 'Ups! Observa outra vez…',
    hint: (pads, lives) =>
      `${pads} botões · ${lives} ${plural('pt-PT', lives, 'vida', 'vidas')} · as teclas 1–${pads} também funcionam`,
    steps: (n) => `${n} passos`,
    lives: (n) => `${n} ${plural('pt-PT', n, 'vida', 'vidas')}`,
    pad: (name, key) => `${name} (tecla ${key})`,
    allInARow: (n) => `Todos os ${n} seguidos!`,
    detail: (longest, slips) =>
      `Sequência mais longa ${longest} · ${slips} ${plural('pt-PT', slips, 'deslize', 'deslizes')}`,
  },
};
