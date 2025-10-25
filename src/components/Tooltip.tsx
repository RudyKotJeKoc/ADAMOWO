import { useState, type ReactNode } from 'react';
import type { JSX } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-base-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-base-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-base-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-base-800'
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 ${positionClasses[position]} w-64 px-3 py-2 text-xs text-base-100 bg-base-800 border border-base-700 rounded-lg shadow-lg pointer-events-none`}
        >
          {content}
          <div
            className={`absolute ${arrowClasses[position]} w-0 h-0 border-4 border-transparent`}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
