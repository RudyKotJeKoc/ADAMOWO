# Radio Adamowo PWA Implementation Guide

## Overview

This comprehensive guide provides implementation guidance for enhancing the Radio Adamowo web application based on modern PWA (Progressive Web App) best practices using Vite and PHP backend integration.

## 1. Vite-Based PWA File Structure with PHP Backend

### Recommended Project Structure

Based on Vite PWA best practices, the typical file structure for a radio application should be organized as follows [ref: 0-1]:

```
radio-adamowo/
├── public/
│   ├── manifest.json
│   ├── sw.js
│   ├── logo.png
│   ├── pwa-192x192.png
│   ├── pwa-512x512.png
│   └── media/
├── src/
│   ├── main.js
│   ├── App.vue/js
│   ├── components/
│   └── assets/
├── backend/
│   ├── get_csrf_token.php
│   ├── add_comment.php
│   └── api/
├── vite.config.js
└── package.json
```

### Vite Configuration for PWA

The vite-plugin-pwa should be configured with proper backend integration [ref: 0-1]:

```javascript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    cors: {
      origin: 'http://localhost' // your backend origin
    }
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: '/path/to/main.js'
    }
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo.png', 'pwa-*.png'],
      manifest: {
        name: 'Radio Adamowo',
        short_name: 'RadioAdamowo',
        description: 'Progressive Web Radio Application',
        theme_color: '#ffffff'
      }
    })
  ]
})
```

## 2. Playlist.json Structure for Web Radio

### Recommended JSON Structure

For a web radio application with multiple playlists (ambient, disco, hiphop, full), the playlist.json should follow this structure:

```json
{
  "playlists": {
    "ambient": {
      "name": "Ambient",
      "description": "Relaxing ambient music",
      "tracks": [
        {
          "id": "amb_001",
          "title": "Ethereal Dreams",
          "artist": "Ambient Artist",
          "duration": 240,
          "url": "/media/ambient/ethereal_dreams.mp3",
          "artwork": "/media/artwork/amb_001.jpg",
          "metadata": {
            "genre": "Ambient",
            "year": 2023,
            "bpm": 60,
            "key": "C major"
          }
        }
      ]
    },
    "disco": {
      "name": "Disco",
      "description": "Classic disco hits",
      "tracks": []
    },
    "hiphop": {
      "name": "Hip Hop",
      "description": "Modern hip hop tracks",
      "tracks": []
    },
    "full": {
      "name": "Full Playlist",
      "description": "Complete music collection",
      "tracks": []
    }
  },
  "metadata": {
    "version": "1.0",
    "lastUpdated": "2025-01-01T00:00:00Z",
    "totalTracks": 0
  }
}
```

### Best Practices for Track Metadata

- Include essential metadata: title, artist, duration, genre, year
- Provide artwork URLs for visual representation
- Add technical metadata: BPM, key, bitrate for advanced features
- Use consistent ID naming conventions
- Include accessibility information like descriptions for screen readers

## 3. Logo Integration in Manifest and Media Session API

### Manifest.json Icon Configuration

The manifest.json should include multiple icon sizes for optimal display across devices [ref: 0-2]:

```json
{
  "name": "Radio Adamowo",
  "short_name": "RadioAdamowo",
  "icons": [
    {
      "src": "logo.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "logo.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#ffffff",
  "background_color": "#ffffff"
}
```

### Media Session API Integration

For fallback thumbnails in the Media Session API:

```javascript
if ('mediaSession' in navigator) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: 'Current Track Title',
    artist: 'Artist Name',
    album: 'Album Name',
    artwork: [
      { src: '/logo.png', sizes: '192x192', type: 'image/png' },
      { src: '/logo.png', sizes: '512x512', type: 'image/png' }
    ]
  });
}
```

## 4. Responsive Photo Gallery Implementation

### HTML Structure with Lazy Loading

```html
<div class="photo-gallery">
  <div class="gallery-item" data-src="grok_image_xfw2n0o.jpg">
    <img 
      src="placeholder.jpg" 
      data-src="grok_image_xfw2n0o.jpg"
      alt="Educational content showing AI-generated artwork demonstrating creative technology applications"
      loading="lazy"
      class="gallery-image"
    />
  </div>
  <div class="gallery-item" data-src="20250805_181857.jpg">
    <img 
      src="placeholder.jpg" 
      data-src="20250805_181857.jpg"
      alt="Documentation photo from August 5th, 2025 showing project development progress"
      loading="lazy"
      class="gallery-image"
    />
  </div>
</div>
```

