import type { CSSProperties } from 'react';
import type { Player } from '../types';

interface PlayerBadgeProps {
  player: Player;
  className?: string;
}

/** A player's name with their colour, the same everywhere so people recognise themselves. */
export function PlayerBadge({ player, className = '' }: PlayerBadgeProps) {
  return (
    <span className={`player-badge ${className}`} style={{ '--player': player.color } as CSSProperties}>
      <span className="player-badge__dot" aria-hidden>
        {player.name.charAt(0).toUpperCase()}
      </span>
      <span className="player-badge__name">{player.name}</span>
    </span>
  );
}
