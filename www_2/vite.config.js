import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(m3u8|ts)$/,
            handler: 'NetworkOnly', // Never cache streaming files
          },
          {
            urlPattern: /\/stream/,
            handler: 'NetworkOnly', // Never cache stream endpoints
          },
          {
            urlPattern: /\.php$/,
            handler: 'NetworkOnly', // Never cache PHP files
          },
          {
            urlPattern: /^https:\/\/.*\.(mp3|wav|ogg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Radio Adamowo',
        short_name: 'Adamowo',
        description: 'Radio strumieniowe z mrocznym motywem psychologicznym',
        theme_color: '#f59e0b',
        background_color: '#121212',
        display: 'standalone',
        icons: [
          {
            src: '/images/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/images/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});