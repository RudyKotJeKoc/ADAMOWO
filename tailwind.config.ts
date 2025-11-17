import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Ciemne studio śledcze - prawie czarne tła
        base: {
          50: '#f8fafc', // Bardzo jasny tekst (białawy)
          100: '#f1f5f9', // Jasny tekst
          200: '#cbd5e1', // Średni jasny
          300: '#94a3b8', // Średni
          400: '#64748b', // Przygaszony
          500: '#475569', // Ciemny tekst
          600: '#334155', // Bardzo ciemny tekst
          700: '#1e293b', // Ciemna powierzchnia
          800: '#0f172a', // Bardzo ciemna powierzchnia
          850: '#0a0f1e', // Prawie czarna powierzchnia
          900: '#020617', // Tło główne (slate-950)
          950: '#020617', // Tło główne (slate-950)
        },
        // Złote/bursztynowe akcenty (jak theme_color #f59e0b)
        accent: {
          200: '#fcd34d', // Jasny bursztyn
          300: '#fbbf24', // Bursztyn
          400: '#f59e0b', // Główny accent (theme_color)
          500: '#d97706', // Ciemniejszy accent
          600: '#b45309', // Bardzo ciemny accent
          700: '#92400e', // Prawie brązowy
        },
        // Czerwony tylko dla ON AIR / alarmów / red flags
        danger: {
          400: '#f87171', // Jasny czerwony
          500: '#ef4444', // Czerwony
          600: '#dc2626', // Ciemny czerwony
          700: '#b91c1c', // Bardzo ciemny czerwony
        },
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
        // Maszynowy/dokumentowy font dla nagłówków i etykiet
        display: ['IBM Plex Mono', 'Courier New', 'ui-monospace', 'monospace'],
        // Dodatkowy font dla specjalnych elementów (opcjonalny)
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        focus: '0 0 0 3px rgba(245, 158, 11, 0.4)', // Accent focus
      },
    },
  },
} satisfies Config;
