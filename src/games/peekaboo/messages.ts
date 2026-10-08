import { plural, type Localized } from '../../core/i18n/locales';

const enUS = {
  hint: (seconds: number) => `${seconds} seconds · 5 in a row = double points`,
  dontTap: (points: number) => `−${points} — don't tap!`,
  hole: (n: number) => `Hole ${n}`,
  gotAway: (n: number) => `${n} got away`,
  /** How often the friend was tapped, e.g. "no cat bonked", "2 reindeer bonks". */
  bonks: (friend: string, n: number) =>
    n === 0 ? `no ${friend.toLowerCase()} bonked` : `${n} ${friend.toLowerCase()} ${plural('en-US', n, 'bonk', 'bonks')}`,
};

export const MESSAGES: Localized<typeof enUS> = {
  'en-US': enUS,
  'pt-PT': {
    hint: (seconds) => `${seconds} segundos · 5 seguidos = pontos a dobrar`,
    dontTap: (points) => `−${points} — não toques!`,
    hole: (n) => `Buraco ${n}`,
    gotAway: (n) => `${n} ${plural('pt-PT', n, 'fugiu', 'fugiram')}`,
    // "Gato: 2 toques" stays right whatever the friend's gender.
    bonks: (friend, n) => `${friend}: ${n} ${plural('pt-PT', n, 'toque', 'toques')}`,
  },
};
