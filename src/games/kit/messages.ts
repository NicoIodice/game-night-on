import { plural, type Localized } from '../../core/i18n/locales';

const enUS = {
  /** Follows the player's name: "Ana, your turn!". */
  yourTurn: ', your turn!',
  start: 'Start',
  back: 'Back',
  quit: 'Quit',
  pts: (score: number) => `${score} pts`,
  timesUp: "Time's up!",
  points: (n: number) => `${n} ${plural('en-US', n, 'point', 'points')}`,
};

export const MESSAGES: Localized<typeof enUS> = {
  'en-US': enUS,
  'pt-PT': {
    yourTurn: ', é a tua vez!',
    start: 'Começar',
    back: 'Voltar',
    quit: 'Sair',
    pts: (score) => `${score} pts`,
    timesUp: 'Acabou o tempo!',
    points: (n) => `${n} ${plural('pt-PT', n, 'ponto', 'pontos')}`,
  },
};
