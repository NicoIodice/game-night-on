import rose from '../../themes/valentine/assets/rose.svg';
import { memoryGame } from '../memory/game';
import thumbnail from './assets/thumbnail.jpg';
import './SweetheartPairs.css';

export const sweetheartPairs = memoryGame(
  {
    id: 'sweetheart-pairs',
    title: { 'en-US': 'Sweetheart Pairs', 'pt-PT': 'Pares Apaixonados' },
    intro: {
      'en-US':
        'Every card has a sweetheart, and they want to be together again. Turn over two at a time to find the pairs before the clock runs out. Pairs in a row earn a bonus, and spare seconds count too!',
      'pt-PT':
        'Cada carta tem um par apaixonado, e querem voltar a estar juntos. Vira duas de cada vez para encontrares os pares antes que o tempo acabe. Pares seguidos dão bónus, e os segundos que sobrarem também contam!',
    },
    back: rose,
  },
  {
    enabled: true,
    description: {
      'en-US': 'Every card has a sweetheart. Bring all the pairs back together before time runs out!',
      'pt-PT': 'Cada carta tem um par apaixonado. Volta a juntar todos os pares antes que o tempo acabe!',
    },
    themes: ['valentine'],
    thumbnail,
  },
);
