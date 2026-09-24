import type { Config } from 'tailwindcss';

/**
 * Paleta Neon/Dashboard - wartości kanałów RGB żyją w `src/app.css` (:root),
 * dzięki czemu cały motyw zmienia się w jednym miejscu, a modyfikatory
 * przezroczystości Tailwinda (np. `bg-base-900/70`) nadal działają.
 */
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;
const scale = (name: string, steps: number[]) =>
  Object.fromEntries(steps.map((step) => [step, token(`${name}-${step}`)]));

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Matowe, grafitowe tła + złamana biel dla tekstu
        base: scale('base', [50, 100, 200, 300, 400, 500, 600, 700, 800, 850, 900, 925, 950]),
        // Neonowy cyjan - nawigacja, nagłówki, ramki, akcje
        accent: scale('accent', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        // Neonowa zieleń - statusy poprawne, aktywne wskaźniki, kluczowe dane
        neon: scale('neon', [200, 300, 400, 500, 600]),
        // Neonowy fiolet - metadane, tagi, drugorzędne akcenty
        plasma: scale('plasma', [200, 300, 400, 500, 600]),
        // Czerwony tylko dla ON AIR / alarmów / red flags
        danger: scale('danger', [400, 500, 600, 700]),
      },
      fontFamily: {
        // Czysty, czytelny font dla treści
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        // Font dla body/treści (zgodny z --font-body)
        body: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        // Maszynowy/dokumentowy font dla nagłówków i etykiet
        display: ['IBM Plex Mono', 'Courier New', 'ui-monospace', 'monospace'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        focus: '0 0 0 3px rgb(var(--accent-400) / 0.45)',
        'glow-sm': '0 0 8px rgb(var(--accent-400) / 0.35)',
        glow: '0 0 16px rgb(var(--accent-400) / 0.3), 0 0 2px rgb(var(--accent-400) / 0.6)',
        'glow-neon': '0 0 14px rgb(var(--neon-400) / 0.35), 0 0 2px rgb(var(--neon-400) / 0.7)',
        'glow-plasma':
          '0 0 14px rgb(var(--plasma-400) / 0.35), 0 0 2px rgb(var(--plasma-400) / 0.7)',
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        'neon-pulse': 'neon-pulse 2.4s ease-in-out infinite',
      },
    },
  },
} satisfies Config;
