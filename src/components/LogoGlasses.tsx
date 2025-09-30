import { useId } from 'react';

export function LogoGlasses({ className }: { className?: string }): JSX.Element {
  const gradientId = useId();

  return (
    <svg className={className} viewBox="0 0 120 40" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradientId} x1="0%" x2="100%" y1="50%" y2="50%">
          <stop offset="0%" stopColor="#ff6b35" />
          <stop offset="100%" stopColor="#ff8658" />
        </linearGradient>
      </defs>
      <g fill={`url(#${gradientId})`}>
        <path d="M10 20c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12-12-5.373-12-12zm6.5 0c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5z" />
        <path d="M74 20c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12-12-5.373-12-12zm6.5 0c0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5z" />
      </g>
      <path d="M34 19h40c.552 0 1 .448 1 1s-.448 1-1 1H34c-.552 0-1-.448-1-1s.448-1 1-1z" fill="#ff6b35" />
      <path d="M4 18h6v4H4a4 4 0 0 1-4-4v-2C0 14.895.895 14 2 14h2c1.105 0 2 .895 2 2zM110 18h6v4h-6a4 4 0 0 1-4-4v-2c0-1.105.895-2 2-2h2c1.105 0 2 .895 2 2z" fill="#ff6b35" />
    </svg>
  );
}
