import type { ReactNode } from 'react';
import { formatNumber, type Localized } from '../i18n/locales';
import type { Strictness } from './calibration';

interface Messages {
  strictness: Record<Strictness, { label: string; text: string }>;
  strictnessLabel: string;
  skipAll: string;
  skipRest: string;
  start: string;
  cancel: string;
  ok: string;
  tryAgain: string;

  checkTitle: string;
  checkIntro: string;
  accent: string;
  accentHint: string;
  newWordsTitle: string;
  newWordsIntro: (theme: string) => string;

  listening: string;
  allowMic: string;
  noMicTitle: string;
  noMicText: string;

  timingTitle: string;
  timingIntro: (word: string) => ReactNode;
  ready: string;
  skipTiming: string;
  getReady: string;
  sayIt: (beat: number, beats: number) => string;
  done: string;
  measured: (ms: number) => ReactNode;
  notMeasured: string;
  nextWords: string;

  wordsTitle: string;
  newWords: string;
  cardOf: (card: number, cards: number) => string;
  say: (word: string) => ReactNode;
  gotIt: string;
  heardNothing: string;
  heardOther: (word: string, other: string) => ReactNode;
  heardAsk: (word: string, card: string) => ReactNode;
  countIt: string;
  skipCard: string;

  strictTitle: string;
  allSet: string;
}

