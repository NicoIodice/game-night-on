import type { CSSProperties } from 'react';
import { Icon } from '../ui/Icon';
import trophy from '../ui/icons/trophy.svg';
import { PlayerBadge } from './PlayerBadge';
import type { Standing } from './ranking';

const PLACE_NAMES = ['1st', '2nd', '3rd'];

function placeName(place: number): string {
  return PLACE_NAMES[place - 1] ?? `${place}th`;
}

interface StandingsProps {
  standings: Standing[];
  details: Readonly<Record<string, string | undefined>>;
}

/** Podium for the top three, then a table with everyone. */
export function Standings({ standings, details }: StandingsProps) {
  const top = standings.slice(0, 3);
  // Classic podium order: 2nd on the left, 1st in the middle, 3rd on the right.
  const podium = top.length === 1 ? top : [top[1], top[0], top[2]].filter(Boolean);

  return (
    <>
      <ol className="podium" aria-label="Podium">
        {podium.map((standing) => (
          <li
            key={standing.player.id}
            className={`podium__step podium__step--${Math.min(standing.place, 3)}`}
            style={{ '--player': standing.player.color } as CSSProperties}
          >
            {standing.place === 1 && <Icon src={trophy} label="Winner" className="podium__trophy" />}
            <PlayerBadge player={standing.player} />
            <span className="podium__score">{standing.score}</span>
            <span className="podium__block">{placeName(standing.place)}</span>
          </li>
        ))}
      </ol>

      <table className="standings">
        <thead>
          <tr>
            <th scope="col">Place</th>
            <th scope="col">Name</th>
            <th scope="col">Score</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((standing) => (
            <tr key={standing.player.id} className={standing.place <= 3 ? `standings__row--${standing.place}` : ''}>
              <td>{placeName(standing.place)}</td>
              <td>
                <PlayerBadge player={standing.player} />
                {details[standing.player.id] && <span className="standings__detail">{details[standing.player.id]}</span>}
              </td>
              <td className="standings__score">{standing.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
