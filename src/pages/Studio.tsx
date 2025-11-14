import type { ReactElement } from 'react';
import { useParams } from 'react-router-dom';

import { ProgramPage } from '../features/studio/ProgramPage';
import { StudioSection } from '../features/studio/StudioSection';
import type { ProgramId } from '../features/studio/studio.schema';

/**
 * Studio page component with dynamic routing.
 *
 * Displays either a specific program page when a program ID is provided in the URL,
 * or the main studio overview section when accessed without parameters. The studio
 * features various creative programs and content related to the ADAMOWO project.
 *
 * Key Features:
 * - Dynamic routing based on URL parameters
 * - Conditional rendering of program-specific content
 * - Integration with studio program schema
 *
 * @component
 * @returns {ReactElement} Either a specific program page or the studio overview
 */
export default function Studio(): ReactElement {
  const { program } = useParams<{ program?: string }>();

  if (typeof program === 'string') {
    return <ProgramPage programId={program as ProgramId} />;
  }

  return (
    <div className="space-y-10">
      <StudioSection />
    </div>
  );
}
