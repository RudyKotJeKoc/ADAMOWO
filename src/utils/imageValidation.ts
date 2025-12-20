/**
 * Image Validation Utilities
 *
 * Utilities for detecting placeholder images and validating image files
 */

/**
 * Minimum file size for a valid image (in bytes)
 * Files smaller than this are likely placeholders (ASCII text files)
 */
const MIN_VALID_IMAGE_SIZE = 500; // 500 bytes

/**
 * Typical sizes of placeholder files found in audit
 */
const KNOWN_PLACEHOLDER_SIZES = [130, 131, 132];

/**
 * Check if an image is likely a placeholder based on file size
 *
 * @param size - File size in bytes
 * @returns true if likely a placeholder, false if likely a real image
 */
export function isPlaceholderSize(size: number): boolean {
  return (
    size < MIN_VALID_IMAGE_SIZE || KNOWN_PLACEHOLDER_SIZES.includes(size)
  );
}

/**
 * Validate if an image URL points to a real image
 *
 * @param url - Image URL to validate
 * @returns Promise<boolean> - true if valid image, false if placeholder or missing
 */
export async function isValidImage(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });

    if (!response.ok) {
      return false;
    }

    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');

    // Check content type
    if (contentType && !contentType.startsWith('image/')) {
      console.warn(`[imageValidation] Not an image: ${url} (${contentType})`);
      return false;
    }

    // Check file size
    if (contentLength) {
      const size = parseInt(contentLength, 10);
      if (isPlaceholderSize(size)) {
        console.warn(
          `[imageValidation] Placeholder detected: ${url} (${size} bytes)`
        );
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error(`[imageValidation] Error validating image: ${url}`, error);
    return false;
  }
}

/**
 * Preload an image and return whether it loaded successfully
 *
 * @param url - Image URL to preload
 * @returns Promise<boolean> - true if loaded successfully
 */
export function preloadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      // Additional check: if image is too small, it might be a placeholder
      if (img.naturalWidth < 10 || img.naturalHeight < 10) {
        console.warn(
          `[imageValidation] Suspicious image dimensions: ${url} (${img.naturalWidth}x${img.naturalHeight})`
        );
        resolve(false);
      } else {
        resolve(true);
      }
    };

    img.onerror = () => {
      console.error(`[imageValidation] Failed to load image: ${url}`);
      resolve(false);
    };

    img.src = url;
  });
}

/**
 * Check if image exists and is valid, with caching
 */
const imageValidationCache = new Map<string, boolean>();

export async function checkImageExists(
  url: string,
  useCache: boolean = true
): Promise<boolean> {
  if (useCache && imageValidationCache.has(url)) {
    return imageValidationCache.get(url)!;
  }

  const isValid = await preloadImage(url);
  imageValidationCache.set(url, isValid);

  return isValid;
}

/**
 * Clear validation cache (useful for testing or forced revalidation)
 */
export function clearValidationCache(): void {
  imageValidationCache.clear();
}

/**
 * Get validation cache stats (for debugging)
 */
export function getValidationCacheStats(): {
  size: number;
  valid: number;
  invalid: number;
} {
  let valid = 0;
  let invalid = 0;

  imageValidationCache.forEach((isValid) => {
    if (isValid) valid++;
    else invalid++;
  });

  return {
    size: imageValidationCache.size,
    valid,
    invalid,
  };
}
