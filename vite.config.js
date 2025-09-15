import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2,woff}'],
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          // Never cache streaming files - always fetch from network
          {
            urlPattern: /^https:\/\/.*\.(m3u8|ts)$/,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /\/stream/,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /\.php$/,
            handler: 'NetworkOnly',
          },
          // Cache audio files with versioning
          {
            urlPattern: /^https:\/\/.*\.(mp3|wav|ogg|aac)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheKeyWillBeUsed: async ({ request }) => {
                return `${request.url}?v=${Date.now()}`;
              },
            },
          },
          // Cache images with optimization
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          // Cache external APIs with network first
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5, // 5 minutes
              },
            },
          },
        ],
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Radio Adamowo - Educational Web Radio',
        short_name: 'Adamowo',
        description: 'Progressive web radio application with educational content about psychological manipulation and toxic relationships',
        theme_color: '#f59e0b',
        background_color: '#121212',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        categories: ['education', 'entertainment', 'lifestyle'],
        lang: 'pl-PL',
        dir: 'ltr',
        icons: [
          {
            src: '/images/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: '/images/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: '/images/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: '/images/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: '/images/icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: '/images/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/images/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: '/images/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          }
        ],
        shortcuts: [
          {
            name: 'Start Radio',
            short_name: 'Radio',
            description: 'Start listening to Radio Adamowo',
            url: '/?source=pwa-shortcut',
            icons: [{ src: '/images/icons/shortcut-radio.png', sizes: '192x192' }]
          },
          {
            name: 'Educational Content',
            short_name: 'Learn',
            description: 'Access educational materials',
            url: '/learn?source=pwa-shortcut',
            icons: [{ src: '/images/icons/shortcut-learn.png', sizes: '192x192' }]
          }
        ],
        screenshots: [
          {
            src: '/images/screenshots/mobile-1.png',
            type: 'image/png',
            sizes: '540x720',
            form_factor: 'narrow'
          },
          {
            src: '/images/screenshots/desktop-1.png',
            type: 'image/png',
            sizes: '1280x720',
            form_factor: 'wide'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@styles': resolve(__dirname, 'src/styles'),
    }
  },
  server: {
    port: 3000,
    host: true,
    strictPort: true,
    hmr: {
      overlay: true
    }
  },
  preview: {
    port: 4000,
    host: true,
    strictPort: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: process.env.NODE_ENV === 'development',
    minify: 'esbuild',
    target: ['es2020', 'chrome80', 'firefox78', 'safari14'],
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['gsap', 'hls.js', 'chart.js'],
          audio: ['hls.js'],
          ui: ['gsap'],
          charts: ['chart.js']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    },
    // Performance budget
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['hls.js', 'gsap', 'chart.js'],
    exclude: ['workbox-build']
  },
  css: {
    postcss: {
      plugins: [
        require('autoprefixer'),
        require('cssnano')({
          preset: 'default'
        })
      ]
    }
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
});