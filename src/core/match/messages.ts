import { plural, type Localized } from '../i18n/locales';
import type { RosterKind } from '../types';

const enUS = {
  // Player setup
  players: 'Players',
  teams: 'Teams',
  playAs: 'Play as',
  count: (kind: RosterKind, n: number) =>
    kind === 'teams' ? plural('en-US', n, 'team', 'teams') : plural('en-US', n, 'player', 'players'),
  oneLess: (kind: RosterKind) => `One ${kind === 'teams' ? 'team' : 'player'} less`,
  oneMore: (kind: RosterKind) => `One more ${kind === 'teams' ? 'team' : 'player'}`,
  nameOf: (kind: RosterKind, seat: number) => `Name of ${kind === 'teams' ? 'team' : 'player'} ${seat}`,
  solo: 'Solo game.',
  howTurnsGo: (kind: RosterKind) =>
    `Each ${kind === 'teams' ? 'team' : 'player'} plays a turn, then passes the device on. Highest score wins!`,
  start: 'Start',
  back: 'Back',

  // Between turns and results
  tournament: 'Tournament',
  levelOf: (level: number, levels: number) => `Level ${level} of ${levels}`,
  points: (n: number) => `${n} ${plural('en-US', n, 'point', 'points')}`,
  scoresSoFar: 'Scores so far',
  upNext: (level: number, levels: number) => `Up next: level ${level} of ${levels}. `,
  passDevice: (kind: RosterKind) => `Pass the device to the next ${kind === 'teams' ? 'team' : 'player'}.`,
  youreUp: (name: string) => `${name}, you're up!`,
  playLevel: (level: number) => `Play level ${level}`,
  gameOf: (game: number, games: number, name: string) => `Game ${game} of ${games} · ${name}`,
  tournamentSoFar: 'Tournament so far',
  tournamentScoresSoFar: 'Tournament scores so far',
  nextGame: (name: string) => `Next game: ${name}`,
  finalStandings: 'Final standings',
  retryGame: 'Retry this game',
  playAgain: 'Play again',
  change: (kind: RosterKind) => `Change ${kind === 'teams' ? 'teams' : 'players'}`,
  quitTournament: 'Quit tournament',
  backToMenu: 'Back to menu',
  retryReplaces: "A retry replaces this game's scores.",
  tournamentGames: (n: number) => `Tournament · ${n} ${plural('en-US', n, 'game', 'games')}`,
  playTournamentAgain: 'Play the tournament again',
  wellPlayed: 'Well played!',
  tie: "It's a tie!",
  wins: (name: string, night: boolean) => `${name} wins${night ? ' the night' : ''}!`,

  // Standings
  podium: 'Podium',
  winner: 'Winner',
  place: 'Place',
  name: 'Name',
  score: 'Score',
  placeName: (place: number) => ['1st', '2nd', '3rd'][place - 1] ?? `${place}th`,

  // Game night settings
  settings: 'Game night settings',
  scoring: 'Scoring',
  single: 'One game at a time',
  singleHint: 'Pick any game from the menu. Each game has its own scoreboard.',
  tournamentHint:
    'Everyone plays every game below, in order. Each game has its scoreboard, and the scores add up to a final winner.',
  gamesInOrder: 'Games, in order',
  moveUp: (name: string) => `Move ${name} up`,
  moveDown: (name: string) => `Move ${name} down`,
  untickedHint: 'Unticked games are hidden from the menu and skipped by the tournament.',
  less: (option: string) => `Fewer ${option.toLowerCase()}`,
  more: (option: string) => `More ${option.toLowerCase()}`,
  done: 'Done',
  resetGames: 'Reset games',
};

export const MESSAGES: Localized<typeof enUS> = {
  'en-US': enUS,
  'pt-PT': {
    players: 'Jogadores',
    teams: 'Equipas',
    playAs: 'Jogar como',
    count: (kind, n) =>
      kind === 'teams' ? plural('pt-PT', n, 'equipa', 'equipas') : plural('pt-PT', n, 'jogador', 'jogadores'),
    oneLess: (kind) => (kind === 'teams' ? 'Menos uma equipa' : 'Menos um jogador'),
    oneMore: (kind) => (kind === 'teams' ? 'Mais uma equipa' : 'Mais um jogador'),
    nameOf: (kind, seat) => (kind === 'teams' ? `Nome da equipa ${seat}` : `Nome do jogador ${seat}`),
    solo: 'Jogo a solo.',
    howTurnsGo: (kind) =>
      kind === 'teams'
        ? 'Cada equipa joga uma vez e passa o dispositivo à seguinte. Ganha quem fizer mais pontos!'
        : 'Cada jogador joga uma vez e passa o dispositivo ao seguinte. Ganha quem fizer mais pontos!',
    start: 'Começar',
    back: 'Voltar',

    tournament: 'Torneio',
    levelOf: (level, levels) => `Nível ${level} de ${levels}`,
    points: (n) => `${n} ${plural('pt-PT', n, 'ponto', 'pontos')}`,
    scoresSoFar: 'Pontuações até agora',
    upNext: (level, levels) => `A seguir: nível ${level} de ${levels}. `,
    passDevice: (kind) =>
      kind === 'teams' ? 'Passa o dispositivo à próxima equipa.' : 'Passa o dispositivo ao próximo jogador.',
    youreUp: (name) => `${name}, é a tua vez!`,
    playLevel: (level) => `Jogar o nível ${level}`,
    gameOf: (game, games, name) => `Jogo ${game} de ${games} · ${name}`,
    tournamentSoFar: 'O torneio até agora',
    tournamentScoresSoFar: 'Pontuações do torneio até agora',
    nextGame: (name) => `Próximo jogo: ${name}`,
    finalStandings: 'Classificação final',
    retryGame: 'Repetir este jogo',
    playAgain: 'Jogar outra vez',
    change: (kind) => (kind === 'teams' ? 'Mudar equipas' : 'Mudar jogadores'),
    quitTournament: 'Sair do torneio',
    backToMenu: 'Voltar ao menu',
    retryReplaces: 'Repetir o jogo substitui os pontos que fizeram nele.',
    tournamentGames: (n) => `Torneio · ${n} ${plural('pt-PT', n, 'jogo', 'jogos')}`,
    playTournamentAgain: 'Jogar o torneio outra vez',
    wellPlayed: 'Bem jogado!',
    tie: 'Empate!',
    wins: (name, night) => `${night ? `${name} ganha a noite` : `${name} ganha`}!`,

    podium: 'Pódio',
    winner: 'Vencedor',
    place: 'Lugar',
    name: 'Nome',
    score: 'Pontos',
    placeName: (place) => `${place}.º`,

    settings: 'Definições da noite de jogos',
    scoring: 'Pontuação',
    single: 'Um jogo de cada vez',
    singleHint: 'Escolhe qualquer jogo do menu. Cada jogo tem o seu próprio marcador.',
    tournamentHint:
      'Todos jogam todos os jogos abaixo, por ordem. Cada jogo tem o seu marcador, e os pontos somam-se até haver um vencedor final.',
    gamesInOrder: 'Jogos, por ordem',
    moveUp: (name) => `Subir ${name}`,
    moveDown: (name) => `Descer ${name}`,
    untickedHint: 'Os jogos desmarcados ficam escondidos do menu e o torneio salta-os.',
    less: (option) => `Diminuir: ${option}`,
    more: (option) => `Aumentar: ${option}`,
    done: 'Concluído',
    resetGames: 'Repor os jogos',
  },
};
