import { formatNumber, type Localized } from '../../core/i18n/locales';

const enUS = {
  unsupported: "This browser can't use the microphone. Try Chrome, Edge or Safari.",
  denied: 'Microphone access was blocked, so we can’t hear you.',
  asking: 'If your browser asks, allow the microphone.',
  hint: (seconds: number) => `Quiet during the countdown, then ${seconds} seconds to be loud · uses your microphone`,
  tryAgain: 'Try again',
  skipTurn: 'Skip this turn (0 points)',
  skipped: 'Skipped: no microphone',
  hush: 'Shh… quiet for a moment',
  detail: (rank: string, peak: number, loudSeconds: number) =>
    `${rank} · peak ${peak}% · ${formatNumber('en-US', loudSeconds, 1)}s loud`,
};

export const MESSAGES: Localized<typeof enUS> = {
  'en-US': enUS,
  'pt-PT': {
    unsupported: 'Este navegador não consegue usar o microfone. Experimenta o Chrome, o Edge ou o Safari.',
    denied: 'O acesso ao microfone foi bloqueado, por isso não te conseguimos ouvir.',
    asking: 'Se o navegador pedir, autoriza o microfone.',
    hint: (seconds) => `Silêncio durante a contagem, depois tens ${seconds} segundos para fazer barulho · usa o microfone`,
    tryAgain: 'Tentar outra vez',
    skipTurn: 'Saltar esta vez (0 pontos)',
    skipped: 'Saltou a vez: sem microfone',
    hush: 'Chiu… silêncio por um momento',
    detail: (rank, peak, loudSeconds) => `${rank} · pico de ${peak}% · ${formatNumber('pt-PT', loudSeconds, 1)} s de barulho`,
  },
};
