import type { GameDefinition, GameProps } from '../../core/types';
import { DEFAULT_SECONDS, LEVELS } from './board';
import { Memory } from './Memory';
import { memoryFaces, type MemorySkin } from './skin';

type SkinDetails = Pick<GameDefinition, 'enabled' | 'description' | 'themes' | 'thumbnail'>;

/** A memory game for one festivity: the shared rules and settings, with the skin's look. */
export function memoryGame(skin: MemorySkin, details: SkinDetails): GameDefinition {
  const pairsNeeded = Math.max(...LEVELS.map((level) => level.pairs));
  return {
    id: skin.id,
    name: skin.title,
    kind: 'party',
    players: '1–8 players or teams',
    supports: (theme) => memoryFaces(theme, skin).length >= pairsNeeded,
    levels: LEVELS.length,
    options: [{ id: 'seconds', label: 'Seconds per level', min: 30, max: 180, step: 15, default: DEFAULT_SECONDS }],
    Component: (props: GameProps) => <Memory {...props} skin={skin} />,
    ...details,
  };
}
