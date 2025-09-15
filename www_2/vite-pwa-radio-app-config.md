# Configuring `vite-plugin-pwa` for a Web Radio Application

This guide details how to configure the `vite-plugin-pwa` plugin for a Progressive Web App (PWA), such as a web radio application. The goal is to precache the core application for a robust offline experience while ensuring live content, like audio streams and API data, is always fetched from the network.

## 1. PWA Plugin Installation and Basic Setup

The `vite-plugin-pwa` is a Vite-specific plugin that simplifies the creation of a PWA, regardless of the underlying JavaScript framework (e.g., React, Vue, Svelte) [ref: 0-0]. It uses Google's Workbox library under the hood to generate and manage the service worker [ref: 0-1].

First, install the plugin as a development dependency [ref: 0-0]:
```bash
npm install vite-plugin-pwa --save-dev
```

Next, import and add `VitePWA` to the `plugins` array in your `vite.config.js` or `vite.config.ts` file [ref: 0-0]. A minimal configuration includes the `manifest` object, which provides metadata about the application, such as its name, description, and icons [ref: 0-0].

```javascript
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      manifest: {
        name: "Radio Adamowo",
        short_name: "RadioAdamowo",
        description: "An online radio PWA.",
        icons: [
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
```

## 2. Precaching Core UI Assets for Offline Use

A service worker enables offline functionality by intercepting network requests and serving assets from a cache [ref: 0-1]. `vite-plugin-pwa` automates the creation of a service worker that precaches essential application files [ref: 0-1].

By default, the plugin is configured to precache `html`, `js`, and `css` files [ref: 0-4]. To ensure all core UI assets are available offline, you must extend this list using the `workbox.globPatterns` option. This allows you to include other file types like icons, images, and fonts [ref: 0-0, ref: 0-4].

Here is an example of how to configure `globPatterns` to include common asset types:
```javascript
// In vite.config.js, inside the VitePWA plugin options
workbox: {
  globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}']
}
```
This configuration tells Workbox to find and precache all files with the specified extensions within the build output directory [ref: 0-4].

## 3. Implementing a `NetworkOnly` Strategy for Live Content

For dynamic content that must always be up-to-date, such as a live audio stream or real-time comments, a `NetworkOnly` strategy is required [ref: 0-0]. This strategy ensures that the service worker always attempts to fetch the resource from the network and does not use the cache [ref: 0-0]. This is configured using the `workbox.runtimeCaching` option, which defines rules for handling requests that are not part of the precache manifest [ref: 0-3].

### Workbox Caching Strategies

Workbox offers several caching strategies to handle runtime requests [ref: 0-0]. The most common ones are:

| Strategy | Description |
|---|---|
| `NetworkOnly` | Always attempts to fetch the request from the network. It will fail if the user is offline. Ideal for live data and non-GET requests [ref: 0-0]. |
| `CacheFirst` | Serves the response from the cache first. If the resource is not in the cache, it is requested from the network, and the response is cached for future requests [ref: 0-0]. |
| `NetworkFirst` | Attempts to get the resource from the network first. If the network request is successful, it updates the cache. If it fails, it falls back to the cached version [ref: 0-0]. |
| `CacheOnly` | Only responds with assets that are already in the cache. It will never go to the network [ref: 0-0]. |

### `runtimeCaching` for HLS Stream Files (`.m3u8`, `.ts`)

To prevent the service worker from caching HLS (HTTP Live Streaming) files, you can create a `runtimeCaching` rule. This rule uses a regular expression in the `urlPattern` to match manifest (`.m3u8`) and segment (`.ts`) files and applies the `NetworkOnly` handler.

```javascript
// In vite.config.js, inside workbox.runtimeCaching array
{
  urlPattern: /\.(m3u8|ts)$/i,
  handler: 'NetworkOnly'
}
```

### `runtimeCaching` for API Requests

Similarly, API calls should use a `NetworkOnly` strategy to ensure data is always fresh. You can define a `urlPattern` that matches specific API routes, such as any path starting with `/api/` or ending in `.php` [ref: 0-0].

```javascript
// In vite.config.js, inside workbox.runtimeCaching array
{
  urlPattern: ({ url }) => {
    return url.pathname.startsWith('/api/') || url.pathname.endsWith('.php');
  },
  handler: 'NetworkOnly',
  method: 'GET' // Specify the HTTP method if needed
}
```
For POST requests, you can create a separate rule with `method: 'POST'`, which can also be configured for features like `backgroundSync` [ref: 0-2].

## 4. Complete `vite.config.js` Example

The following is a complete `vite.config.js` example for the "Radio Adamowo" application. It combines the manifest configuration, `globPatterns` for precaching core assets, and `runtimeCaching` rules to enforce a `NetworkOnly` strategy for the audio stream and API calls. It also includes the `registerType: 'autoUpdate'` option, which ensures the PWA updates automatically when new content is available [ref: 0-0].

```javascript
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      // Automatically update the service worker without prompting the user.
      registerType: 'autoUpdate',

      // Configuration for the web app manifest.
      manifest: {
        name: 'Radio Adamowo',
        short_name: 'RadioAdamowo',
        description: 'Your favorite online radio station, available offline.',
        theme_color: '#1a1a1a',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'img/icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'img/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'img/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },

      // Workbox-specific configuration.
      workbox: {
        // Precaching rules for core application assets.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],

        // Runtime caching rules for dynamic or live content.
        runtimeCaching: [
          {
            // Rule for HLS audio stream files.
            // Strategy: NetworkOnly - Always fetch from the network.
            urlPattern: /\.(m3u8|ts)$/i,
            handler: 'NetworkOnly',
          },
          {
            // Rule for API calls (e.g., comments, track info).
            // Strategy: NetworkOnly - Always fetch from the network.
            urlPattern: ({ url }) => {
              return url.pathname.startsWith('/api/') || url.pathname.endsWith('.php');
            },
            handler: 'NetworkOnly',
            method: 'GET', // Apply this rule only to GET requests.
          },
          {
            // Optional: A CacheFirst rule for external assets like fonts from a CDN.
            // This improves performance by serving fonts from cache on repeat visits.
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
});
```