import type { GameDefinition, GameProps } from '../../core/types';
import { DEFAULT_LIVES, DEFAULT_PADS, DEFAULT_STEP_MS } from './sequence';
import { SequenceGame } from './SequenceGame';
import type { SequenceSkin } from './skin';

type SkinDetails = Pick<GameDefinition, 'enabled' | 'description' | 'themes' | 'thumbnail'>;

/** A sequence game for one festivity: the shared rules and settings, with the skin's look and pads. */
export function sequenceGame(skin: SequenceSkin, details: SkinDetails): GameDefinition {
  return {
    id: skin.id,
    name: skin.title,
    kind: 'party',
    players: { min: 1, max: 8 },
    supports: () => skin.pads.length >= 3,
    options: [
      {
        id: 'pads',
        label: { 'en-US': 'Pads', 'pt-PT': 'Botões' },
        min: 3,
        max: skin.pads.length,
        default: Math.min(DEFAULT_PADS, skin.pads.length),
        easy: 3,
        hard: Math.min(DEFAULT_PADS + 1, skin.pads.length),
      },
      { id: 'lives', label: { 'en-US': 'Lives', 'pt-PT': 'Vidas' }, min: 1, max: 3, default: DEFAULT_LIVES, easy: 3, hard: 1 },
      {
        id: 'flash',
        label: { 'en-US': 'Flash time (milliseconds)', 'pt-PT': 'Tempo aceso (milissegundos)' },
        min: 350,
        max: 900,
        step: 50,
        default: DEFAULT_STEP_MS,
        easy: 800,
        hard: 500,
      },
    ],
    Component: (props: GameProps) => <SequenceGame {...props} skin={skin} />,
    ...details,
  };
}
