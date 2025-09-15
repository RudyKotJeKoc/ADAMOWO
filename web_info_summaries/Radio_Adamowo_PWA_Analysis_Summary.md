# Radio Adamowo PWA Application Analysis and Enhancement Guide

## Overview

Based on the search results, this document provides comprehensive guidance for analyzing and enhancing the Radio Adamowo web application as a Progressive Web App (PWA) with Vite and PHP backend integration.

## 1. Typical File Structure for Vite-based PWA Radio Application with PHP Backend

### Frontend Structure (Vite-based)
The recommended file structure for a Vite-based PWA radio application includes [ref: 0-0]:

```
radio-adamowo/
├── public/
│   ├── manifest.json
│   ├── sw.js
│   ├── logo.png (multiple sizes)
│   ├── pwa-64x64.png
│   ├── pwa-192x192.png
│   ├── pwa-512x512.png
│   ├── maskable-icon-512x512.png
│   └── apple-touch-icon-180x180.png
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── components/
│   ├── assets/
│   └── styles/
├── backend/
│   ├── get_csrf_token.php
│   ├── add_comment.php
│   └── api/
├── vite.config.js
└── package.json
```

### Backend Integration Configuration
For proper backend integration with Vite, the configuration should include CORS settings and manifest generation [ref: 0-1]:

```javascript
export default defineConfig({
  server: {
    cors: {
      origin: 'http://localhost:3000' // your backend origin
    }
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: '/path/to/main.js'
    }
  }
})
```

## 2. Playlist.json Structure for Web Radio Application

### Recommended Structure
Based on PWA best practices, the playlist.json should be structured as follows:

```json
{
  "playlists": {
    "ambient": {
      "name": "Ambient Sounds",
      "description": "Relaxing ambient music",
      "tracks": [
        {
          "id": "amb_001",
          "title": "Forest Whispers",
          "artist": "Nature Sounds",
          "duration": 180,
          "url": "/audio/ambient/forest_whispers.mp3",
          "artwork": "/images/ambient/forest.jpg",
          "metadata": {
            "genre": "Ambient",
            "year": 2023,
            "album": "Natural Harmony"
          }
        }
      ]
    },
    "disco": {
      "name": "Disco Classics",
      "tracks": []
    },
    "hiphop": {
      "name": "Hip Hop Beats",
      "tracks": []
    },
    "full": {
      "name": "Complete Collection",
      "tracks": []
    }
  }
}
```

### Best Practices for Track Metadata
- Include essential fields: id, title, artist, duration, url, artwork
- Add metadata object for genre, year, album information
- Use consistent naming conventions for file paths
- Implement lazy loading for large playlists

## 3. Logo.png Integration in Manifest.json and Media Session API

### Manifest.json Configuration
The proper implementation for integrating logo.png as app icons requires multiple sizes [ref: 0-4]:

```json
{
  "name": "Radio Adamowo",
  "short_name": "RadioAdam",
  "icons": [
    {
      "src": "pwa-64x64.png",
      "sizes": "64x64",
      "type": "image/png"
    },
    {
      "src": "pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "maskable-icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

### Media Session API Integration
For fallback thumbnails in Media Session API:

```javascript
navigator.mediaSession.metadata = new MediaMetadata({
  title: 'Current Track',
  artist: 'Artist Name',
  artwork: [
    { src: '/logo.png', sizes: '96x96', type: 'image/png' },
    { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
    { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' }
  ]
});
```

## 4. Responsive Photo Gallery Implementation

### HTML Structure with Lazy Loading
```html
<div class="photo-gallery">
  <img 
    src="placeholder.jpg" 
    data-src="grok_image_xfw2n0o.jpg" 
    alt="Educational content: AI-generated visualization demonstrating machine learning concepts"
    class="gallery-item lazy-load"
    loading="lazy"
  />
  <img 
    src="placeholder.jpg" 
    data-src="20250805_181857.jpg" 
    alt="Documentation photo: Radio Adamowo interface setup from August 5th, 2025"
    class="gallery-item lazy-load"
    loading="lazy"
  />
</div>
```

### CSS for Responsive Design and Hover Effects
```css
.photo-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.gallery-item {
  width: 100%;
  height: auto;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

@media (max-width: 768px) {
  .photo-gallery {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}
```

### JavaScript for Lazy Loading
```javascript
const observerOptions = {
  threshold: 0.1,
  rootMargin: '50px'
};

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy-load');
      imageObserver.unobserve(img);
    }
  });
}, observerOptions);

document.querySelectorAll('.lazy-load').forEach(img => {
  imageObserver.observe(img);
});
```

## 5. Interactive Drag-and-Drop "Energy Balls" Implementation

### HTML Structure
```html
<div class="witches-cauldron">
  <div class="cauldron-container">
    <div class="cauldron" id="cauldron"></div>
  </div>
  <div class="energy-balls-container">
    <div class="energy-ball" draggable="true" data-energy="fire">🔥</div>
    <div class="energy-ball" draggable="true" data-energy="water">💧</div>
    <div class="energy-ball" draggable="true" data-energy="earth">🌍</div>
  </div>
