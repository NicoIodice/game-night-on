import './Icon.css';

interface IconProps {
  src: string;
  label?: string;
  className?: string;
}

/** Single-colour SVG drawn in the current text colour, so themes can recolour it with CSS. */
export function Icon({ src, label, className = '' }: IconProps) {
  return (
    <span
      className={`icon ${className}`}
      style={{ maskImage: `url("${src}")`, WebkitMaskImage: `url("${src}")` }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
