import { IconBase, type IconProps } from './IconBase';

export function WelcomeIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <defs>
        <linearGradient id="welcomeGradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#f59f00" />
          <stop offset="100%" stopColor="#ffe066" />
        </linearGradient>
      </defs>
      <rect x="10" y="20" width="44" height="28" rx="8" fill="url(#welcomeGradient)" opacity="0.9" />
      <path
        d="M18 26h28l6 8-6 8H18l-6-8 6-8z"
        fill="none"
        stroke="#fff3bf"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="18" cy="34" r="3" fill="#fff3bf" opacity="0.4" />
      <circle cx="46" cy="34" r="3" fill="#fff3bf" opacity="0.4" />
    </IconBase>
  );
}