</div>
```

### JavaScript Implementation
```javascript
class EnergyBallSystem {
  constructor() {
    this.cauldron = document.getElementById('cauldron');
    this.energyBalls = document.querySelectorAll('.energy-ball');
    this.initializeDragAndDrop();
  }

  initializeDragAndDrop() {
    this.energyBalls.forEach(ball => {
      ball.addEventListener('dragstart', this.handleDragStart.bind(this));
    });

    this.cauldron.addEventListener('dragover', this.handleDragOver.bind(this));
    this.cauldron.addEventListener('drop', this.handleDrop.bind(this));
  }

  handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.energy);
    e.target.classList.add('dragging');
  }

  handleDragOver(e) {
    e.preventDefault();
    this.cauldron.classList.add('drag-over');
  }

  handleDrop(e) {
    e.preventDefault();
    const energyType = e.dataTransfer.getData('text/plain');
    this.addEnergyToCauldron(energyType);
    this.cauldron.classList.remove('drag-over');
  }

  addEnergyToCauldron(energyType) {
    // Educational content: Demonstrate energy transformation
    console.log(`Added ${energyType} energy to cauldron`);
    this.createEnergyEffect(energyType);
  }

  createEnergyEffect(energyType) {
    const effect = document.createElement('div');
    effect.className = `energy-effect ${energyType}`;
    this.cauldron.appendChild(effect);
    
    setTimeout(() => {
      effect.remove();
    }, 2000);
  }
}

new EnergyBallSystem();
```

## 6. SVG Path-based Avatar Animations with Canvas Effects

### SVG Animation Implementation
```html
<div class="infinity-timeline">
  <svg viewBox="0 0 800 400" class="avatar-path">
    <path id="infinityPath" d="M200,200 Q300,100 400,200 Q500,300 600,200 Q500,100 400,200 Q300,300 200,200 Z" 
          fill="none" stroke="#333" stroke-width="2"/>
    <circle r="10" fill="#ff6b6b" class="avatar">
      <animateMotion dur="8s" repeatCount="indefinite">
        <mpath href="#infinityPath"/>
      </animateMotion>
    </circle>
  </svg>
  <canvas id="particleCanvas" width="800" height="400"></canvas>
</div>
```

### Canvas Particle Effects
```javascript
class ParticleExplosion {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
  }

  createExplosion(x, y) {
    for (let i = 0; i < 30; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        decay: Math.random() * 0.02 + 0.01
      });
    }
    this.animate();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= particle.decay;
      
      this.ctx.globalAlpha = particle.life;
      this.ctx.fillStyle = '#ff6b6b';
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
      
      return particle.life > 0;
    });

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    }
  }
}

const explosionSystem = new ParticleExplosion('particleCanvas');

// Trigger explosion every 8 seconds (matching animation cycle)
setInterval(() => {
  explosionSystem.createExplosion(400, 200);
}, 8000);
```

## 7. Automatic File Series Recognition and Dynamic Loading

### File Pattern Recognition
```javascript
class FileSeriesManager {
  constructor() {
    this.filePatterns = new Map();
    this.loadedFiles = new Set();
  }

  recognizeFileSeries(filename) {
    // Pattern: clipboard.png, clipboard (1).png, clipboard (2).png
    const seriesPattern = /^(.+?)(?:\s*\((\d+)\))?(\.[^.]+)$/;
    const match = filename.match(seriesPattern);
    
    if (match) {
      const [, baseName, number, extension] = match;
      const seriesKey = baseName + extension;
      
      if (!this.filePatterns.has(seriesKey)) {
        this.filePatterns.set(seriesKey, []);
      }
      
      this.filePatterns.get(seriesKey).push({
        filename,
        index: number ? parseInt(number) : 0
      });
    }
  }

  async loadFileSeries(baseName) {
    const series = this.filePatterns.get(baseName);
    if (!series) return [];

    // Sort by index
    series.sort((a, b) => a.index - b.index);
    
    const loadPromises = series.map(async (file) => {
      if (this.loadedFiles.has(file.filename)) {
        return null; // Already loaded
      }
      
      try {
        const response = await fetch(`/assets/${file.filename}`);
        if (response.ok) {
          this.loadedFiles.add(file.filename);
          return {
            filename: file.filename,
            data: await response.blob(),
            index: file.index
          };
        }
      } catch (error) {
        console.warn(`Failed to load ${file.filename}:`, error);
      }
      return null;
    });

    const results = await Promise.all(loadPromises);
    return results.filter(result => result !== null);
  }

