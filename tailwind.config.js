/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./level2/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#f59e0b',
        'secondary': '#dc2626',
        'background': '#000000',
        'text': '#e0e0e0',
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'special': ['Special Elite', 'cursive'],
      },
    },
  },
  plugins: [],
}