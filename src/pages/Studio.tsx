import type { ReactElement } from 'react';
import { useParams } from 'react-router-dom';

import { ProgramPage } from '../features/studio/ProgramPage';
import { StudioSection } from '../features/studio/StudioSection';
import type { ProgramId } from '../features/studio/studio.schema';

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
