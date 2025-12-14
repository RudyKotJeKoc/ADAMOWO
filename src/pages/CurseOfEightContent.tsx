import type { JSX } from 'react';

import { CurseOfEightSection } from '../features/curse-of-eight/CurseOfEightSection';

/**
 * Dedicated page for the "Curse of Eight" analysis.
 *
 * Exposes the in-depth symbolic analysis that was previously only available
 * as unused content, ensuring analysis cards have a working destination.
 */
export default function CurseOfEightContent(): JSX.Element {
  return (
    <section className="space-y-8" aria-label="Pełna analiza Klątwy Ósemki">
      <CurseOfEightSection />
    </section>
  );
}