### CSS for Hover Effects and Responsiveness

```css
.photo-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: scale(1.05);
}

.gallery-image {
  width: 100%;
  height: auto;
  transition: opacity 0.3s ease;
}

.gallery-image[data-loaded="true"] {
  opacity: 1;
}
```

### JavaScript for Lazy Loading

```javascript
const observerOptions = {
  root: null,
  rootMargin: '50px',
  threshold: 0.1
};

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.setAttribute('data-loaded', 'true');
      imageObserver.unobserve(img);
    }
  });
}, observerOptions);

document.querySelectorAll('.gallery-image').forEach(img => {
  imageObserver.observe(img);
});
```

## 5. Interactive Drag-and-Drop Energy Balls

### HTML Structure

```html
<div class="cauldron-container">
  <div class="energy-balls-source">
    <div class="energy-ball" draggable="true" data-energy-type="fire">🔥</div>
    <div class="energy-ball" draggable="true" data-energy-type="water">💧</div>
    <div class="energy-ball" draggable="true" data-energy-type="earth">🌍</div>
  </div>
  <div class="cauldron" id="cauldron">
    <div class="cauldron-content">Drop energy balls here</div>
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
    e.dataTransfer.setData('text/plain', e.target.dataset.energyType);
    e.target.style.opacity = '0.5';
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
    const energyElement = document.createElement('div');
    energyElement.className = `cauldron-energy ${energyType}`;
    energyElement.textContent = this.getEnergySymbol(energyType);
    this.cauldron.appendChild(energyElement);
    
    // Trigger animation
    this.animateEnergyAddition(energyElement);
  }

  animateEnergyAddition(element) {
    element.style.animation = 'energyPulse 1s ease-in-out';
  }

  getEnergySymbol(type) {
    const symbols = {
      fire: '🔥',
      water: '💧',
      earth: '🌍'
    };
    return symbols[type] || '✨';
  }
}

// Initialize the system
document.addEventListener('DOMContentLoaded', () => {
  new EnergyBallSystem();
});
```

## 6. SVG Path-Based Avatar Animations with Canvas

### SVG Animation Structure

```html
<div class="infinity-timeline">
  <svg id="avatar-path" viewBox="0 0 800 400">
    <path id="infinity-path" d="M200,200 Q300,100 400,200 Q500,300 600,200 Q500,100 400,200 Q300,300 200,200 Z" 
          fill="none" stroke="#ccc" stroke-width="2"/>
    <circle id="avatar" r="10" fill="#ff6b6b">
      <animateMotion dur="10s" repeatCount="indefinite">
        <mpath href="#infinity-path"/>
      </animateMotion>
    </circle>
  </svg>
  <canvas id="particle-canvas" width="800" height="400"></canvas>
</div>
```

### Canvas Particle System

```javascript
class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
  }

  createExplosion(x, y) {
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        decay: 0.02
      });
    }
  }

  update() {
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
      this.animationId = requestAnimationFrame(() => this.update());
    }
  }

  triggerExplosion(x, y) {
    this.createExplosion(x, y);
    if (!this.animationId) {
      this.update();
    }
  }
}

// Initialize particle system
const particleSystem = new ParticleSystem('particle-canvas');

// Trigger explosion after animation cycle
document.getElementById('avatar').addEventListener('animationiteration', (e) => {
  const rect = e.target.getBoundingClientRect();
  particleSystem.triggerExplosion(rect.left + rect.width/2, rect.top + rect.height/2);
});
```

## 7. Automatic File Series Recognition

### JavaScript Implementation

