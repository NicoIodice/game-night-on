import type { Localized } from '../core/i18n/locales';

const enUS = {
  subtitle: 'Fun little games for memorable nights',
  letsPlay: "Let's play",
  pickFestivity: 'Pick a festivity',
  comingSoon: 'Coming soon',
  tournament: (games: number) =>
    `Tournament: everyone plays ${games === 1 ? 'this game' : `these ${games} games in order`}, and the scores add up.`,
  startTournament: 'Start the tournament',
  gameNumber: (n: number) => `Game ${n}`,
  players: (min: number, max: number) => `${min}–${max} players or teams`,
  settings: 'Game night settings',
  changeFestivity: 'Change festivity',
  iconsBy: 'Icons by',
};

export const MESSAGES: Localized<typeof enUS> = {
  'en-US': enUS,
  'pt-PT': {
    subtitle: 'Jogos divertidos para noites memoráveis',
    letsPlay: 'Vamos jogar',
    pickFestivity: 'Escolhe uma festividade',
    comingSoon: 'Em breve',
    tournament: (games) =>
      `Torneio: todos jogam ${games === 1 ? 'este jogo' : `estes ${games} jogos, por ordem`}, e os pontos somam-se.`,
    startTournament: 'Começar o torneio',
    gameNumber: (n) => `Jogo ${n}`,
    players: (min, max) => `${min}–${max} jogadores ou equipas`,
    settings: 'Definições da noite de jogos',
    changeFestivity: 'Mudar de festividade',
    iconsBy: 'Ícones de',
  },
};
