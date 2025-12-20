/**
 * Centralized Image Mapping Configuration
 *
 * This file provides type-safe, centralized management of all images used in the application.
 * Benefits:
 * - Single source of truth for image paths
 * - Type-safe image references (autocomplete in IDE)
 * - Easy image replacement (change path in one place)
 * - Automatic fallback support
 * - Clear naming convention based on usage location
 *
 * Naming Convention:
 * - {section}-{purpose}-{variant?}
 * - Examples: hero-main, icon-app-512, cover-default, ui-player-background
 */

export const IMAGE_PATHS = {
  // Icons - Application icons, favicons, PWA manifest icons
  icons: {
    favicon: '/assets/images/icons/favicon.ico',
    app512: '/assets/images/icons/icon-512x512.png',
    app192: '/assets/images/icons/icon-192x192.png',
    app144: '/assets/images/icons/icon-144x144.png',
    appleTouchIcon: '/assets/images/icons/apple-touch-icon.png',
    maskable512: '/assets/images/icons/maskable-icon-512x512.png',
    maskable192: '/assets/images/icons/maskable-icon-192x192.png',
    faviconSvg: '/assets/images/icons/favicon.svg',
  },

  // Covers - Album covers, playlist covers, default music covers
  covers: {
    default: '/assets/images/placeholders/default-cover.jpg',
    disco001: '/assets/images/covers/disco-001.jpg',
    hiphop001: '/assets/images/covers/hiphop-001.jpg',
    kids001: '/assets/images/covers/kids-001.jpg',
  },

  // Hero sections - Main landing page images, featured content
  hero: {
    main: '/assets/images/hero/hero-main.jpg',
    secondary: '/assets/images/hero/hero-secondary.jpg',
  },

  // UI Elements - Logos, buttons, backgrounds
  ui: {
    logoMain: '/assets/images/ui/logo-radio-main.svg',
    logo96: '/assets/images/ui/radio-logo-96.png',
    logo256: '/assets/images/ui/radio-logo-256.png',
    logo512: '/assets/images/ui/radio-logo-512.png',
    playerBackground: '/assets/images/ui/player-background.jpg',
    studioBackground: '/assets/images/ui/studio-background.jpg',
  },

  // Screenshots - PWA manifest screenshots
  screenshots: {
    desktopHome: '/assets/images/screenshots/desktop-home.png',
    mobileHome: '/assets/images/screenshots/mobile-home.png',
    desktopPlayer: '/assets/images/screenshots/desktop-player.png',
    mobileCalendar: '/assets/images/screenshots/mobile-calendar.png',
  },

  // Placeholders - Fallback images when real images are missing
  placeholders: {
    cover: '/assets/images/placeholders/default-cover.jpg',
    avatar: '/assets/images/placeholders/default-avatar.jpg',
    thumbnail: '/assets/images/placeholders/default-thumbnail.jpg',
  },

  // Shortcuts - PWA shortcut icons
  shortcuts: {
    play: '/assets/images/icons/play-shortcut-96x96.png',
    podcast: '/assets/images/icons/podcast-shortcut-96x96.png',
    calendar: '/assets/images/icons/calendar-shortcut-96x96.png',
  },
} as const;

/**
 * Type-safe image keys
 * Usage: getImage('icons.favicon') or getImage('covers.default')
 */
export type ImageCategory = keyof typeof IMAGE_PATHS;
export type ImageKey<T extends ImageCategory> = keyof typeof IMAGE_PATHS[T];
export type ImagePath = typeof IMAGE_PATHS[ImageCategory][string];

/**
 * Get image path by category and key
 *
 * @example
 * getImagePath('icons', 'favicon') // returns '/assets/images/icons/favicon.ico'
 * getImagePath('covers', 'default') // returns '/assets/images/placeholders/default-cover.jpg'
 */
export function getImagePath<T extends ImageCategory>(
  category: T,
  key: ImageKey<T>
): string {
  return IMAGE_PATHS[category][key] as string;
}

/**
 * Get image path with fallback
 *
 * @param category - Image category (icons, covers, etc.)
 * @param key - Image key within category
 * @param fallback - Fallback category and key if primary image is missing
 * @returns Image path or fallback path
 *
 * @example
 * getImageWithFallback('covers', 'disco001', ['placeholders', 'cover'])
 */
export function getImageWithFallback<T extends ImageCategory>(
  category: T,
  key: ImageKey<T>,
  fallback: [ImageCategory, string] = ['placeholders', 'cover']
): string {
  const primaryPath = IMAGE_PATHS[category][key] as string;

  // Return primary path - actual existence check happens in useImage hook
  // This function just provides the mapping
  return primaryPath;
}

/**
 * All image paths as flat array (useful for preloading, service worker caching)
 */
export function getAllImagePaths(): string[] {
  const paths: string[] = [];

  Object.values(IMAGE_PATHS).forEach((category) => {
    Object.values(category).forEach((path) => {
      paths.push(path as string);
    });
  });

  return paths;
}

/**
 * Export for convenience
 */
export default IMAGE_PATHS;
