import { IconBase, type IconProps } from './IconBase';

export function TeamIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <defs>
        <linearGradient id="teamGradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#4c6ef5" />
          <stop offset="100%" stopColor="#91a7ff" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="20" r="12" fill="url(#teamGradient)" opacity="0.9" />
      <path
        d="M16 54c0-10 7.2-18 16-18s16 8 16 18"
        fill="none"
        stroke="url(#teamGradient)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 38c2-6 7-10 12-11" stroke="#91a7ff" strokeWidth="3" strokeLinecap="round" />
      <path d="M52 38c-2-6-7-10-12-11" stroke="#91a7ff" strokeWidth="3" strokeLinecap="round" />
    </IconBase>
  );
}
