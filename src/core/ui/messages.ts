import type { Localized } from '../i18n/locales';

const enUS = {
  soundOn: 'Turn sound on',
  soundOff: 'Turn sound off',
  language: 'Language',
};

export const MESSAGES: Localized<typeof enUS> = {
  'en-US': enUS,
  'pt-PT': {
    soundOn: 'Ligar o som',
    soundOff: 'Desligar o som',
    language: 'Idioma',
  },
};
