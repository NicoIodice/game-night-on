import type { Theme } from '../../core/types';
import boot from './assets/boot.svg';
import bug from './assets/bug.svg';
import campfire from './assets/campfire.svg';
import chair from './assets/chair.svg';
import clown from './assets/clown.svg';
import crown from './assets/crown.svg';
import drop from './assets/drop.svg';
import drum from './assets/drum.svg';
import favicon from './assets/favicon.svg';
import feather from './assets/feather.svg';
import flag from './assets/flag.svg';
import gown from './assets/gown.svg';
import jester from './assets/jester.svg';
import jug from './assets/jug.svg';
import juggler from './assets/juggler.svg';
import maracas from './assets/maracas.svg';
import mask from './assets/mask.svg';
import mole from './assets/mole.svg';
import mug from './assets/mug.svg';
import note from './assets/note.svg';
import parrot from './assets/parrot.svg';
import plug from './assets/plug.svg';
import somersault from './assets/somersault.svg';
import tambourine from './assets/tambourine.svg';
import town from './assets/town.svg';
import unicycle from './assets/unicycle.svg';
import { carnivalMusic } from './music';
import { createCarnivalSounds } from './sounds';

export const carnival: Theme = {
  id: 'carnival',
  name: { 'en-US': 'Carnival', 'pt-PT': 'Carnaval' },
  tagline: { 'en-US': 'Masks, music and a parade of games', 'pt-PT': 'Máscaras, música e um desfile de jogos' },
  icon: mask,
  favicon,
  enabled: true,
  decks: {
    'en-US': [
      [
        { id: 'crown', label: 'Crown', image: crown },
        // Card ids are unique across themes, and the birthday party already has a "clown".
        { id: 'clown-carnival', label: 'Clown', image: clown },
        { id: 'gown', label: 'Gown', image: gown, sayAs: ['dress'] },
        { id: 'town', label: 'Town', image: town },
      ],
      [
        { id: 'bug', label: 'Bug', image: bug },
        { id: 'mug', label: 'Mug', image: mug },
        { id: 'jug', label: 'Jug', image: jug },
        { id: 'plug', label: 'Plug', image: plug },
      ],
      [
        { id: 'mask', label: 'Mask', image: mask },
        { id: 'juggler', label: 'Juggler', image: juggler },
        { id: 'jester', label: 'Jester', image: jester },
        { id: 'feather', label: 'Feather', image: feather },
        { id: 'parrot', label: 'Parrot', image: parrot },
        { id: 'maracas', label: 'Maracas', image: maracas, sayAs: ['maraca'] },
        { id: 'unicycle', label: 'Unicycle', image: unicycle },
      ],
    ],
    // The English rhymes don't rhyme in Portuguese, so the decks keep the idea instead of the
    // words: "-ota" words, then "-eira" words, then the carnival words of different lengths.
    'pt-PT': [
      [
        { id: 'bota', label: 'Bota', image: boot },
        { id: 'gota', label: 'Gota', image: drop },
        { id: 'nota', label: 'Nota', image: note },
        { id: 'cambalhota', label: 'Cambalhota', image: somersault },
      ],
      [
        { id: 'bandeira', label: 'Bandeira', image: flag },
        { id: 'fogueira', label: 'Fogueira', image: campfire },
        { id: 'cadeira', label: 'Cadeira', image: chair },
        { id: 'toupeira', label: 'Toupeira', image: mole },
      ],
      [
        { id: 'mascara', label: 'Máscara', image: mask },
        { id: 'malabarista', label: 'Malabarista', image: juggler },
        { id: 'pandeireta', label: 'Pandeireta', image: tambourine },
        { id: 'coroa', label: 'Coroa', image: crown },
        { id: 'pena', label: 'Pena', image: feather },
        { id: 'tambor', label: 'Tambor', image: drum },
        { id: 'monociclo', label: 'Monociclo', image: unicycle },
      ],
    ],
  },
  music: carnivalMusic,
  createSounds: createCarnivalSounds,
};
