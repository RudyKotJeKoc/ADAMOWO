import type { JSX } from 'react';

import { TimelineSection } from '../features/timeline/TimelineSection';

/**
 * Dedicated page for the full Adamowo timeline analysis.
 *
 * Surfaces the interactive timeline content so analysis cards and deep links
 * lead to a working page instead of dead ends.
 */
export default function TimelineContent(): JSX.Element {
  return (
    <section className="space-y-8" aria-label="Pełna analiza osi czasu Adamowo">
      <TimelineSection />
    </section>
  );
}
