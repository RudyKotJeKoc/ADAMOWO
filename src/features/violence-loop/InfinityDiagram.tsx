import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ReactElement } from 'react';

import type { Phase, PhaseId } from './phase-data';
import './loop.css';

type PhaseSummary = Phase & {
  title: string;
  summary: string;
};

type InfinityDiagramProps = {
  phases: PhaseSummary[];
  progress: number;
  activePhaseId: PhaseId;
  onSelectPhase: (phaseId: PhaseId) => void;
  onRequestNavigate: (direction: 'prev' | 'next') => void;
  diagramLabel: string;
  instructions: string;
  phaseOrderLabel: string;
  isPlaying: boolean;
  reducedMotion: boolean;
};

const VIEWBOX_WIDTH = 160;
const VIEWBOX_HEIGHT = 120;
const PATH_DEFINITION =
  'M 20 60 C 20 20, 70 20, 80 60 C 90 100, 140 100, 140 60 C 140 20, 90 20, 80 60 C 70 100, 20 100, 20 60 Z';

export function InfinityDiagram({
  phases,
  progress,
  activePhaseId,
  onSelectPhase,
  onRequestNavigate,
  diagramLabel,
  instructions,
  phaseOrderLabel,
  isPlaying,
  reducedMotion
}: InfinityDiagramProps): ReactElement {
  const diagramRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const indicatorRef = useRef<SVGCircleElement | null>(null);
  const instructionsId = useMemo(() => 'loop-diagram-instructions', []);
  const phaseListId = useMemo(() => 'loop-diagram-phase-order', []);
  const [hotspotPositions, setHotspotPositions] = useState(() =>
    phases.map(() => ({ left: '0%', top: '0%' }))
  );

  useEffect(() => {
    const path = pathRef.current;
    if (!path) {
      return;
    }

    const length = path.getTotalLength();
    const nextPositions = phases.map((phase) => {
      const point = path.getPointAtLength(phase.position * length);
      return {
        left: `${(point.x / VIEWBOX_WIDTH) * 100}%`,
        top: `${(point.y / VIEWBOX_HEIGHT) * 100}%`
      };
    });

    setHotspotPositions(nextPositions);
  }, [phases]);

  useEffect(() => {
    const path = pathRef.current;
    const indicator = indicatorRef.current;
    if (!path || !indicator) {
      return;
    }

    const length = path.getTotalLength();
    const value = progress * length;
    const point = path.getPointAtLength(value);
    indicator.setAttribute('cx', point.x.toString());
    indicator.setAttribute('cy', point.y.toString());
  }, [progress]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        onRequestNavigate(event.key === 'ArrowLeft' ? 'prev' : 'next');
      }
    },
    [onRequestNavigate]
  );

  return (
    <div
      ref={diagramRef}
      className="loop-diagram"
      tabIndex={0}
      role="group"
      aria-label={diagramLabel}
      aria-describedby={`${instructionsId} ${phaseListId}`}
      onKeyDown={handleKeyDown}
    >
      <svg className="loop-svg" viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} role="presentation">
        <defs>
          <linearGradient id="loop-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1f3a" />
            <stop offset="50%" stopColor="#2d3760" />
            <stop offset="100%" stopColor="#1a1f3a" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          d={PATH_DEFINITION}
          fill="none"
          stroke="url(#loop-gradient)"
          strokeWidth={6}
          className="loop-path"
          data-paused={(!isPlaying).toString()}
          data-reduced={reducedMotion.toString()}
        />
        <circle ref={indicatorRef} r={4.5} fill="#ff6b35" className="loop-indicator" />
      </svg>

      {phases.map((phase, index) => {
        const isActive = phase.id === activePhaseId;
        const position = hotspotPositions[index];

        return (
          <button
            key={phase.id}
            type="button"
            className="loop-hotspot"
            data-active={isActive}
            style={{ left: position.left, top: position.top }}
            onClick={() => onSelectPhase(phase.id)}
            aria-current={isActive ? 'true' : undefined}
            title={phase.title}
          >
            <span className="block text-xs font-semibold uppercase tracking-wide text-accent-400">
              {phase.title}
            </span>
            <span className="mt-1 block text-sm text-base-100">{phase.summary}</span>
          </button>
        );
      })}

      <p id={instructionsId} className="sr-only">
        {instructions}
      </p>
      <div id={phaseListId} className="sr-only">
        <p>{phaseOrderLabel}</p>
        <ol>
          {phases.map((phase) => (
            <li key={phase.id}>{phase.title}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
