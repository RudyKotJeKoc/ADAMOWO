import type { SVGProps } from 'react';

export function SevenIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <defs>
        <linearGradient id="sevenGradient" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffe0d6" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="10" ry="10" fill="url(#sevenGradient)" opacity="0.65" />
      <path
        d="M18 14h32l-20 36"
        fill="none"
        stroke="#ff8f60"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M26 30h16" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
