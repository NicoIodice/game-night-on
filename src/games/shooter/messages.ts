import type { Localized } from '../../core/i18n/locales';

const enUS = {
  hint: (seconds: number) => `${seconds} seconds · streak of 5 = double points`,
  /** The turn summary; `hits` is already "12 bats". */
  detail: (hits: string, accuracy: number, bestStreak: number) =>
    `${hits} · ${accuracy}% accuracy · best streak ${bestStreak}`,
};

export const MESSAGES: Localized<typeof enUS> = {
  'en-US': enUS,
  'pt-PT': {
    hint: (seconds) => `${seconds} segundos · 5 seguidos = pontos a dobrar`,
    detail: (hits, accuracy, bestStreak) => `${hits} · ${accuracy}% de pontaria · melhor sequência ${bestStreak}`,
  },
};
