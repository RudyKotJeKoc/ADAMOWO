import { defineConfig } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'framer-motion': path.resolve(__dirname, 'src/vendor/framer-motion.tsx'),
    },
  },
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React framework
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // i18n libraries
          'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          // State management
          'state-vendor': ['zustand'],
          // Supabase
          'supabase-vendor': ['@supabase/supabase-js'],
          // Utils
          utils: ['clsx'],
        },
      },
    },
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Source maps for production debugging
    sourcemap: true,
  },
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
});
