import type { ReactNode } from 'react';
import type { Localized } from '../../core/i18n/locales';

interface Messages {
  hint: (seconds: number, points: number) => string;
  showWord: string;
  secret: ReactNode;
  guessed: (n: number) => string;
  skip: string;
  gotIt: string;
  detail: (guessed: number, skipped: number) => string;
}

export const MESSAGES: Localized<Messages> = {
  'en-US': {
    hint: (seconds, points) => `${seconds} seconds · ${points} points per word guessed · skipping is free`,
    showWord: 'Show me a word',
    secret: (
      <>
        Only you look at the screen. Act it out without speaking, and tap <strong>Got it!</strong> when someone guesses
        right.
      </>
    ),
    guessed: (n) => `${n} guessed`,
    skip: 'Skip',
    gotIt: 'Got it!',
    detail: (guessed, skipped) => `${guessed} guessed · ${skipped} skipped`,
  },
  'pt-PT': {
    hint: (seconds, points) => `${seconds} segundos · ${points} pontos por palavra adivinhada · saltar não custa nada`,
    showWord: 'Mostra-me uma palavra',
    secret: (
      <>
        Só tu olhas para o ecrã. Faz a mímica sem falar e toca em <strong>Acertaram!</strong> quando alguém adivinhar.
      </>
    ),
    guessed: (n) => `${n} ${n === 1 ? 'adivinhada' : 'adivinhadas'}`,
    skip: 'Saltar',
    gotIt: 'Acertaram!',
    detail: (guessed, skipped) =>
      `${guessed} ${guessed === 1 ? 'adivinhada' : 'adivinhadas'} · ${skipped} ${skipped === 1 ? 'saltada' : 'saltadas'}`,
  },
};
