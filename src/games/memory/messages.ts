import type { Localized } from '../../core/i18n/locales';

const enUS = {
  hint: (level: number, pairs: number, seconds: number) =>
    `Level ${level} · ${pairs} pairs · ${seconds} seconds · pairs in a row earn a bonus`,
  inARow: (n: number) => `${n} in a row`,
  faceDown: (card: number) => `Card ${card}, face down`,
  allFound: 'All pairs found!',
  pairs: (found: number, pairs: number) => `${found} of ${pairs} pairs`,
  flips: (n: number) => `${n} flips`,
  spare: (seconds: number) => `${seconds}s to spare`,
  bestStreak: (n: number) => `best streak ${n}`,
};

export const MESSAGES: Localized<typeof enUS> = {
  'en-US': enUS,
  'pt-PT': {
    hint: (level, pairs, seconds) => `Nível ${level} · ${pairs} pares · ${seconds} segundos · pares seguidos dão bónus`,
    inARow: (n) => `${n} seguidos`,
    faceDown: (card) => `Carta ${card}, virada para baixo`,
    allFound: 'Todos os pares encontrados!',
    pairs: (found, pairs) => `${found} de ${pairs} pares`,
    flips: (n) => `${n} ${n === 1 ? 'carta virada' : 'cartas viradas'}`,
    spare: (seconds) => `sobraram ${seconds} s`,
    bestStreak: (n) => `melhor sequência ${n}`,
  },
};
