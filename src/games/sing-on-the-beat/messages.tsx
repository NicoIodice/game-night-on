import type { ReactNode } from 'react';
import { formatNumber, plural, type Localized } from '../../core/i18n/locales';
import type { ListenResult } from '../../core/voice/SpeechListener';

export interface Messages {
  voiceOff: Record<Exclude<ListenResult, 'listening'>, string>;
  getReady: string;
  sayIt: string;
  nice: string;
  listening: string;
  perfectStreak: (streak: number, points: number) => string;
  perfect: (points: number) => string;
  noPoints: string;
  plusPoints: (points: number) => string;
  detail: (level: number, right: number, cards: number) => string;

  starting: string;
  allowMic: string;
  rules: ReactNode;
  hint: (level: number, levels: number, rounds: number, cards: number, bpm: number) => string;
  usesMic: string;
  start: string;
  back: string;
  listeningIn: (language: string, relaxed: boolean) => string;
  voiceCheck: string;

  level: (level: number) => string;
  round: (round: number, rounds: number) => string;
  mic: string;
  quit: string;
  nothingHeard: string;
  waiting: string;

  // Voice settings, in the game night settings
  cantListen: string;
  accent: string;
  scoring: string;
  strict: string;
  relaxed: string;
  checkedOn: (date: string) => string;
  delay: (ms: number) => string;
  notTimed: string;
  learned: (n: number) => string;
  noCheckYet: string;
  runAgain: string;
  runNow: string;
  forget: string;
}

export const MESSAGES: Localized<Messages> = {
  'en-US': {
    voiceOff: {
      unsupported: "This browser can't listen. Use Chrome or Edge to get scored.",
      denied: 'Microphone access was blocked, so this game is not scored.',
      failed: "Couldn't start listening, so this game is not scored.",
    },
    getReady: 'Get ready!',
    sayIt: 'Say it!',
    nice: 'Nice!',
    listening: 'Listening…',
    perfectStreak: (streak, points) => `Perfect ×${streak}! +${points}`,
    perfect: (points) => `Perfect! +${points}`,
    noPoints: 'No points!',
    plusPoints: (points) => `+${points} points`,
    detail: (level, right, cards) => `Level ${level}: ${right} of ${cards} cards right`,

    starting: 'Get ready…',
    allowMic: 'If your browser asks, allow the microphone so we can hear your answers.',
    rules: (
      <>
        After the countdown all the cards appear. Say each word out loud <strong>on the beat</strong> as it lights up.
        Right word: points and a green card. Wrong or silent: red card, no points. Get a whole round right for a bonus
        that grows with every perfect round in a row.
      </>
    ),
    hint: (level, levels, rounds, cards, bpm) =>
      `Level ${level} of ${levels} · ${rounds} ${plural('en-US', rounds, 'round', 'rounds')} · ${cards} cards · ${bpm} BPM`,
    usesMic: 'uses your microphone',
    start: 'Start',
    back: 'Back',
    listeningIn: (language, relaxed) => `Listening in ${language} · ${relaxed ? 'relaxed' : 'strict'} scoring`,
    voiceCheck: 'Voice check',

    level: (level) => `Level ${level}`,
    round: (round, rounds) => `Round ${round}/${rounds}`,
    mic: 'Listening',
    quit: 'Quit',
    nothingHeard: 'Nothing heard',
    waiting: 'Waiting for your voice…',

    cantListen: "This browser can't listen, so there's no voice check. Use Chrome or Edge.",
    accent: 'Accent',
    scoring: 'Scoring',
    strict: 'Strict',
    relaxed: 'Relaxed',
    checkedOn: (date) => `Voice check done ${date}`,
    delay: (ms) => `words arrive ${formatNumber('en-US', ms / 1000, 2)}s late`,
    notTimed: 'timing not measured',
    learned: (n) => `${n} learned ${plural('en-US', n, 'word', 'words')}`,
    noCheckYet: 'No voice check yet: it runs before the first game.',
    runAgain: 'Run the voice check again',
    runNow: 'Run the voice check now',
    forget: 'Forget it',
  },
  'pt-PT': {
    voiceOff: {
      unsupported: 'Este navegador não consegue ouvir. Usa o Chrome ou o Edge para teres pontuação.',
      denied: 'O acesso ao microfone foi bloqueado, por isso este jogo não tem pontuação.',
      failed: 'Não foi possível começar a ouvir, por isso este jogo não tem pontuação.',
    },
    getReady: 'Prepara-te!',
    sayIt: 'Diz!',
    nice: 'Boa!',
    listening: 'A ouvir…',
    perfectStreak: (streak, points) => `Perfeito ×${streak}! +${points}`,
    perfect: (points) => `Perfeito! +${points}`,
    noPoints: 'Zero pontos!',
    plusPoints: (points) => `+${points} pontos`,
    detail: (level, right, cards) => `Nível ${level}: ${right} de ${cards} cartas certas`,

    starting: 'Prepara-te…',
    allowMic: 'Se o navegador pedir, autoriza o microfone para podermos ouvir as tuas respostas.',
    rules: (
      <>
        Depois da contagem aparecem todas as cartas. Diz cada palavra em voz alta <strong>ao ritmo</strong>, quando a carta
        se acender. Palavra certa: pontos e carta verde. Errada ou em silêncio: carta vermelha, sem pontos. Acerta numa
        ronda inteira para ganhares um bónus que cresce a cada ronda perfeita seguida.
      </>
    ),
    hint: (level, levels, rounds, cards, bpm) =>
      `Nível ${level} de ${levels} · ${rounds} ${plural('pt-PT', rounds, 'ronda', 'rondas')} · ${cards} cartas · ${bpm} BPM`,
    usesMic: 'usa o microfone',
    start: 'Começar',
    back: 'Voltar',
    listeningIn: (language, relaxed) => `A ouvir em ${language} · modo ${relaxed ? 'descontraído' : 'rigoroso'}`,
    voiceCheck: 'Teste de voz',

    level: (level) => `Nível ${level}`,
    round: (round, rounds) => `Ronda ${round}/${rounds}`,
    mic: 'A ouvir',
    quit: 'Sair',
    nothingHeard: 'Não ouvimos nada',
    waiting: 'À espera da tua voz…',

    cantListen: 'Este navegador não consegue ouvir, por isso não há teste de voz. Usa o Chrome ou o Edge.',
    accent: 'Sotaque',
    scoring: 'Modo',
    strict: 'Rigoroso',
    relaxed: 'Descontraído',
    checkedOn: (date) => `Teste de voz feito a ${date}`,
    delay: (ms) => `as palavras chegam com ${formatNumber('pt-PT', ms / 1000, 2)} s de atraso`,
    notTimed: 'tempo de resposta não medido',
    learned: (n) => `${n} ${plural('pt-PT', n, 'palavra aprendida', 'palavras aprendidas')}`,
    noCheckYet: 'Ainda não há teste de voz: é feito antes do primeiro jogo.',
    runAgain: 'Repetir o teste de voz',
    runNow: 'Fazer o teste de voz agora',
    forget: 'Esquecer',
  },
};
