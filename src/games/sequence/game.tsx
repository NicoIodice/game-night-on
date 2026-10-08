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
    players: '1–8 players or teams',
    supports: () => skin.pads.length >= 3,
    options: [
      { id: 'pads', label: 'Pads', min: 3, max: skin.pads.length, default: Math.min(DEFAULT_PADS, skin.pads.length) },
      { id: 'lives', label: 'Lives', min: 1, max: 3, default: DEFAULT_LIVES },
      { id: 'flash', label: 'Flash time (milliseconds)', min: 350, max: 900, step: 50, default: DEFAULT_STEP_MS },
    ],
    Component: (props: GameProps) => <SequenceGame {...props} skin={skin} />,
    ...details,
  };
}
