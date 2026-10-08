import candles from '../../themes/birthday/assets/candles.svg';
import { shoutGame } from '../shout/game';
import thumbnail from './assets/thumbnail.jpg';
import './BirthdayCheer.css';

export const birthdayCheer = shoutGame(
  {
    id: 'birthday-cheer',
    title: { 'en-US': 'Birthday Cheer', 'pt-PT': 'Grito de Parabéns' },
    intro: {
      'en-US':
        "The birthday candles need a big cheer to light up! Stay quiet while we listen to the room, then give your loudest, longest HAPPY BIRTHDAY. The louder you are, the higher the candle flames go.",
      'pt-PT':
        'As velas de anos precisam de um grande grito para se acenderem! Fica em silêncio enquanto ouvimos a sala, e depois solta o teu PARABÉNS mais forte e mais longo. Quanto mais alto, mais sobem as chamas das velas.',
    },
    mascot: candles,
    call: { 'en-US': 'HAPPY BIRTHDAY!', 'pt-PT': 'PARABÉNS!' },
    ranks: [
      { from: 0, label: { 'en-US': 'A birthday whisper', 'pt-PT': 'Um sussurro de anos' } },
      { from: 150, label: { 'en-US': 'A shy hooray', 'pt-PT': 'Um viva envergonhado' } },
      { from: 350, label: { 'en-US': 'A happy cheer', 'pt-PT': 'Um viva bem alegre' } },
      { from: 550, label: { 'en-US': 'The whole party singing', 'pt-PT': 'A festa toda a cantar' } },
      { from: 800, label: { 'en-US': 'Candles ablaze!', 'pt-PT': 'Velas a arder!' } },
    ],
  },
  {
    enabled: true,
    description: {
      'en-US': 'Who has the biggest HAPPY BIRTHDAY? Make the candle flames flare up with your loudest, longest cheer!',
      'pt-PT': 'Quem tem o PARABÉNS mais forte? Faz as chamas das velas subir com o teu grito mais forte e mais longo!',
    },
    themes: ['birthday'],
    thumbnail,
  },
);
