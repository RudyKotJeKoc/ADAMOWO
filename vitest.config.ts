import { defineConfig } from 'vitest/config';
import path from 'node:path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom', // potrzebne dla Reacta
    globals: true,
    setupFiles: ['./tests/setup.ts'], // wspólny setup
    css: true, // pozwól importować CSS w testach
  },
});
