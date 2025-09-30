import { IconBase, type IconProps } from './IconBase';

export function HeartIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <defs>
        <linearGradient id="heartGradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff6b35" />
          <stop offset="100%" stopColor="#ffd166" />
        </linearGradient>
      </defs>
      <path
        d="M32 53c-7-6.6-22-16.7-22-28.3C10 16.4 18 12 24.5 12 29 12 32 15 32 15s3-3 7.5-3C46 12 54 16.4 54 24.7 54 36.3 39 46.4 32 53z"
        fill="url(#heartGradient)"
        stroke="#ffb48a"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="25" cy="24" r="5" fill="#fff" opacity="0.2" />
    </IconBase>
  );
}
