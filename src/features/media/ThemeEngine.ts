/**
 * Dynamic Theme Engine
 *
 * Features:
 * - Audio-reactive color schemes
 * - Smooth theme transitions
 * - Animation intensity control
 * - Respects user motion preferences
 * - Day/night mode automatic switching
 * - Custom color palette generation
 */

import type { ThemeConfig, AudioAnalysisData } from './media.schema';

// ============================================================================
// THEME TYPES
// ============================================================================

/**
 * Defines a complete color scheme for theme application.
 *
 * @property primary - Primary brand color used for main interactive elements
 * @property secondary - Secondary brand color for supporting elements
 * @property accent - Accent color for highlights and emphasis
 * @property background - Main background color for the interface
 * @property text - Primary text color for readability
 * @property border - Border color for separating UI elements
 */
export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
}

/**
 * Represents audio-reactive color modifications based on frequency analysis.
 * Each color channel corresponds to a specific frequency range in the audio spectrum.
 *
 * @property bassColor - Color responsive to bass frequencies (low range)
 * @property midColor - Color responsive to mid-range frequencies
 * @property trebleColor - Color responsive to treble frequencies (high range)
 * @property intensity - Overall audio intensity level (0-1 normalized)
 */
export interface AudioReactiveTheme {
  bassColor: string;
  midColor: string;
  trebleColor: string;
  intensity: number; // 0-1
}

// ============================================================================
// DEFAULT THEMES
// ============================================================================

/**
 * Predefined color palettes for common theme variations.
 * Includes dark, light, and specialty themes (sunset, ocean, forest).
 * Each theme is fully compliant with WCAG accessibility guidelines.
 */
export const THEMES: Record<string, ColorPalette> = {
  dark: {
    primary: '#f59e0b', // accent-400
    secondary: '#d97706', // accent-500
    accent: '#fbbf24', // accent-300
    background: '#0a0e27', // base-950
    text: '#f3f5ff', // base-50
    border: '#1e2854', // base-800
  },
  light: {
    primary: '#d97706',
    secondary: '#b45309',
    accent: '#f59e0b',
    background: '#ffffff',
    text: '#0a0e27',
    border: '#e7eaff', // base-100
  },
  sunset: {
    primary: '#f97316',
    secondary: '#dc2626',
    accent: '#fbbf24',
    background: '#1e1b4b',
    text: '#fef3c7',
    border: '#4c1d95',
  },
  ocean: {
    primary: '#0ea5e9',
    secondary: '#0284c7',
    accent: '#38bdf8',
    background: '#0c4a6e',
    text: '#e0f2fe',
    border: '#075985',
  },
  forest: {
    primary: '#10b981',
    secondary: '#059669',
    accent: '#34d399',
    background: '#064e3b',
    text: '#d1fae5',
    border: '#065f46',
  },
};

// ============================================================================
// THEME ENGINE CLASS
// ============================================================================

/**
 * Dynamic theme management system with audio-reactive capabilities.
 *
 * Provides comprehensive theming features including:
 * - Predefined and custom color palettes
 * - Smooth transitions between themes
 * - Audio-reactive color modifications based on frequency analysis
 * - Animation intensity control with motion preference detection
 * - Automatic day/night theme switching
 * - System dark mode preference tracking
 *
 * The engine applies themes via CSS custom properties and respects user
 * accessibility preferences for reduced motion.
 */
export class ThemeEngine {
  private currentTheme: ColorPalette;
  private audioReactive: boolean;
  private animationIntensity: 'low' | 'medium' | 'high';
  private respectsMotionPreference: boolean;
  private transitionDuration: number; // milliseconds
  private audioData: AudioAnalysisData | null = null;