export const MESSAGES: Localized<Messages> = {
  'en-US': {
    strictness: {
      strict: { label: 'Strict', text: 'Only the exact words count. Best for a real challenge.' },
      relaxed: {
        label: 'Relaxed',
        text: 'Words that sound close count too, and slow words get a little more time. Best for kids and noisy rooms.',
      },
    },
    strictnessLabel: 'Strictness',
    skipAll: 'Skip, use the usual settings',
    skipRest: 'Skip the rest',
    start: 'Start',
    cancel: 'Cancel',
    ok: 'OK',
    tryAgain: 'Try again',

    checkTitle: 'Voice check',
    checkIntro:
      "A quick check so Sing on the Beat hears you better on this device. You'll say one word on a beat, then each card once. It takes about two minutes and only happens once.",
    accent: 'Accent',
    accentHint: 'Pick the English closest to how you speak. You can change it later in the game night settings.',
    newWordsTitle: 'New words!',
    newWordsIntro: (theme) =>
      `Before your first ${theme} round, say each card once so the game learns how it sounds in your voice. It takes about a minute.`,

    listening: 'Listening…',
    allowMic: 'If your browser asks, allow the microphone.',
    noMicTitle: 'No microphone',
    noMicText:
      "We couldn't listen, so the check can't run. The game will use the usual settings. You can run the check again from the game night settings.",

    timingTitle: '1. Timing',
    timingIntro: (word) => (
      <>
        After four beeps, say <strong>“{word}”</strong> on every beat, eight times, right when the card flashes. This
        measures how quickly this device understands you.
      </>
    ),
    ready: 'Ready',
    skipTiming: 'Skip timing',
    getReady: 'Get ready…',
    sayIt: (beat, beats) => `Say it! ${beat} / ${beats}`,
    done: 'Done!',
    measured: (ms) => (
      <>
        This device understands words about <strong>{formatNumber('en-US', ms / 1000, 2)} seconds</strong> after you say
        them. The game will allow for that.
      </>
    ),
    notMeasured: "We didn't hear enough words to measure. Try again a little louder, or skip and use the usual timing.",
    nextWords: 'Next: the words',

    wordsTitle: '2. Words',
    newWords: 'New words',
    cardOf: (card, cards) => `Card ${card} of ${cards}`,
    say: (word) => (
      <>
        Say <strong>“{word}”</strong>
      </>
    ),
    gotIt: 'Got it!',
    heardNothing: "We didn't hear anything.",
    heardOther: (word, other) => (
      <>
        We heard <strong>“{word}”</strong>, which is another card ({other}).
      </>
    ),
    heardAsk: (word, card) => (
      <>
        We heard <strong>“{word}”</strong>. Count it as {card} on this device?
      </>
    ),
    countIt: 'Yes, count it',
    skipCard: 'Skip this card',

    strictTitle: '3. How strict?',
    allSet: 'All set!',
  },
  'pt-PT': {
    strictness: {
      strict: { label: 'Rigoroso', text: 'Só contam as palavras exatas. Ideal para um verdadeiro desafio.' },
      relaxed: {
        label: 'Descontraído',
        text: 'Palavras parecidas também contam, e as palavras lentas têm um pouco mais de tempo. Ideal para crianças e salas barulhentas.',
      },
    },
    strictnessLabel: 'Rigor',
    skipAll: 'Saltar e usar as definições habituais',
    skipRest: 'Saltar o resto',
    start: 'Começar',
    cancel: 'Cancelar',
    ok: 'OK',
    tryAgain: 'Tentar outra vez',

    checkTitle: 'Teste de voz',
    checkIntro:
      'Um teste rápido para o Diz no Ritmo te ouvir melhor neste dispositivo. Vais dizer uma palavra ao ritmo e depois cada carta uma vez. Demora cerca de dois minutos e só acontece uma vez.',
    accent: 'Sotaque',
    accentHint: 'Escolhe o sotaque mais parecido com a tua forma de falar. Podes mudá-lo mais tarde nas definições da noite de jogos.',
    newWordsTitle: 'Palavras novas!',
    newWordsIntro: (theme) =>
      `Antes da tua primeira ronda de ${theme}, diz cada carta uma vez para o jogo aprender como soa na tua voz. Demora cerca de um minuto.`,

    listening: 'A ouvir…',
    allowMic: 'Se o navegador pedir, autoriza o microfone.',
    noMicTitle: 'Sem microfone',
    noMicText:
      'Não conseguimos ouvir, por isso o teste não pode correr. O jogo vai usar as definições habituais. Podes repetir o teste nas definições da noite de jogos.',

    timingTitle: '1. Tempo de resposta',
    timingIntro: (word) => (
      <>
        Depois de quatro bipes, diz <strong>“{word}”</strong> a cada batida, oito vezes, mesmo quando a carta piscar. Isto
        mede a rapidez com que este dispositivo te percebe.
      </>
    ),
    ready: 'Vamos lá',
    skipTiming: 'Saltar esta parte',
    getReady: 'Prepara-te…',
    sayIt: (beat, beats) => `Diz! ${beat} / ${beats}`,
    done: 'Feito!',
    measured: (ms) => (
      <>
        Este dispositivo percebe as palavras cerca de <strong>{formatNumber('pt-PT', ms / 1000, 2)} segundos</strong>{' '}
        depois de as dizeres. O jogo vai ter isso em conta.
      </>
    ),
    notMeasured:
      'Não ouvimos palavras suficientes para medir. Tenta outra vez um pouco mais alto, ou salta esta parte e usa o tempo habitual.',
    nextWords: 'A seguir: as palavras',

    wordsTitle: '2. Palavras',
    newWords: 'Palavras novas',
    cardOf: (card, cards) => `Carta ${card} de ${cards}`,
    say: (word) => (
      <>
        Diz <strong>“{word}”</strong>
      </>
    ),
    gotIt: 'Percebido!',
    heardNothing: 'Não ouvimos nada.',
    heardOther: (word, other) => (
      <>
        Ouvimos <strong>“{word}”</strong>, que é outra carta ({other}).
      </>
    ),
    heardAsk: (word, card) => (
      <>
        Ouvimos <strong>“{word}”</strong>. Contar como {card} neste dispositivo?
      </>
    ),
    countIt: 'Sim, contar',
    skipCard: 'Saltar esta carta',

    strictTitle: '3. Que rigor?',
    allSet: 'Tudo pronto!',
  },
};
