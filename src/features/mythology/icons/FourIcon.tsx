import type { SVGProps } from 'react';

export function FourIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <defs>
        <linearGradient id="fourGradient" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#d53e1f" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#fourGradient)" opacity="0.7" />
      <path
        d="M22 38V18l20 26V18"
        fill="none"
        stroke="#ffd3c2"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="38" r="5" fill="#fff" opacity="0.6" />
    </svg>
  );
}
