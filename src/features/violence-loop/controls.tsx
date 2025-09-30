import type { ReactElement } from 'react';
import clsx from 'clsx';

type LoopControlsProps = {
  isPlaying: boolean;
  reduceMotion: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onToggleReduceMotion: () => void;
  playLabel: string;
  pauseLabel: string;
  prevLabel: string;
  nextLabel: string;
  resetLabel: string;
  reduceMotionLabel: string;
  toolbarLabel: string;
};

export function LoopControls({
  isPlaying,
  reduceMotion,
  onTogglePlay,
  onPrev,
  onNext,
  onReset,
  onToggleReduceMotion,
  playLabel,
  pauseLabel,
  prevLabel,
  nextLabel,
  resetLabel,
  reduceMotionLabel,
  toolbarLabel
}: LoopControlsProps): ReactElement {
  return (
    <div
      role="toolbar"
      aria-label={toolbarLabel}
      className="flex flex-wrap items-center gap-3 rounded-2xl border border-base-800/60 bg-base-900/50 p-4"
    >
      <button
        type="button"
        onClick={onTogglePlay}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? pauseLabel : playLabel}
        title={isPlaying ? pauseLabel : playLabel}
        className={clsx(
          'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-base-900',
          isPlaying
            ? 'border-accent-500 bg-accent-500/20 text-accent-300'
            : 'border-base-700 bg-base-900/70 text-base-100 hover:border-accent-500/70 hover:text-accent-300'
        )}
      >
        <span aria-hidden="true">{isPlaying ? '⏸' : '▶'}</span>
        <span>{isPlaying ? pauseLabel : playLabel}</span>
      </button>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          aria-label={prevLabel}
          title={prevLabel}
          className="inline-flex items-center justify-center rounded-full border border-base-700 bg-base-900/70 px-3 py-2 text-sm font-semibold text-base-100 transition hover:border-accent-500/70 hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-base-900"
        >
          ←
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label={nextLabel}
          title={nextLabel}
          className="inline-flex items-center justify-center rounded-full border border-base-700 bg-base-900/70 px-3 py-2 text-sm font-semibold text-base-100 transition hover:border-accent-500/70 hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-base-900"
        >
          →
        </button>
      </div>

      <button
        type="button"
        onClick={onReset}
        aria-label={resetLabel}
        title={resetLabel}
        className="inline-flex items-center gap-2 rounded-full border border-base-700 bg-base-900/70 px-4 py-2 text-sm font-semibold text-base-100 transition hover:border-accent-500/70 hover:text-accent-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-base-900"
      >
        <span aria-hidden="true">⟲</span>
        <span>{resetLabel}</span>
      </button>

      <button
        type="button"
        onClick={onToggleReduceMotion}
        aria-pressed={reduceMotion}
        aria-label={reduceMotionLabel}
        title={reduceMotionLabel}
        className={clsx(
          'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-base-900',
          reduceMotion
            ? 'border-accent-500 bg-accent-500/20 text-accent-300'
            : 'border-base-700 bg-base-900/70 text-base-100 hover:border-accent-500/70 hover:text-accent-300'
        )}
      >
        <span aria-hidden="true">{reduceMotion ? '✳' : '⚡'}</span>
        <span>{reduceMotionLabel}</span>
      </button>
    </div>
  );
}
