import { defineConfig } from 'vite';
import path from 'node:path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'framer-motion': path.resolve(__dirname, 'src/vendor/framer-motion.tsx')
    }
  },
  server: {
    port: 5173
  },
  preview: {
    port: 4173
  }
});