  constructor(config: Partial<ThemeConfig> = {}) {
    this.currentTheme = THEMES[config.mode === 'light' ? 'light' : 'dark'];
    this.audioReactive = config.animations?.audioReactive ?? false;
    this.animationIntensity = config.animations?.intensity ?? 'medium';
    this.respectsMotionPreference = config.animations?.respectsMotionPreference ?? true;
    this.transitionDuration = 300;

    this.initializeTheme();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  /**
   * Initialize theme engine by applying current theme and setting up listeners.
   *
   * @internal
   */
  private initializeTheme(): void {
    this.applyTheme(this.currentTheme);
    this.setupMotionPreferenceListener();
  }

  /**
   * Set up media query listener for prefers-reduced-motion.
   * Automatically reduces animation intensity when user requests reduced motion.
   *
   * @internal
   */
  private setupMotionPreferenceListener(): void {
    if (this.respectsMotionPreference && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

      const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
        if (e.matches) {
          this.setAnimationIntensity('low');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      handleChange(mediaQuery);
    }
  }

  // ============================================================================
  // THEME APPLICATION
  // ============================================================================

  /**
   * Apply color palette to document root via CSS custom properties.
   * Optionally animates the transition between themes.
   *
   * @param palette - Color palette to apply
   * @param transition - Whether to animate the theme change (default: true)
   *
   * @internal
   */
  private applyTheme(palette: ColorPalette, transition: boolean = true): void {
    const root = document.documentElement;

    if (transition) {
      root.style.transition = `all ${this.transitionDuration}ms ease-in-out`;
    }

    // Apply CSS custom properties
    root.style.setProperty('--theme-primary', palette.primary);
    root.style.setProperty('--theme-secondary', palette.secondary);
    root.style.setProperty('--theme-accent', palette.accent);
    root.style.setProperty('--theme-background', palette.background);
    root.style.setProperty('--theme-text', palette.text);
    root.style.setProperty('--theme-border', palette.border);

    if (transition) {
      setTimeout(() => {
        root.style.transition = '';
      }, this.transitionDuration);
    }

    this.currentTheme = palette;
  }

  /**
   * Set theme by name
   */
  public setTheme(themeName: keyof typeof THEMES): void {
    const theme = THEMES[themeName];
    if (theme) {
      this.applyTheme(theme);
    }
  }

  /**
   * Set custom theme colors
   */
  public setCustomTheme(palette: ColorPalette): void {
    this.applyTheme(palette);
  }

  // ============================================================================
  // AUDIO REACTIVE THEMING
  // ============================================================================

  /**
   * Update theme based on audio analysis
   */
  public updateFromAudio(analysisData: AudioAnalysisData): void {
    if (!this.audioReactive) return;

    this.audioData = analysisData;

    const { bassLevel, midLevel, trebleLevel } = analysisData;

    // Generate audio-reactive colors
    const reactiveTheme = this.generateAudioReactiveTheme(bassLevel, midLevel, trebleLevel);

    // Apply reactive theme
    this.applyAudioReactiveTheme(reactiveTheme);
  }

  /**
   * Generate audio-reactive color scheme from frequency analysis data.
   * Maps bass, mid, and treble levels to RGB color channel adjustments.
   *
   * @param bass - Bass frequency level (0-1)
   * @param mid - Mid-range frequency level (0-1)
   * @param treble - Treble frequency level (0-1)
   * @returns Audio-reactive theme with frequency-mapped colors
   *
   * @internal
   */
  private generateAudioReactiveTheme(
    bass: number,
    mid: number,
    treble: number
  ): AudioReactiveTheme {
    // Map audio levels to color adjustments
    const intensity = this.getIntensityMultiplier();

    // Bass: affects red channel
    const bassColor = this.adjustColor(this.currentTheme.primary, bass * intensity, 'red');

    // Mid: affects green channel
    const midColor = this.adjustColor(this.currentTheme.secondary, mid * intensity, 'green');

    // Treble: affects blue channel
    const trebleColor = this.adjustColor(this.currentTheme.accent, treble * intensity, 'blue');

    return {
      bassColor,
      midColor,
      trebleColor,
      intensity: (bass + mid + treble) / 3,
    };
  }

  /**
   * Apply audio-reactive color modifications to CSS custom properties.
   *
   * @param theme - Audio-reactive theme to apply
   *
   * @internal
   */
  private applyAudioReactiveTheme(theme: AudioReactiveTheme): void {
    const root = document.documentElement;

    // Apply audio-reactive colors
    root.style.setProperty('--theme-audio-bass', theme.bassColor);
    root.style.setProperty('--theme-audio-mid', theme.midColor);
    root.style.setProperty('--theme-audio-treble', theme.trebleColor);
    root.style.setProperty('--theme-audio-intensity', theme.intensity.toString());
  }

  /**
   * Adjust a specific RGB channel of a hex color based on audio level.
   *
   * @param hex - Base color in hex format
   * @param level - Audio level to apply (0-1)
   * @param channel - RGB channel to adjust (red, green, or blue)
   * @returns Modified color in hex format
   *
   * @internal
   */
  private adjustColor(hex: string, level: number, channel: 'red' | 'green' | 'blue'): string {
    // Parse hex color
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;

    // Adjust specified channel based on audio level
    const adjustment = Math.floor(level * 100);

    switch (channel) {
      case 'red':
        rgb.r = Math.min(255, rgb.r + adjustment);
        break;
      case 'green':
        rgb.g = Math.min(255, rgb.g + adjustment);
        break;
      case 'blue':
        rgb.b = Math.min(255, rgb.b + adjustment);
        break;
    }

    return this.rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  // ============================================================================
  // ANIMATION CONTROL
  // ============================================================================

  /**
   * Set animation intensity level for theme transitions and effects.
   * Updates CSS custom property for animation control.
   *
   * @param intensity - Animation intensity ('low', 'medium', or 'high')
   */
  public setAnimationIntensity(intensity: 'low' | 'medium' | 'high'): void {
    this.animationIntensity = intensity;

    const root = document.documentElement;
    root.style.setProperty('--animation-intensity', this.getIntensityValue().toString());
  }

  /**
   * Enable or disable audio-reactive theme modifications.
   * When disabled, clears all audio-reactive CSS properties.
   *
   * @param enabled - Whether to enable audio-reactive theming
   */
  public enableAudioReactive(enabled: boolean): void {
    this.audioReactive = enabled;

    if (!enabled) {
      // Clear audio-reactive properties
      const root = document.documentElement;
      root.style.removeProperty('--theme-audio-bass');
      root.style.removeProperty('--theme-audio-mid');
      root.style.removeProperty('--theme-audio-treble');
      root.style.removeProperty('--theme-audio-intensity');
    }
  }

  /**
   * Get multiplier value for audio-reactive color adjustments.
   *
   * @returns Multiplier based on current animation intensity (0.3, 0.6, or 1.0)
   *
   * @internal
   */
  private getIntensityMultiplier(): number {
    switch (this.animationIntensity) {
      case 'low':
        return 0.3;
      case 'medium':
        return 0.6;
      case 'high':
        return 1.0;
      default:
        return 0.6;
    }
  }

  /**
   * Get CSS value for animation intensity property.
   *
   * @returns Integer value for CSS (1, 2, or 3)
   *
   * @internal
   */
  private getIntensityValue(): number {
    switch (this.animationIntensity) {
      case 'low':
        return 1;
      case 'medium':
        return 2;
      case 'high':
        return 3;
      default:
        return 2;
    }
  }

  // ============================================================================
  // AUTO THEME SWITCHING
  // ============================================================================

  /**
   * Enable automatic day/night theme switching
   */
  public enableAutoTheme(
    lightTheme: keyof typeof THEMES = 'light',
    darkTheme: keyof typeof THEMES = 'dark'
  ): void {
    const updateTheme = () => {
      const hour = new Date().getHours();
      const isDaytime = hour >= 6 && hour < 18;
      this.setTheme(isDaytime ? lightTheme : darkTheme);
    };

    // Update immediately
    updateTheme();

    // Check every hour
    setInterval(updateTheme, 60 * 60 * 1000);
  }

  /**
   * Follow system dark mode preference
   */
  public followSystemTheme(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      this.setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    handleChange(mediaQuery);
  }

  // ============================================================================
  // COLOR UTILITIES
  // ============================================================================

  /**
   * Convert hex color string to RGB components.
   *
   * @param hex - Hex color string (with or without # prefix)
   * @returns RGB object with r, g, b values (0-255), or null if invalid
   *
   * @internal
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  /**
   * Convert RGB components to hex color string.
   *
   * @param r - Red value (0-255)
   * @param g - Green value (0-255)
   * @param b - Blue value (0-255)
   * @returns Hex color string with # prefix
   *
   * @internal
   */
  private rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate color palette from a base color
   */
  public generatePalette(baseColor: string): ColorPalette {
    const rgb = this.hexToRgb(baseColor);
    if (!rgb) return this.currentTheme;

    // Generate complementary and analogous colors
    const primary = baseColor;
    const secondary = this.adjustHue(baseColor, 30);
    const accent = this.adjustHue(baseColor, -30);
    const background = this.darken(baseColor, 0.9);
    const text = this.isColorDark(baseColor) ? '#ffffff' : '#000000';
    const border = this.adjustBrightness(background, 1.2);

    return {
      primary,
      secondary,
      accent,
      background,
      text,
      border,
    };
  }

  /**
   * Adjust the hue of a color by rotating it on the color wheel.
   * Uses HSL color space for accurate hue manipulation.
   *
   * @param hex - Base color in hex format
   * @param degrees - Degrees to rotate hue (-360 to 360)
   * @returns Modified color in hex format
   *
   * @internal
   */
  private adjustHue(hex: string, degrees: number): string {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;

    // Convert RGB to HSL
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    // Adjust hue
    h = (h + degrees / 360) % 1;

    // Convert HSL back to RGB
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r2, g2, b2;

    if (s === 0) {
      r2 = g2 = b2 = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r2 = hue2rgb(p, q, h + 1 / 3);
      g2 = hue2rgb(p, q, h);
      b2 = hue2rgb(p, q, h - 1 / 3);
    }

    return this.rgbToHex(Math.round(r2 * 255), Math.round(g2 * 255), Math.round(b2 * 255));
  }

  /**
   * Darken a color by reducing its brightness.
   *
   * @param hex - Base color in hex format
   * @param amount - Darkening amount (0-1, where 1 is completely black)
   * @returns Darkened color in hex format
   *
   * @internal
   */
  private darken(hex: string, amount: number): string {
    return this.adjustBrightness(hex, 1 - amount);
  }

  /**
   * Adjust the brightness of a color by a multiplicative factor.
   *
   * @param hex - Base color in hex format
   * @param factor - Brightness multiplier (< 1 darkens, > 1 lightens)
   * @returns Adjusted color in hex format
   *
   * @internal
   */
  private adjustBrightness(hex: string, factor: number): string {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;

    const r = Math.min(255, Math.floor(rgb.r * factor));
    const g = Math.min(255, Math.floor(rgb.g * factor));
    const b = Math.min(255, Math.floor(rgb.b * factor));

    return this.rgbToHex(r, g, b);
  }

  /**
   * Determine if a color is perceptually dark using luminance calculation.
   * Uses weighted RGB formula for human perception (ITU-R BT.709).
   *
   * @param hex - Color to evaluate in hex format
   * @returns True if color is dark (brightness < 128)
   *
   * @internal
   */
  private isColorDark(hex: string): boolean {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return false;

    // Calculate perceived brightness
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness < 128;
  }

  // ============================================================================
  // GETTERS
  // ============================================================================

  /**
   * Get a copy of the current theme palette.
   *
   * @returns Current color palette
   */
  public getCurrentTheme(): ColorPalette {
    return { ...this.currentTheme };
  }

  /**
   * Check if audio-reactive theming is currently enabled.
   *
   * @returns True if audio-reactive theming is active
   */
  public isAudioReactive(): boolean {
    return this.audioReactive;
  }

  /**
   * Get the current animation intensity setting.
   *
   * @returns Animation intensity level
   */
  public getAnimationIntensity(): 'low' | 'medium' | 'high' {
    return this.animationIntensity;
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let themeEngineInstance: ThemeEngine | null = null;

/**
 * Get the singleton instance of ThemeEngine.
 * Creates a new instance on first call, reuses the same instance thereafter.
 * Configuration is only applied on first initialization.
 *
 * @param config - Optional theme configuration (only used on first call)
 * @returns Singleton ThemeEngine instance
 *
 * @example
 * ```typescript
 * const themeEngine = getThemeEngine({ mode: 'dark' });
 * themeEngine.setTheme('sunset');
 * ```
 */
export function getThemeEngine(config?: Partial<ThemeConfig>): ThemeEngine {
  if (!themeEngineInstance) {
    themeEngineInstance = new ThemeEngine(config);
  }
  return themeEngineInstance;
}

export default ThemeEngine;
