import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        base: {
          50: '#f3f5ff',
          100: '#e7eaff',
          200: '#c5cae4',
          300: '#a3aac9',
          400: '#818aaf',
          500: '#5f6a94',
          600: '#46517a',
          700: '#2d3760',
          800: '#182148',
          850: '#111831',
          900: '#0c1125',
          950: '#0a0e27'
        },
        accent: {
          300: '#fbbf24',
          400: '#f59e0b',
          500: '#d97706',
          600: '#b45309'
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        focus: '0 0 0 3px rgba(255, 107, 53, 0.45)'
      }
    }
  }
} satisfies Config;
