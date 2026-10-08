import { Icon } from './Icon';
import soundOff from './icons/sound-off.svg';
import soundOn from './icons/sound-on.svg';
import './SoundToggle.css';

interface SoundToggleProps {
  muted: boolean;
  onChange: (muted: boolean) => void;
}

export function SoundToggle({ muted, onChange }: SoundToggleProps) {
  return (
    <button
      className="sound-toggle"
      onClick={() => onChange(!muted)}
      aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
      aria-pressed={muted}
    >
      <Icon src={muted ? soundOff : soundOn} />
    </button>
  );
}
