import type { SVGProps } from 'react';

export function EightIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <defs>
        <linearGradient id="eightGradient" x1="0%" x2="100%" y1="100%" y2="0%">
          <stop offset="0%" stopColor="#24163a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff6b35" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <rect x="6" y="6" width="52" height="52" rx="14" fill="url(#eightGradient)" opacity="0.75" />
      <path
        d="M32 16c-6.5 0-12 4.2-12 9.5s5.5 9.5 12 9.5 12-4.2 12-9.5S38.5 16 32 16Zm0 13c-6.5 0-12 4.2-12 9.5S25.5 48 32 48s12-4.2 12-9.5S38.5 29 32 29Z"
        fill="none"
        stroke="#ffe7db"
        strokeWidth="5"
      />
      <circle cx="32" cy="25" r="4" fill="#fff" opacity="0.5" />
      <circle cx="32" cy="39" r="4" fill="#fff" opacity="0.5" />
    </svg>
  );
}
