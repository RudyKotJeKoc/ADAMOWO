/**
 * Slideshow Component
 *
 * Advanced slideshow for images and videos with:
 * - Auto-play with configurable intervals
 * - Smooth transitions (fade, slide, zoom)
 * - Video playback support
 * - Keyboard navigation
 * - Touch/swipe support (via pointer events)
 * - Progress indicators
 * - Fullscreen mode
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSlideshowStore } from '../../state/media';

interface SlideshowProps {
  className?: string;
  showThumbnails?: boolean;
  enableKeyboard?: boolean;
  enableTouch?: boolean;
}

export function Slideshow({
  className = '',
  showThumbnails = true,
  enableKeyboard = true,
  enableTouch = true,
}: SlideshowProps): JSX.Element {
  const { t } = useTranslation();
  const {
    items,
    currentIndex,
    isPlaying,
    isTransitioning,
    config,
    setCurrentIndex,
    setPlaying,
    setTransitioning,
    next,
    previous,
  } = useSlideshowStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  // handleNext's identity changes whenever isTransitioning toggles (twice per
  // slide, at transition start and end), but the auto-play effect below
  // should only reset its timer once per slide, on currentIndex change. This
  // ref lets the interval call the latest handleNext without depending on
  // its identity and re-running (and re-resetting the countdown) an extra
  // time per cycle.
  const handleNextRef = useRef<() => void>(() => {});

  const currentItem = items[currentIndex] || null;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  // ============================================================================
  // AUTO-PLAY
  // ============================================================================

  useEffect(() => {
    if (!isPlaying || !config.autoPlay || items.length === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Determine interval based on current item type
    const interval =
      currentItem?.type === 'video' ? currentItem.duration || config.interval : config.interval;

    intervalRef.current = setInterval(() => {
      handleNextRef.current();
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, config.autoPlay, config.interval, currentIndex, items.length, currentItem]);

  // ============================================================================
  // NAVIGATION
  // ============================================================================

  const handleNext = useCallback(() => {
    if (isTransitioning) return;

    setTransitioning(true);
    setTimeout(() => {
      next();
      setTransitioning(false);
    }, config.transitionDuration);
  }, [isTransitioning, config.transitionDuration, next, setTransitioning]);

  handleNextRef.current = handleNext;

  const handlePrevious = useCallback(() => {
    if (isTransitioning) return;

    setTransitioning(true);
    setTimeout(() => {
      previous();
      setTransitioning(false);
    }, config.transitionDuration);
  }, [isTransitioning, config.transitionDuration, previous, setTransitioning]);

  const handleJumpTo = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex) return;

      setTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setTransitioning(false);
      }, config.transitionDuration);
    },
    [isTransitioning, currentIndex, config.transitionDuration, setCurrentIndex, setTransitioning]
  );

  // ============================================================================
  // FULLSCREEN
  // ============================================================================
  // Declared before KEYBOARD NAVIGATION below (rather than in its original
  // position after VIDEO HANDLING) because that effect's dependency array
  // needs exitFullscreen to already be initialized — a dependency array is
  // evaluated synchronously on every render, unlike an effect body, so
  // referencing a later `const` there would hit its temporal dead zone.

  const enterFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (
      'webkitRequestFullscreen' in container &&
      typeof container.webkitRequestFullscreen === 'function'
    ) {
      container.webkitRequestFullscreen();
    } else if (
      'mozRequestFullScreen' in container &&
      typeof container.mozRequestFullScreen === 'function'
    ) {
      container.mozRequestFullScreen();
    }

    setIsFullscreen(true);
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (
      'webkitExitFullscreen' in document &&
      typeof document.webkitExitFullscreen === 'function'
    ) {
      document.webkitExitFullscreen();
    } else if (
      'mozCancelFullScreen' in document &&
      typeof document.mozCancelFullScreen === 'function'
    ) {
      document.mozCancelFullScreen();
    }

    setIsFullscreen(false);
  }, []);

  // ============================================================================
  // KEYBOARD NAVIGATION
  // ============================================================================

  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          handlePrevious();
          break;
        case ' ':
          e.preventDefault();
          setPlaying(!isPlaying);
          break;
        case 'Escape':
          if (isFullscreen) {
            exitFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // exitFullscreen is stable (useCallback with an empty dep array), so
    // adding it here doesn't change how often this effect re-runs.
  }, [
    enableKeyboard,
    isPlaying,
    isFullscreen,
    handleNext,
    handlePrevious,
    setPlaying,
    exitFullscreen,
  ]);

  // ============================================================================
  // TOUCH/SWIPE NAVIGATION
  // ============================================================================

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enableTouch) return;
      touchStartRef.current = { x: e.clientX, y: e.clientY };
    },
    [enableTouch]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!enableTouch || !touchStartRef.current) return;

      const deltaX = e.clientX - touchStartRef.current.x;
      const deltaY = e.clientY - touchStartRef.current.y;
      const threshold = 50; // minimum swipe distance

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          handlePrevious();
        } else {
          handleNext();
        }
      }

      touchStartRef.current = null;
    },
    [enableTouch, handleNext, handlePrevious]
  );

  // ============================================================================
  // VIDEO HANDLING
  // ============================================================================

  useEffect(() => {
    const video = videoRef.current;
    if (!video || currentItem?.type !== 'video') return;

    setVideoError(null);

    const handleVideoEnd = () => {
      if (isPlaying) {
        handleNext();
      }
    };

    const handleVideoError = () => {
      setVideoError(t('multimedia.slideshow.videoError', 'Failed to load video'));
    };

    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('error', handleVideoError);

    return () => {
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('error', handleVideoError);
    };
  }, [currentItem, isPlaying, handleNext, t]);

  // Auto-play video when it becomes current
  useEffect(() => {
    const video = videoRef.current;
    if (video && currentItem?.type === 'video' && isPlaying) {
      video.play().catch((error) => {
        console.error('Failed to play video:', error);
        setVideoError(t('multimedia.slideshow.autoplayBlocked', 'Autoplay blocked'));
      });
    }
  }, [currentIndex, currentItem, isPlaying, t]);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // ============================================================================
  // TRANSITION STYLES
  // ============================================================================

  const getTransitionClass = () => {
    const duration = `duration-${Math.min(1000, config.transitionDuration)}`;

    switch (config.transition) {
      case 'fade':
        return `transition-opacity ${duration} ${isTransitioning ? 'opacity-0' : 'opacity-100'}`;
      case 'slide':
        return `transition-transform ${duration} ${isTransitioning ? 'translate-x-full' : 'translate-x-0'}`;
      case 'zoom':
        return `transition-transform ${duration} ${isTransitioning ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`;
      default:
        return '';
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-base-900 rounded-lg p-8 ${className}`}>
        <p className="text-base-400">
          {t('multimedia.slideshow.noItems', 'No media items to display')}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-base-950 rounded-lg overflow-hidden ${className}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* Main display area */}
      <div className="relative aspect-video bg-base-900">
        {currentItem ? (
          <div
            className={`absolute inset-0 flex items-center justify-center ${getTransitionClass()}`}
          >
            {currentItem.type === 'image' ? (
              <img
                src={currentItem.url}
                alt={currentItem.title || 'Slide'}
                className="max-w-full max-h-full object-contain"
                loading="lazy"
              />
            ) : (
              <video
                ref={videoRef}
                src={currentItem.url}
                className="max-w-full max-h-full object-contain"
                controls={!isPlaying}
                muted={false}
                playsInline
              >
                {t(
                  'multimedia.slideshow.videoNotSupported',
                  'Your browser does not support video playback'
                )}
              </video>
            )}

            {videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-base-900/80">
                <p className="text-red-400">{videoError}</p>
              </div>
            )}
          </div>
        ) : null}

        {/* Media info overlay */}
        {currentItem && (currentItem.title || currentItem.description) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-base-950/90 to-transparent p-4">
            {currentItem.title && (
              <h3 className="text-base-100 font-medium">{currentItem.title}</h3>
            )}
            {currentItem.description && (
              <p className="text-base-400 text-sm mt-1">{currentItem.description}</p>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      {config.showControls && (
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex items-center justify-between px-4 pointer-events-none">
          <button
            onClick={handlePrevious}
            disabled={isTransitioning}
            className="pointer-events-auto bg-base-900/80 hover:bg-base-800 disabled:opacity-50 text-base-100 p-3 rounded-full transition-colors"
            aria-label={t('multimedia.slideshow.previous', 'Previous')}
          >
            ←
          </button>
          <button
            onClick={handleNext}
            disabled={isTransitioning}
            className="pointer-events-auto bg-base-900/80 hover:bg-base-800 disabled:opacity-50 text-base-100 p-3 rounded-full transition-colors"
            aria-label={t('multimedia.slideshow.next', 'Next')}
          >
            →
          </button>
        </div>
      )}

      {/* Bottom controls bar */}
      <div className="flex items-center justify-between gap-4 p-4 bg-base-900">
        <button
          onClick={() => setPlaying(!isPlaying)}
          className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-base-950 font-medium rounded-lg transition-colors"
          aria-label={
            isPlaying
              ? t('multimedia.slideshow.pause', 'Pause')
              : t('multimedia.slideshow.play', 'Play')
          }
        >
          {isPlaying ? '⏸' : '▶'}{' '}
          {isPlaying
            ? t('multimedia.slideshow.pause', 'Pause')
            : t('multimedia.slideshow.play', 'Play')}
        </button>

        {config.showProgress && (
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-base-400">
              <span>
                {currentIndex + 1} / {items.length}
              </span>
              <div className="flex-1 bg-base-800 rounded-full h-2">
                <div
                  className="bg-accent-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <button
          onClick={isFullscreen ? exitFullscreen : enterFullscreen}
          className="px-4 py-2 bg-base-800 hover:bg-base-700 text-base-100 rounded-lg transition-colors"
          aria-label={
            isFullscreen
              ? t('multimedia.slideshow.exitFullscreen', 'Exit fullscreen')
              : t('multimedia.slideshow.fullscreen', 'Fullscreen')
          }
        >
          {isFullscreen ? '⤓' : '⤢'}
        </button>
      </div>

      {/* Thumbnails */}
      {showThumbnails && items.length > 1 && (
        <div className="flex gap-2 p-4 bg-base-900 overflow-x-auto">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleJumpTo(index)}
              className={`flex-shrink-0 w-20 h-20 rounded overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-accent-500 ring-2 ring-accent-500/50'
                  : 'border-transparent hover:border-base-600'
              }`}
              aria-label={`${t('multimedia.slideshow.goTo', 'Go to')} ${item.title || `slide ${index + 1}`}`}
            >
              <img
                src={item.thumbnailUrl || item.url}
                alt={item.title || `Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-base-950/50">
                  <span className="text-white text-xl">▶</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Slideshow;
