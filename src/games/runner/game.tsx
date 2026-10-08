import type { GameDefinition, GameProps } from '../../core/types';
import { DEFAULT_SECONDS } from './dash';
import { Runner } from './Runner';
import type { RunnerSkin } from './skin';

type SkinDetails = Pick<GameDefinition, 'enabled' | 'description' | 'themes' | 'thumbnail'>;

/** A running game for one festivity: the shared physics and settings, with the skin's look. */
export function runnerGame(skin: RunnerSkin, details: SkinDetails): GameDefinition {
  return {
    id: skin.id,
    name: skin.title,
    kind: 'keyboard',
    players: { min: 1, max: 8 },
    supports: () => true,
    options: [
      {
        id: 'seconds',
        label: { 'en-US': 'Seconds per run', 'pt-PT': 'Segundos por corrida' },
        min: 20,
        max: 90,
        step: 5,
        default: DEFAULT_SECONDS,
        easy: 30,
        hard: 60,
      },
    ],
    Component: (props: GameProps) => <Runner {...props} skin={skin} />,
    ...details,
  };
}
