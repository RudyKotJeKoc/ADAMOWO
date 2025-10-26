import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',            // potrzebne dla Reacta
    globals: true,
    setupFiles: ['./tests/setup.ts'], // wspólny setup
    css: true,                        // pozwól importować CSS w testach
  },
});
