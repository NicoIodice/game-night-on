import { useMessages } from '../i18n/I18n';
import type { Difficulty } from '../types';
import { DIFFICULTIES, isCustom, setDifficulty, type Lineup } from './lineup';
import { MESSAGES } from './messages';
import './Match.css';

interface DifficultyPickerProps {
  lineup: Lineup;
  onChange: (lineup: Lineup) => void;
}

/**
 * The night's difficulty, on the theme's menu. Shows "Custom" while options were changed in the
 * game night settings; picking a difficulty sets every option to its values again.
 */
export function DifficultyPicker({ lineup, onChange }: DifficultyPickerProps) {
  const t = useMessages(MESSAGES);
  const custom = isCustom(lineup);

  return (
    <label className="difficulty-picker">
      <span>{t.difficulty}</span>
      <select
        className="difficulty-picker__select"
        value={custom ? 'custom' : lineup.difficulty}
        onChange={(event) => onChange(setDifficulty(lineup, event.target.value as Difficulty))}
      >
        {DIFFICULTIES.map((difficulty) => (
          <option key={difficulty} value={difficulty}>{t.difficultyName(difficulty)}</option>
        ))}
        {custom && <option value="custom" disabled>{t.difficultyName('custom')}</option>}
      </select>
    </label>
  );
}