  async autoDiscoverFiles(directory = '/assets/') {
    try {
      // This would require a backend endpoint to list files
      const response = await fetch(`/api/list-files?dir=${directory}`);
      const files = await response.json();
      
      files.forEach(filename => {
        this.recognizeFileSeries(filename);
      });
    } catch (error) {
      console.error('Auto-discovery failed:', error);
    }
  }
}

// Usage
const fileManager = new FileSeriesManager();
fileManager.autoDiscoverFiles();

// Load clipboard series
fileManager.loadFileSeries('clipboard.png').then(files => {
  console.log('Loaded clipboard series:', files);
});
```

## 8. Toggle Functionality for Content Sections

### HTML Structure
```html
<div class="content-section">
  <button class="toggle-button" data-target="daily-notes">
    <span class="toggle-text">Daily Notes</span>
    <span class="toggle-icon">▼</span>
  </button>
  <div class="collapsible-content" id="daily-notes">
    <div class="content-inner">
      <!-- Daily notes content -->
    </div>
  </div>
</div>
```

### CSS for Smooth Transitions
```css
.toggle-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1rem;
  background: #f5f5f5;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle-button:hover {
  background: #e0e0e0;
}

.collapsible-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-out;
}

.collapsible-content.expanded {
  max-height: 1000px; /* Adjust based on content */
}

.toggle-icon {
  transition: transform 0.3s ease;
}

.toggle-button.active .toggle-icon {
  transform: rotate(180deg);
}

.content-inner {
  padding: 1rem;
}
```

### JavaScript Implementation
```javascript
class ToggleManager {
  constructor() {
    this.toggleButtons = document.querySelectorAll('.toggle-button');
    this.initializeToggles();
    this.loadSavedStates();
  }

  initializeToggles() {
    this.toggleButtons.forEach(button => {
      button.addEventListener('click', this.handleToggle.bind(this));
    });
  }

  handleToggle(event) {
    const button = event.currentTarget;
    const targetId = button.dataset.target;
    const content = document.getElementById(targetId);
    
    if (!content) return;

    const isExpanded = content.classList.contains('expanded');
    
    if (isExpanded) {
      this.collapseSection(button, content);
    } else {
      this.expandSection(button, content);
    }
    
    this.saveState(targetId, !isExpanded);
  }

  expandSection(button, content) {
    button.classList.add('active');
    content.classList.add('expanded');
    
    // Calculate actual height for smooth animation
    const scrollHeight = content.scrollHeight;
    content.style.maxHeight = scrollHeight + 'px';
  }

  collapseSection(button, content) {
    button.classList.remove('active');
    content.classList.remove('expanded');
    content.style.maxHeight = '0px';
  }

  saveState(sectionId, isExpanded) {
    const states = JSON.parse(localStorage.getItem('toggleStates') || '{}');
    states[sectionId] = isExpanded;
    localStorage.setItem('toggleStates', JSON.stringify(states));
  }

  loadSavedStates() {
    const states = JSON.parse(localStorage.getItem('toggleStates') || '{}');
    
    Object.entries(states).forEach(([sectionId, isExpanded]) => {
      const content = document.getElementById(sectionId);
      const button = document.querySelector(`[data-target="${sectionId}"]`);
      
      if (content && button && isExpanded) {
        this.expandSection(button, content);
      }
    });
  }
}

// Initialize toggle system
document.addEventListener('DOMContentLoaded', () => {
  new ToggleManager();
});
```

## 9. PWA Configuration with Vite Plugin

### Vite Configuration for PWA
Based on the search results, the proper Vite PWA configuration should include [ref: 0-3]:

```javascript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'maskable-icon-512x512.png'],
      manifest: {
        name: 'Radio Adamowo',
        short_name: 'RadioAdam',
        description: 'Progressive Web Radio Application',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'style' || request.destination === 'script' || request.destination === 'worker',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 24 * 60 * 60 // 60 days
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ]
})
```

## 10. Additional Optimization Recommendations

### Performance Improvements
- Implement lazy loading for all media assets
- Use WebP format for images with fallbacks
- Minimize JavaScript bundles with code splitting
- Enable Gzip compression on the PHP backend

### Dark Mode Implementation
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
    --accent-color: #ff6b6b;
  }
}

.dark-theme {
  background-color: var(--bg-color);
  color: var(--text-color);
}
```

### PWA Notifications
```javascript
// Request notification permission
async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

// Send notification for new tracks
function notifyNewTrack(trackInfo) {
  if (Notification.permission === 'granted') {
    new Notification('Now Playing', {
      body: `${trackInfo.title} by ${trackInfo.artist}`,
      icon: '/pwa-192x192.png',
      badge: '/pwa-64x64.png'
    });
  }
}
```

### Accessibility Enhancements
- Add ARIA labels to all interactive elements
- Implement keyboard navigation for all features
- Ensure color contrast ratios meet WCAG guidelines
- Provide alternative text for all images and media

This comprehensive guide provides the foundation for transforming Radio Adamowo into a fully-featured Progressive Web Application with modern web capabilities and optimal user experience.