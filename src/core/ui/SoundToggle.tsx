import { useMessages } from '../i18n/I18n';
import { Icon } from './Icon';
import soundOff from './icons/sound-off.svg';
import soundOn from './icons/sound-on.svg';
import { MESSAGES } from './messages';
import './SoundToggle.css';

interface SoundToggleProps {
  muted: boolean;
  onChange: (muted: boolean) => void;
}

export function SoundToggle({ muted, onChange }: SoundToggleProps) {
  const t = useMessages(MESSAGES);
  return (
    <button
      className="sound-toggle"
      onClick={() => onChange(!muted)}
      aria-label={muted ? t.soundOn : t.soundOff}
      aria-pressed={muted}
    >
      <Icon src={muted ? soundOff : soundOn} />
    </button>
  );
}
