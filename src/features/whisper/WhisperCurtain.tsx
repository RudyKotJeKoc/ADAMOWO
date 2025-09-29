import { memo } from 'react';

import './whisper.css';

interface WhisperCurtainProps {
  reducedMotion: boolean;
}

export const WhisperCurtain = memo(function WhisperCurtain({ reducedMotion }: WhisperCurtainProps) {
  return (
    <div
      aria-hidden="true"
      className="whisper-curtain"
      data-reduced-motion={reducedMotion ? 'true' : 'false'}
    >
      <div className="whisper-panel" />
      <div className="whisper-panel whisper-panel--right" />
    </div>
  );
});
