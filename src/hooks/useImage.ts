/**
 * useImage Hook
 *
 * React hook for managing images with automatic fallback and lazy loading support
 *
 * Features:
 * - Automatic fallback to placeholder if image fails to load
 * - Lazy loading support (loading="lazy" attribute)
 * - Validation of images (detects placeholders)
 * - Caching of validation results
 * - TypeScript type safety
 *
 * @example
 * const { src, isLoading, error } = useImage('covers', 'disco001');
 * return <img src={src} loading="lazy" alt="Cover" />;
 */

import { useState, useEffect } from 'react';
import type { ImageCategory, ImageKey } from '../config/imageMap';
import { getImagePath, IMAGE_PATHS } from '../config/imageMap';
import { checkImageExists } from '../utils/imageValidation';

type ImageRef = { [K in ImageCategory]: [K, ImageKey<K>] }[ImageCategory];

/**
 * Resolves an ImageRef tuple to a path.
 *
 * TypeScript can't distribute generic inference over a union-of-tuples
 * argument, so `getImagePath`'s own `<T>` can't be inferred here even
 * though the ImageRef union already guarantees category/key correlate.
 * The cast below is the single, narrow point that bridges that gap.
 */
function resolveImagePath(pair: ImageRef): string {
  const [category, key] = pair;
  return getImagePath(category, key as ImageKey<typeof category>);
}

export interface UseImageOptions {
  /**
   * Enable lazy loading (adds loading="lazy" attribute)
   * @default true
   */
  lazy?: boolean;

  /**
   * Fallback image if primary image fails
   * @default ['placeholders', 'cover']
   */
  fallback?: ImageRef;

  /**
   * Skip validation (use image path directly without checking)
   * Useful for external CDN images or when you're sure image exists
   * @default false
   */
  skipValidation?: boolean;

  /**
   * Callback when image loads successfully
   */
  onLoad?: () => void;

  /**
   * Callback when image fails to load
   */
  onError?: (error: Error) => void;
}

export interface UseImageReturn {
  /**
   * Image source URL (either primary or fallback)
   */
  src: string;

  /**
   * Whether image is currently being validated/loaded
   */
  isLoading: boolean;

  /**
   * Error if image failed to load
   */
  error: Error | null;

  /**
   * Whether currently showing fallback image
   */
  isFallback: boolean;

  /**
   * Loading attribute for img tag ('lazy' or 'eager')
   */
  loading: 'lazy' | 'eager';
}

/**
 * Hook for managing images with automatic fallback
 *
 * @param category - Image category from imageMap
 * @param key - Image key within category
 * @param options - Configuration options
 * @returns Image properties and state
 */
export function useImage<T extends ImageCategory>(
  category: T,
  key: ImageKey<T>,
  options: UseImageOptions = {}
): UseImageReturn {
  const {
    lazy = true,
    fallback = ['placeholders', 'cover'],
    skipValidation = false,
    onLoad,
    onError,
  } = options;

  const primaryPath = getImagePath(category, key);
  const fallbackPath = resolveImagePath(fallback);

  const [src, setSrc] = useState<string>(primaryPath);
  const [isLoading, setIsLoading] = useState<boolean>(!skipValidation);
  const [error, setError] = useState<Error | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    async function validateImage() {
      if (skipValidation) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const isValid = await checkImageExists(primaryPath);

        if (!mounted) return;

        if (isValid) {
          setSrc(primaryPath);
          setIsFallback(false);
          onLoad?.();
        } else {
          // Primary image failed, use fallback
          console.warn(
            `[useImage] Image validation failed for ${primaryPath}, using fallback: ${fallbackPath}`
          );

          setSrc(fallbackPath);
          setIsFallback(true);

          const fallbackError = new Error(`Image not found or is placeholder: ${primaryPath}`);
          setError(fallbackError);
          onError?.(fallbackError);
        }
      } catch (err) {
        if (!mounted) return;

        const imageError = err instanceof Error ? err : new Error('Unknown image error');

        console.error(`[useImage] Error loading image ${primaryPath}:`, err);

        setSrc(fallbackPath);
        setIsFallback(true);
        setError(imageError);
        onError?.(imageError);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    validateImage();

    return () => {
      mounted = false;
    };
  }, [category, key, primaryPath, fallbackPath, skipValidation, onLoad, onError]);

  return {
    src,
    isLoading,
    error,
    isFallback,
    loading: lazy ? 'lazy' : 'eager',
  };
}

/**
 * Hook for direct image path (bypasses category/key mapping)
 * Useful for external CDN images or dynamic paths
 *
 * @param imagePath - Direct image URL
 * @param options - Configuration options
 * @returns Image properties and state
 */
export function useDirectImage(
  imagePath: string,
  options: Omit<UseImageOptions, 'fallback'> & {
    fallback?: string;
  } = {}
): UseImageReturn {
  const {
    lazy = true,
    fallback = IMAGE_PATHS.placeholders.cover,
    skipValidation = false,
    onLoad,
    onError,
  } = options;

  const [src, setSrc] = useState<string>(imagePath);
  const [isLoading, setIsLoading] = useState<boolean>(!skipValidation);
  const [error, setError] = useState<Error | null>(null);
  const [isFallback, setIsFallback] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    async function validateImage() {
      if (skipValidation) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const isValid = await checkImageExists(imagePath);

        if (!mounted) return;

        if (isValid) {
          setSrc(imagePath);
          setIsFallback(false);
          onLoad?.();
        } else {
          console.warn(
            `[useDirectImage] Image validation failed for ${imagePath}, using fallback: ${fallback}`
          );

          setSrc(fallback);
          setIsFallback(true);

          const fallbackError = new Error(`Image not found or is placeholder: ${imagePath}`);
          setError(fallbackError);
          onError?.(fallbackError);
        }
      } catch (err) {
        if (!mounted) return;

        const imageError = err instanceof Error ? err : new Error('Unknown image error');

        console.error(`[useDirectImage] Error loading image ${imagePath}:`, err);

        setSrc(fallback);
        setIsFallback(true);
        setError(imageError);
        onError?.(imageError);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    validateImage();

    return () => {
      mounted = false;
    };
  }, [imagePath, fallback, skipValidation, onLoad, onError]);

  return {
    src,
    isLoading,
    error,
    isFallback,
    loading: lazy ? 'lazy' : 'eager',
  };
}

/**
 * Simple hook that just returns the image path without validation
 * Most performant option when you're sure images exist
 *
 * @param category - Image category
 * @param key - Image key
 * @returns Image path
 */
export function useImagePath<T extends ImageCategory>(category: T, key: ImageKey<T>): string {
  return getImagePath(category, key);
}
