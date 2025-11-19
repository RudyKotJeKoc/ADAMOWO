import { type ReactElement, type ReactNode, useState, useId, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';

/**
 * Tab item configuration.
 */
export interface TabItem {
  /** Unique identifier for the tab */
  id: string;
  /** Display label for the tab */
  label: string;
  /** Optional badge text (e.g., "Nowość", "24/7") */
  badge?: string;
  /** Content to display when tab is active */
  content: ReactNode;
  /** Optional icon component */
  icon?: ReactNode;
}

/**
 * Props for the Tabs component.
 */
export interface TabsProps {
  /** Array of tab items to display */
  tabs: TabItem[];
  /** Initially active tab ID (defaults to first tab) */
  defaultActiveId?: string;
  /** Optional CSS class name for the container */
  className?: string;
  /** Callback when active tab changes */
  onTabChange?: (tabId: string) => void;
  /** Variant style */
  variant?: 'default' | 'pills';
}

/**
 * Tabs component for organizing content into switchable sections.
 *
 * Implements accessible tab navigation with keyboard support, smooth animations,
 * and mobile-first responsive design. Perfect for organizing complex content
 * hierarchies without requiring page navigation.
 *
 * Features:
 * - Keyboard navigation (Arrow keys, Home, End)
 * - ARIA compliance for screen readers
 * - Smooth content transitions with reduced motion support
 * - Mobile-optimized scrollable tab bar
 * - Optional badges and icons
 * - Touch-friendly tap targets
 *
 * @component
 * @example
 * ```tsx
 * const tabs = [
 *   { id: 'home', label: 'Start', content: <HomeContent /> },
 *   { id: 'tools', label: 'Narzędzia', content: <ToolsContent />, badge: 'Nowe' }
 * ];
 * <Tabs tabs={tabs} />
 * ```
 */
export function Tabs({
  tabs,
  defaultActiveId,
  className,
  onTabChange,
  variant = 'default',
}: TabsProps): ReactElement {
  const [activeId, setActiveId] = useState(defaultActiveId ?? tabs[0]?.id ?? '');
  const tabListId = useId();
  const reduceMotion = useReducedMotion();

  const activeTab = tabs.find((tab) => tab.id === activeId);

  const handleTabClick = useCallback(
    (tabId: string) => {
      setActiveId(tabId);
      onTabChange?.(tabId);
    },
    [onTabChange]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, currentIndex: number) => {
      let newIndex = currentIndex;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
          break;
        case 'ArrowRight':
          event.preventDefault();
          newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
          break;
        case 'Home':
          event.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          newIndex = tabs.length - 1;
          break;
        default:
          return;
      }

      const newTab = tabs[newIndex];
      if (newTab) {
        handleTabClick(newTab.id);
        // Focus the new tab button
        const button =
          event.currentTarget.parentElement?.parentElement?.querySelectorAll('button')[newIndex];
        button?.focus();
      }
    },
    [handleTabClick, tabs]
  );

  return (
    <div className={clsx('w-full', className)}>
      {/* Tab List */}
      <div
        role="tablist"
        id={tabListId}
        aria-label="Content sections"
        className={clsx(
          'mb-6 flex gap-2 overflow-x-auto pb-2',
          variant === 'pills' ? 'rounded-lg bg-base-900/50 p-1' : 'border-b border-base-800'
        )}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => handleTabClick(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={clsx(
                'relative flex shrink-0 items-center gap-2 whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-all',
                'touch-target rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500',
                variant === 'pills'
                  ? [
                      'hover:bg-base-850',
                      isActive
                        ? 'bg-base-800 text-accent-300 shadow-sm'
                        : 'text-base-300 hover:text-base-100',
                    ]
                  : [
                      'hover:text-base-100',
                      isActive
                        ? 'text-accent-300'
                        : 'text-base-300 hover:border-base-700 hover:text-base-100',
                    ]
              )}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={clsx(
                    'rounded-full px-2 py-0.5 text-xs font-semibold',
                    isActive ? 'bg-accent-500/20 text-accent-200' : 'bg-base-800 text-base-400'
                  )}
                >
                  {tab.badge}
                </span>
              )}
              {variant === 'default' && isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-500"
                  transition={
                    reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 30 }
                  }
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <AnimatePresence>
        {activeTab && (
          <motion.div
            key={activeId}
            role="tabpanel"
            id={`panel-${activeId}`}
            aria-labelledby={`tab-${activeId}`}
            tabIndex={0}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.2 }}
          >
            {activeTab.content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
