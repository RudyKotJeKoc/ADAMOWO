import { KeyboardEvent, type JSX } from 'react';
import clsx from 'clsx';

export type TabDefinition = {
  id: string;
  label: string;
  panelId: string;
};

export type TabNavProps = {
  tabs: TabDefinition[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  ariaLabel?: string;
};

export function TabNav({ tabs, activeTab, onChange, className, ariaLabel }: TabNavProps): JSX.Element {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex === -1) {
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
      onChange(tabs[nextIndex]?.id ?? activeTab);
      const nextButton = document.getElementById(`${tabs[nextIndex]?.id}-tab`);
      nextButton?.focus();
    }

    if (event.key === 'Home') {
      event.preventDefault();
      onChange(tabs[0]?.id ?? activeTab);
      const firstButton = document.getElementById(`${tabs[0]?.id}-tab`);
      firstButton?.focus();
    }

    if (event.key === 'End') {
      event.preventDefault();
      const last = tabs.at(-1);
      if (!last) return;
      onChange(last.id);
      const lastButton = document.getElementById(`${last.id}-tab`);
      lastButton?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel ?? 'Tab navigation'}
      className={clsx('flex flex-wrap gap-2 rounded-lg bg-base-900/40 p-2', className)}
      onKeyDown={onKeyDown}
    >
      {tabs.map(({ id, label, panelId }) => {
        const selected = id === activeTab;
        return (
          <button
            key={id}
            id={`${id}-tab`}
            role="tab"
            type="button"
            aria-selected={selected}
            aria-controls={panelId}
            className={clsx(
              'rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950',
              selected
                ? 'bg-accent-500 text-base-950 focus-visible:ring-accent-300'
                : 'bg-base-800 text-base-200 hover:bg-base-700 focus-visible:ring-accent-400'
            )}
            onClick={() => onChange(id)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
