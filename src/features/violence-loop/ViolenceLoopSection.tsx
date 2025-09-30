import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { InfinityDiagram } from './InfinityDiagram';
import { PhaseDetails } from './PhaseDetails';
import { LoopControls } from './controls';
import { phases } from './phase-data';

const LOOP_DURATION_MS = 14000;

const usePrefersReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => {
      setPrefersReducedMotion(query.matches);
    };

    updatePreference();
    query.addEventListener('change', updatePreference);

    return () => {
      query.removeEventListener('change', updatePreference);
    };
  }, []);

  return prefersReducedMotion;
};

export function ViolenceLoopSection(): ReactElement {
  const { t } = useTranslation();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [reduceMotion, setReduceMotion] = useState(prefersReducedMotion);
  const [isPlaying, setIsPlaying] = useState(!prefersReducedMotion);
  const [progress, setProgress] = useState(0);
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const resumeOnMotionRef = useRef(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (prefersReducedMotion) {
      setReduceMotion(true);
      setIsPlaying(false);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!isPlaying || reduceMotion || typeof window === 'undefined') {
      if (frameRef.current != null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      lastTimeRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      if (lastTimeRef.current == null) {
        lastTimeRef.current = timestamp;
      }

      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      setProgress((previous) => {
        let nextValue = previous + delta / LOOP_DURATION_MS;
        if (nextValue >= 1) {
          nextValue %= 1;
        }
        return nextValue;
      });

      frameRef.current = window.requestAnimationFrame(step);
    };

    frameRef.current = window.requestAnimationFrame(step);

    return () => {
      if (frameRef.current != null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [isPlaying, reduceMotion]);

  const phasesWithContent = useMemo(
    () =>
      phases.map((phase) => ({
        ...phase,
        title: t(phase.titleKey),
        summary: t(phase.summaryKey),
        examples: phase.examplesKeys.map((key) => t(key) as string),
        tips: phase.tipsKeys.map((key) => t(key) as string)
      })),
    [t]
  );

  const activePhaseIndex = useMemo(() => {
    const epsilon = 0.0001;
    for (let index = phases.length - 1; index >= 0; index -= 1) {
      if (progress + epsilon >= phases[index].position) {
        return index;
      }
    }

    return 0;
  }, [progress]);

  const activePhase = phasesWithContent[activePhaseIndex];

  useEffect(() => {
    if (activePhase) {
      setStatusMessage(t('loop.status.phase', { phase: activePhase.title }));
    }
  }, [activePhase, t]);

  const handleSelectPhase = useCallback((phaseId: (typeof phases)[number]['id']) => {
    const index = phases.findIndex((phase) => phase.id === phaseId);
    if (index === -1) {
      return;
    }

    lastTimeRef.current = null;
    setProgress(phases[index].position);
  }, []);

  const handleRequestNavigate = useCallback(
    (direction: 'prev' | 'next') => {
      const currentIndex = activePhaseIndex;
      const nextIndex =
        direction === 'prev'
          ? (currentIndex - 1 + phases.length) % phases.length
          : (currentIndex + 1) % phases.length;

      lastTimeRef.current = null;
      setProgress(phases[nextIndex].position);
    },
    [activePhaseIndex]
  );

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    if (reduceMotion) {
      setReduceMotion(false);
      setIsPlaying(true);
      return;
    }

    setIsPlaying(true);
  }, [isPlaying, reduceMotion]);

  const handlePrev = useCallback(() => {
    handleRequestNavigate('prev');
  }, [handleRequestNavigate]);

  const handleNext = useCallback(() => {
    handleRequestNavigate('next');
  }, [handleRequestNavigate]);

  const handleReset = useCallback(() => {
    lastTimeRef.current = null;
    setIsPlaying(false);
    setProgress(0);
  }, []);

  const handleToggleReduceMotion = useCallback(() => {
    setReduceMotion((previous) => {
      const next = !previous;
      if (next) {
        resumeOnMotionRef.current = isPlaying;
        setIsPlaying(false);
      } else {
        setIsPlaying(resumeOnMotionRef.current);
        resumeOnMotionRef.current = false;
      }
      return next;
    });
  }, [isPlaying]);

  return (
    <section
      role="region"
      aria-labelledby="violence-loop-heading"
      className="space-y-8 rounded-3xl border border-base-800/60 bg-base-950/70 p-8 text-base-50 shadow-2xl shadow-base-950/50 backdrop-blur"
    >
      <div className="space-y-2 text-center">
        <h2 id="violence-loop-heading" className="text-3xl font-semibold text-base-50 sm:text-4xl">
          {t('loop.title')}
        </h2>
        <p className="text-base-200">{t('loop.subtitle')}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
        <div className="space-y-6">
          <InfinityDiagram
            phases={phasesWithContent}
            progress={progress}
            activePhaseId={activePhase.id}
            onSelectPhase={handleSelectPhase}
            onRequestNavigate={handleRequestNavigate}
            diagramLabel={t('loop.diagram.label')}
            instructions={t('loop.diagram.instructions')}
            phaseOrderLabel={t('loop.diagram.order')}
            isPlaying={isPlaying && !reduceMotion}
            reducedMotion={reduceMotion}
          />

          <LoopControls
            isPlaying={isPlaying && !reduceMotion}
            reduceMotion={reduceMotion}
            onTogglePlay={handleTogglePlay}
            onPrev={handlePrev}
            onNext={handleNext}
            onReset={handleReset}
            onToggleReduceMotion={handleToggleReduceMotion}
            playLabel={t('loop.controls.play')}
            pauseLabel={t('loop.controls.pause')}
            prevLabel={t('loop.controls.prev')}
            nextLabel={t('loop.controls.next')}
            resetLabel={t('loop.controls.reset')}
            reduceMotionLabel={t('loop.controls.reduceMotion')}
            toolbarLabel={t('loop.controls.label')}
          />
        </div>

        <PhaseDetails
          title={activePhase.title}
          summary={activePhase.summary}
          examples={activePhase.examples}
          tips={activePhase.tips}
          definitionLabel={t('loop.details.definition')}
          examplesLabel={t('loop.details.examples')}
          tipsLabel={t('loop.details.tips')}
          ctaLabel={t('loop.details.cta')}
          resourcesLabel={t('loop.details.resources')}
        />
      </div>

      <p aria-live="polite" role="status" className="sr-only">
        {statusMessage}
      </p>
    </section>
  );
}
