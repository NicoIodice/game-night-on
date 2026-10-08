import type { GameDefinition, GameProps } from '../../core/types';
import { Charades } from './Charades';
import type { CharadesSkin } from './skin';
import { DEFAULT_SECONDS } from './words';

type SkinDetails = Pick<GameDefinition, 'enabled' | 'description' | 'themes' | 'thumbnail'>;

/** A charades game for one festivity: the shared rules and settings, with the skin's words. */
export function charadesGame(skin: CharadesSkin, details: SkinDetails): GameDefinition {
  return {
    id: skin.id,
    name: skin.title,
    kind: 'party',
    players: { min: 2, max: 8 },
    supports: () => Object.values(skin.words).every((words) => words.length > 0),
    options: [
      {
        id: 'seconds',
        label: { 'en-US': 'Seconds per turn', 'pt-PT': 'Segundos por vez' },
        min: 30,
        max: 120,
        step: 15,
        default: DEFAULT_SECONDS,
      },
    ],
    Component: (props: GameProps) => <Charades {...props} skin={skin} />,
    ...details,
  };
}
