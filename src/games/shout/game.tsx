import type { GameDefinition, GameProps } from '../../core/types';
import { DEFAULT_SECONDS } from './loudness';
import { Shout } from './Shout';
import type { ShoutSkin } from './skin';

type SkinDetails = Pick<GameDefinition, 'enabled' | 'description' | 'themes' | 'thumbnail'>;

/** A shouting game for one festivity: the shared scoring and settings, with the skin's look. */
export function shoutGame(skin: ShoutSkin, details: SkinDetails): GameDefinition {
  return {
    id: skin.id,
    name: skin.title,
    kind: 'voice',
    players: '1–8 players or teams',
    supports: () => true,
    options: [{ id: 'seconds', label: 'Seconds of shouting', min: 2, max: 8, default: DEFAULT_SECONDS }],
    Component: (props: GameProps) => <Shout {...props} skin={skin} />,
    ...details,
  };
}
