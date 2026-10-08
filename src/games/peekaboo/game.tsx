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
    players: '1–8 players or teams',
    supports: () => true,
    Component: (props: GameProps) => <Peekaboo {...props} skin={skin} />,
    ...details,
  };
}
