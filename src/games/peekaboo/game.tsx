import type { GameDefinition, GameProps } from '../../core/types';
import { Peekaboo } from './Peekaboo';
import type { PeekSkin } from './skin';

type SkinDetails = Pick<GameDefinition, 'enabled' | 'description' | 'themes' | 'thumbnail'>;

/** A pop-up game for one festivity: the shared rules, with the skin's characters and scenery. */
export function peekGame(skin: PeekSkin, details: SkinDetails): GameDefinition {
  return {
    id: skin.id,
    name: skin.title,
    kind: 'party',
    players: { min: 1, max: 8 },
    supports: () => true,
    Component: (props: GameProps) => <Peekaboo {...props} skin={skin} />,
    ...details,
  };
}
