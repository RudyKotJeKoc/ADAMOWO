import { type ReactElement, useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import clsx from 'clsx';

/**
 * Props for the LazyImage component.
 */
export interface LazyImageProps {
  /** Image source URL */
  src: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional CSS class name */
  className?: string;
  /** Optional placeholder image while loading */
  placeholderSrc?: string;
  /** Aspect ratio (e.g., "16/9", "4/3", "1/1") */
  aspectRatio?: string;
  /** Object fit behavior */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  /** Callback when image loads successfully */
  onLoad?: () => void;
  /** Callback when image fails to load */
  onError?: () => void;
  /** Intersection observer root margin (default: "50px") */
  rootMargin?: string;
}

/**
 * LazyImage component with intersection observer for performance optimization.
 *
 * Implements lazy loading to reduce initial page load time and bandwidth usage.
 * Images are only loaded when they enter the viewport, with smooth fade-in
 * animations and placeholder support.
 *
 * Features:
 * - Intersection Observer API for efficient lazy loading
 * - Smooth fade-in animation with reduced motion support
 * - Placeholder image support
 * - Aspect ratio preservation to prevent layout shifts
 * - Error handling with graceful fallback
 * - Accessibility compliant with proper alt text
 *
 * @component
 * @example
 * ```tsx
 * <LazyImage
 *   src="/images/hero.jpg"
 *   alt="Hero banner"
 *   aspectRatio="16/9"
 *   objectFit="cover"
 * />
 * ```
 */
export function LazyImage({
  src,
  alt,
  className,
  placeholderSrc,
  aspectRatio,
  objectFit = 'cover',
  onLoad,
  onError,
  rootMargin = '50px',
}: LazyImageProps): ReactElement {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Set up Intersection Observer
  useEffect(() => {
    const currentImgRef = imgRef.current;
    if (!currentImgRef) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0.01,
      }
    );

    observer.observe(currentImgRef);

    return () => {
      if (currentImgRef) {
        observer.unobserve(currentImgRef);
      }
    };
  }, [rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const imageClasses = clsx(
    'h-full w-full transition-opacity duration-300',
    objectFit === 'cover' && 'object-cover',
    objectFit === 'contain' && 'object-contain',
    objectFit === 'fill' && 'object-fill',
    objectFit === 'none' && 'object-none',
    objectFit === 'scale-down' && 'object-scale-down'
  );

  return (
    <div
      ref={imgRef}
      className={clsx('relative overflow-hidden bg-base-900', className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-base-850">
          {placeholderSrc ? (
            <img
              src={placeholderSrc}
              alt=""
              aria-hidden="true"
              className={clsx(imageClasses, 'opacity-40 blur-sm')}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg
                className="h-12 w-12 text-base-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Actual Image */}
      {isInView && !hasError && (
        <motion.img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: isLoaded ? 1 : 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.4 }}
          className={imageClasses}
          loading="lazy"
        />
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-base-900 text-base-500">
          <svg
            className="h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="text-sm">Nie udało się załadować obrazu</span>
        </div>
      )}
    </div>
  );
}
