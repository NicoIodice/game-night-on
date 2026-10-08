import type { Theme } from '../../core/types';
import calendar from './assets/calendar.svg';
import carpet from './assets/carpet.svg';
import clock from './assets/clock.svg';
import deer from './assets/deer.svg';
import ear from './assets/ear.svg';
import fairy from './assets/fairy.svg';
import favicon from './assets/favicon.svg';
import grapes from './assets/grapes.svg';
import hourglass from './assets/hourglass.svg';
import ladder from './assets/ladder.svg';
import lock from './assets/lock.svg';
import pier from './assets/pier.svg';
import pillow from './assets/pillow.svg';
import popper from './assets/popper.svg';
import rock from './assets/rock.svg';
import rocket from './assets/rocket.svg';
import soap from './assets/soap.svg';
import sock from './assets/sock.svg';
import sparkler from './assets/sparkler.svg';
import spear from './assets/spear.svg';
import stopwatch from './assets/stopwatch.svg';
import sword from './assets/sword.svg';
import ticket from './assets/ticket.svg';
import { newYearMusic } from './music';
import { createNewYearSounds } from './sounds';

export const newYear: Theme = {
  id: 'newyear',
  name: { 'en-US': "New Year's Eve", 'pt-PT': 'Passagem de Ano' },
  tagline: { 'en-US': 'Countdown games for the last night of the year', 'pt-PT': 'Jogos para a contagem decrescente da última noite do ano' },
  icon: rocket,
  favicon,
  enabled: true,
  decks: {
    'en-US': [
      [
        { id: 'clock', label: 'Clock', image: clock },
        { id: 'sock', label: 'Sock', image: sock, sayAs: ['socks', 'sox'] },
        { id: 'rock', label: 'Rock', image: rock },
        { id: 'lock', label: 'Lock', image: lock },
      ],
      [
        { id: 'ear', label: 'Ear', image: ear, sayAs: ['year'] },
        { id: 'deer', label: 'Deer', image: deer, sayAs: ['dear'] },
        { id: 'spear', label: 'Spear', image: spear },
        { id: 'pier', label: 'Pier', image: pier, sayAs: ['peer'] },
      ],
      [
        { id: 'fireworks', label: 'Fireworks', image: rocket, sayAs: ['firework', 'rocket'] },
        { id: 'sparkler', label: 'Sparkler', image: sparkler, sayAs: ['sparkle', 'sparkles'] },
        { id: 'grapes', label: 'Grapes', image: grapes, sayAs: ['grape'] },
        { id: 'calendar', label: 'Calendar', image: calendar },
        { id: 'hourglass', label: 'Hourglass', image: hourglass },
        { id: 'stopwatch', label: 'Stopwatch', image: stopwatch },
        { id: 'ticket', label: 'Ticket', image: ticket },
      ],
    ],
    // The English rhymes don't rhyme in Portuguese, so the decks keep the idea instead of the
    // words: "-ete" words starting with the firework, then "-ada" words, then the New Year words of different lengths.
    'pt-PT': [
      [
        { id: 'foguete', label: 'Foguete', image: rocket },
        { id: 'bilhete', label: 'Bilhete', image: ticket },
        { id: 'tapete', label: 'Tapete', image: carpet },
        { id: 'sabonete', label: 'Sabonete', image: soap },
      ],
      [
        { id: 'espada', label: 'Espada', image: sword },
        { id: 'escada', label: 'Escada', image: ladder },
        { id: 'almofada', label: 'Almofada', image: pillow },
        { id: 'fada', label: 'Fada', image: fairy },
      ],
      [
        { id: 'relogio', label: 'Relógio', image: clock },
        // The Portuguese eat twelve raisins at midnight, one per chime.
        { id: 'passas', label: 'Passas', image: grapes, sayAs: ['uvas'] },
        { id: 'calendario', label: 'Calendário', image: calendar },
        { id: 'ampulheta', label: 'Ampulheta', image: hourglass },
        { id: 'cronometro', label: 'Cronómetro', image: stopwatch },
        { id: 'estrelinha', label: 'Estrelinha', image: sparkler },
        { id: 'confetes', label: 'Confetes', image: popper, sayAs: ['confete', 'confettis'] },
      ],
    ],
  },
  music: newYearMusic,
  createSounds: createNewYearSounds,
};