```javascript
class FileSeriesManager {
  constructor() {
    this.filePattern = /^(.+?)(?:\s*\((\d+)\))?(\.[^.]+)$/;
    this.loadedFiles = new Set();
  }

  parseFileName(fileName) {
    const match = fileName.match(this.filePattern);
    if (match) {
      return {
        baseName: match[1],
        index: match[2] ? parseInt(match[2]) : 0,
        extension: match[3]
      };
    }
    return null;
  }

  generateSeriesName(baseName, index, extension) {
    return index > 0 ? `${baseName} (${index})${extension}` : `${baseName}${extension}`;
  }

  async loadFileSeries(baseName, extension, maxAttempts = 10) {
    const files = [];
    
    for (let i = 0; i < maxAttempts; i++) {
      const fileName = this.generateSeriesName(baseName, i, extension);
      
      try {
        const response = await fetch(`/media/${fileName}`);
        if (response.ok) {
          files.push({
            name: fileName,
            url: response.url,
            index: i
          });
          this.loadedFiles.add(fileName);
        } else {
          break; // Stop when file doesn't exist
        }
      } catch (error) {
        break; // Stop on error
      }
    }
    
    return files;
  }

  async autoDetectSeries(fileName) {
    const parsed = this.parseFileName(fileName);
    if (!parsed) return [fileName];
    
    return await this.loadFileSeries(parsed.baseName, parsed.extension);
  }
}

// Usage example
const fileManager = new FileSeriesManager();

async function loadClipboardSeries() {
  const series = await fileManager.autoDetectSeries('clipboard.png');
  console.log('Found clipboard files:', series);
  
  // Dynamically create elements for each file
  series.forEach(file => {
    const img = document.createElement('img');
    img.src = file.url;
    img.alt = `Clipboard image ${file.index + 1}`;
    document.getElementById('clipboard-container').appendChild(img);
  });
}
```

## 8. Toggle Functionality for Content Sections

### HTML Structure

```html
<div class="content-section">
  <button class="toggle-button" data-target="daily-notes" aria-expanded="false">
    <span class="toggle-text">Daily Notes</span>
    <span class="toggle-icon">▼</span>
  </button>
  <div id="daily-notes" class="toggleable-content" aria-hidden="true">
    <p>Your daily notes content here...</p>
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

.toggle-icon {
  transition: transform 0.3s ease;
}

.toggle-button[aria-expanded="true"] .toggle-icon {
  transform: rotate(180deg);
}

.toggleable-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.toggleable-content.expanded {
  max-height: 1000px; /* Adjust based on content */
}
```

### JavaScript Implementation

```javascript
class ToggleManager {
  constructor() {
    this.toggleButtons = document.querySelectorAll('.toggle-button');
    this.initializeToggles();
  }

  initializeToggles() {
    this.toggleButtons.forEach(button => {
      button.addEventListener('click', this.handleToggle.bind(this));
    });
  }

  handleToggle(event) {
    const button = event.currentTarget;
    const targetId = button.dataset.target;
    const targetElement = document.getElementById(targetId);
    
    if (!targetElement) return;

    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    
    // Update button state
    button.setAttribute('aria-expanded', !isExpanded);
    
    // Update content state
    targetElement.setAttribute('aria-hidden', isExpanded);
    targetElement.classList.toggle('expanded', !isExpanded);
    
    // Store state in localStorage
    localStorage.setItem(`toggle-${targetId}`, !isExpanded);
  }

  restoreToggleStates() {
    this.toggleButtons.forEach(button => {
      const targetId = button.dataset.target;
      const savedState = localStorage.getItem(`toggle-${targetId}`);
      
      if (savedState === 'true') {
        button.click(); // Trigger toggle to expand
      }
    });
  }
}

// Initialize toggle system
document.addEventListener('DOMContentLoaded', () => {
  const toggleManager = new ToggleManager();
  toggleManager.restoreToggleStates();
});
```

## Additional Optimizations and Enhancements

### PWA Notifications

Implement push notifications using the service worker [ref: 0-3]:

```javascript
// In service worker
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: '/logo.png',
    badge: '/logo.png'
  };
  
  event.waitUntil(
    self.registration.showNotification('Radio Adamowo', options)
  );
});
```

### Dark Mode Implementation

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
  }
}

.dark-mode {
  background-color: var(--bg-color);
  color: var(--text-color);
}
```

### Accessibility Enhancements

- Implement proper ARIA labels for all interactive elements
- Ensure keyboard navigation support
- Add screen reader announcements for dynamic content changes
- Maintain proper color contrast ratios
- Provide alternative text for all images and media

### Performance Optimizations

The vite-plugin-pwa provides automatic caching strategies for optimal performance [ref: 0-4]:

```javascript
// Runtime caching configuration
workbox: {
  runtimeCaching: [
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
}
```

This comprehensive guide provides the foundation for implementing a modern, accessible, and performant PWA radio application with all the requested features and optimizations.