import { IconBase, type IconProps } from './IconBase';

export function PsychIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <defs>
        <linearGradient id="psychGradient" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#12c2a9" />
          <stop offset="100%" stopColor="#0abfbc" />
        </linearGradient>
      </defs>
      <path
        d="M20 18c4-6 10-10 16-10 9 0 18 7 18 18 0 9-6 16-14 18v12h-8V44c-10-2-18-10-18-20 0-2 .3-4 .8-6"
        fill="none"
        stroke="url(#psychGradient)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="26" r="5" fill="#ccfbf1" opacity="0.4" />
      <circle cx="40" cy="22" r="4" fill="#ccfbf1" opacity="0.4" />
    </IconBase>
  );
}
