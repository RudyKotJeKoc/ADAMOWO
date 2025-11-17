import { type ReactElement, type ReactNode, useState, useId, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

/**
 * Accordion item configuration.
 */
export interface AccordionItem {
  /** Unique identifier for the accordion item */
  id: string;
  /** Title/trigger text displayed in the header */
  title: string;
  /** Content displayed when the item is expanded */
  content: ReactNode;
  /** Optional badge text */
  badge?: string;
  /** Start in expanded state */
  defaultExpanded?: boolean;
}

/**
 * Props for the Accordion component.
 */
export interface AccordionProps {
  /** Array of accordion items */
  items: AccordionItem[];
  /** Allow multiple items to be open simultaneously */
  allowMultiple?: boolean;
  /** Optional CSS class name for the container */
  className?: string;
  /** Callback when item expansion changes */
  onItemToggle?: (itemId: string, isExpanded: boolean) => void;
}

/**
 * Accordion component for collapsible content sections.
 *
 * Ideal for FAQ sections, technical documentation, and content that should be
 * hidden by default to reduce visual clutter. Implements full accessibility
 * support with keyboard navigation and ARIA attributes.
 *
 * Features:
 * - Keyboard navigation (Space, Enter to toggle)
 * - ARIA compliance for screen readers
 * - Smooth expand/collapse animations with reduced motion support
 * - Single or multiple expansion modes
 * - Mobile-optimized touch targets
 * - Optional badges for items
 *
 * @component
 * @example
 * ```tsx
 * const faqItems = [
 *   { id: 'q1', title: 'Jak mogę pomóc?', content: 'Możesz...' },
 *   { id: 'q2', title: 'Gdzie szukać wsparcia?', content: 'Kontakt...' }
 * ];
 * <Accordion items={faqItems} />
 * ```
 */
export function Accordion({
  items,
  allowMultiple = false,
  className,
  onItemToggle,
}: AccordionProps): ReactElement {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(items.filter((item) => item.defaultExpanded).map((item) => item.id))
  );
  const accordionId = useId();
  const reduceMotion = useReducedMotion();

  const toggleItem = useCallback(
    (itemId: string) => {
      setExpandedIds((prev) => {
        const newSet = new Set(prev);
        const isExpanding = !newSet.has(itemId);

        if (isExpanding) {
          if (!allowMultiple) {
            newSet.clear();
          }
          newSet.add(itemId);
        } else {
          newSet.delete(itemId);
        }

        onItemToggle?.(itemId, isExpanding);
        return newSet;
      });
    },
    [allowMultiple, onItemToggle]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, itemId: string) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleItem(itemId);
      }
    },
    [toggleItem]
  );

  return (
    <div className={clsx('w-full space-y-3', className)} id={accordionId}>
      {items.map((item) => {
        const isExpanded = expandedIds.has(item.id);
        const panelId = `panel-${accordionId}-${item.id}`;
        const buttonId = `button-${accordionId}-${item.id}`;

        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-lg border border-base-800 bg-base-900/50 transition-colors hover:border-base-700"
          >
            {/* Accordion Header/Trigger */}
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                className={clsx(
                  'flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors',
                  'touch-target focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-500',
                  isExpanded ? 'text-accent-300' : 'text-base-100 hover:text-base-50'
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="font-medium">{item.title}</span>
                  {item.badge && (
                    <span className="rounded-full bg-accent-500/20 px-2 py-0.5 text-xs font-semibold text-accent-200">
                      {item.badge}
                    </span>
                  )}
                </span>
                <motion.span
                  animate={reduceMotion ? undefined : { rotate: isExpanded ? 180 : 0 }}
                  transition={
                    reduceMotion ? undefined : { type: 'spring', stiffness: 200, damping: 20 }
                  }
                  className="flex-shrink-0"
                >
                  <ChevronDownIcon
                    className={clsx(
                      'h-5 w-5 transition-colors',
                      isExpanded ? 'text-accent-300' : 'text-base-400'
                    )}
                    aria-hidden="true"
                  />
                </motion.span>
              </button>
            </h3>

            {/* Accordion Panel/Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduceMotion ? { height: 'auto' } : { height: 0, opacity: 0 }}
                  animate={reduceMotion ? { height: 'auto' } : { height: 'auto', opacity: 1 }}
                  exit={reduceMotion ? { height: 0 } : { height: 0, opacity: 0 }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { height: { duration: 0.3 }, opacity: { duration: 0.2 } }
                  }
                  className="overflow-hidden"
                >
                  <div className="border-t border-base-800 px-5 py-4 text-base-200">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
