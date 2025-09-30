import type { SVGProps } from 'react';

export function ThirteenIcon(props: SVGProps<SVGSVGElement>): JSX.Element {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <defs>
        <radialGradient id="thirteenGradient" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#0a0e27" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      <rect x="8" y="8" width="48" height="48" rx="12" fill="#131836" opacity="0.8" />
      <path
        d="M16 48L48 16m0 28-28-28"
        stroke="url(#thirteenGradient)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="24" cy="24" r="5" fill="#ffb79a" opacity="0.8" />
      <circle cx="40" cy="40" r="5" fill="#ffb79a" opacity="0.8" />
    </svg>
  );
}
