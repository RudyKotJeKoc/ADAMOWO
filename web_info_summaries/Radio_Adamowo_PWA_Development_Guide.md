# Radio Adamowo PWA Development Guide

## Overview

This comprehensive guide provides implementation guidance for enhancing the Radio Adamowo web application into a Progressive Web App (PWA) using Vite and PHP backend integration.

## 1. Vite-based PWA File Structure with PHP Backend

### Recommended Project Structure
Based on Vite's backend integration capabilities, the typical file structure should include [ref: 0-0]:

```
radio-adamowo/
├── public/
│   ├── manifest.json
│   ├── logo.png (192x192, 512x512)
│   └── icons/
├── src/
│   ├── assets/
│   ├── app.js
│   └── styles.css
├── backend/
│   ├── get_csrf_token.php
│   └── add_comment.php
├── index.html
├── vite.config.js
└── sw.js
```

### Vite Configuration for PHP Backend Integration
For proper backend integration, configure Vite with manifest generation and CORS settings [ref: 0-0]:

```javascript
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
  }
})
```

## 2. PWA Plugin Integration

### Installation and Setup
Install the vite-plugin-pwa for zero-config PWA functionality [ref: 0-2]:

```bash
npm install vite-plugin-pwa -D
```

### Basic Configuration
Configure the VitePWA plugin in vite.config.js [ref: 0-1]:

```javascript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      manifest: {
        name: "Radio Adamowo",
        short_name: "RadioAdam",
        description: "Progressive Web Radio Application",
        icons: [
          {
            src: '/logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo.png',
            sizes: '512x512',
            type: 'image/png'
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

## 3. Playlist.json Structure for Web Radio

### Recommended Playlist Structure
Based on PWA best practices, structure playlist.json to support multiple playlists with comprehensive metadata:

```json
{
  "playlists": {
    "ambient": {
      "name": "Ambient Sounds",
      "description": "Relaxing ambient music",
      "tracks": [
        {
          "id": "amb_001",
          "title": "Ocean Waves",
          "artist": "Nature Sounds",
          "duration": "180",
          "src": "/audio/ambient/ocean_waves.mp3",
          "artwork": [
            {
              "src": "/images/ocean_192.png",
              "sizes": "192x192",
              "type": "image/png"
            }
          ]
        }
      ]
    },
    "disco": {
      "name": "Disco Classics",
      "tracks": []
    },
    "hiphop": {
      "name": "Hip Hop",
      "tracks": []
    },
    "full": {
      "name": "Complete Collection",
      "tracks": []
    }
  }
}
```

## 4. Logo Integration and App Icons

### Manifest.json Icon Configuration
Properly configure logo.png for multiple sizes in manifest.json [ref: 0-3]:

```json
{
  "icons": [
    {
      "src": "/logo.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/logo.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### Media Session API Integration
Use logo.png as fallback thumbnails in Media Session API:

```javascript
navigator.mediaSession.metadata = new MediaMetadata({
  title: 'Radio Adamowo',
  artist: 'Live Stream',
  artwork: [
    { src: '/logo.png', sizes: '192x192', type: 'image/png' },
    { src: '/logo.png', sizes: '512x512', type: 'image/png' }
  ]
});
```

## 5. Responsive Photo Gallery Implementation

### Lazy Loading with Intersection Observer
Implement lazy loading for gallery images:

```javascript
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.add('loaded');
      imageObserver.unobserve(img);
    }
  });
});

// Apply to gallery images
document.querySelectorAll('.gallery-image').forEach(img => {
  imageObserver.observe(img);
});
```

### Educational Alt Text Implementation
Structure alt text for educational content:

```html
<img 
  data-src="grok_image_xfw2n0o.jpg" 
  alt="AI-generated educational diagram showing neural network architecture with interconnected nodes"
  class="gallery-image"
>
<img 
  data-src="20250805_181857.jpg" 
  alt="Radio equipment setup photograph taken on August 5th, 2025, showing professional broadcasting console"
  class="gallery-image"
>
```

## 6. Interactive Drag-and-Drop Implementation

### Energy Balls Drag-and-Drop System
Implement drag-and-drop for educational "Witch's Cauldron" section:

```javascript
class EnergyBallSystem {
  constructor() {
    this.cauldron = document.getElementById('cauldron');
    this.energyBalls = document.querySelectorAll('.energy-ball');
    this.initDragAndDrop();
  }

  initDragAndDrop() {
    this.energyBalls.forEach(ball => {
      ball.draggable = true;
      ball.addEventListener('dragstart', this.handleDragStart.bind(this));
    });

    this.cauldron.addEventListener('dragover', this.handleDragOver.bind(this));
    this.cauldron.addEventListener('drop', this.handleDrop.bind(this));
  }

  handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
  }

  handleDragOver(e) {
    e.preventDefault();
  }

  handleDrop(e) {
    e.preventDefault();
    const ballId = e.dataTransfer.getData('text/plain');
    const ball = document.getElementById(ballId);
    
    // Add to cauldron and trigger educational content
    this.addToCauldron(ball);
  }

  addToCauldron(ball) {
    // Educational interaction logic
    this.showEducationalContent(ball.dataset.energyType);
  }
}
```

## 7. SVG Avatar Animations with Canvas Effects

### Infinity Timeline with Particle Explosions
Implement SVG path-based animations with Canvas particle effects:

```javascript
class AvatarAnimationSystem {
  constructor() {
    this.canvas = document.getElementById('particle-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
  }

  createInfinityPath() {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M 50 100 C 50 50, 150 50, 150 100 C 150 150, 50 150, 50 100');
    return path;
  }

  animateAvatar(avatar) {
    const path = this.createInfinityPath();
    const pathLength = path.getTotalLength();
    
    let progress = 0;
    const animate = () => {
      progress += 0.01;
      
      if (progress >= 1) {
        progress = 0;
        this.triggerParticleExplosion(avatar);
      }
      
      const point = path.getPointAtLength(progress * pathLength);
      avatar.style.transform = `translate(${point.x}px, ${point.y}px)`;
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    animate();
  }

  triggerParticleExplosion(avatar) {
    const rect = avatar.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: centerX,
        y: centerY,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0
      });
    }
    
    this.animateParticles();
  }

  animateParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 0.02;
      
      this.ctx.globalAlpha = particle.life;
      this.ctx.fillStyle = '#ff6b6b';
      this.ctx.fillRect(particle.x, particle.y, 3, 3);
      
      return particle.life > 0;
    });
    
    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.animateParticles());
    }
  }
}
```

## 8. Automatic File Series Recognition

### Dynamic File Loading System
Implement automatic recognition for file series like clipboard.png, clipboard (1).png:

```javascript
class FileSeriesLoader {
  constructor() {
    this.loadedFiles = new Set();
  }

  async loadFileSeries(baseName, extension, maxAttempts = 10) {
    const files = [];
    
    // Try base file first
    try {
      await this.checkFileExists(`${baseName}.${extension}`);
      files.push(`${baseName}.${extension}`);
    } catch (e) {
      console.log(`Base file ${baseName}.${extension} not found`);
    }
    
    // Try numbered variations
    for (let i = 1; i <= maxAttempts; i++) {
      try {
        const filename = `${baseName} (${i}).${extension}`;
        await this.checkFileExists(filename);
        files.push(filename);
      } catch (e) {
        break; // Stop at first missing file
      }
    }
    
    return files;
  }

  async checkFileExists(filename) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(filename);
      img.onerror = () => reject(new Error(`File not found: ${filename}`));
      img.src = filename;
    });
  }

  async loadClipboardSeries() {
    return await this.loadFileSeries('clipboard', 'png');
  }
}
```

## 9. Toggle Functionality Implementation

### Content Section Toggle System
Implement hide/show functionality for sections like "Daily Notes":

```javascript
class ContentToggleSystem {
  constructor() {
    this.toggleButtons = document.querySelectorAll('[data-toggle]');
    this.initToggleSystem();
  }

  initToggleSystem() {
    this.toggleButtons.forEach(button => {
      button.addEventListener('click', this.handleToggle.bind(this));
    });
  }

  handleToggle(e) {
    const targetId = e.target.dataset.toggle;
    const targetElement = document.getElementById(targetId);
    const isVisible = !targetElement.classList.contains('hidden');
    
    if (isVisible) {
      this.hideSection(targetElement, e.target);
    } else {
      this.showSection(targetElement, e.target);
    }
  }

  hideSection(element, button) {
    element.style.maxHeight = element.scrollHeight + 'px';
    element.offsetHeight; // Force reflow
    
    element.style.maxHeight = '0';
    element.style.opacity = '0';
    element.classList.add('hidden');
    
    button.textContent = button.dataset.showText || 'Show';
    button.setAttribute('aria-expanded', 'false');
  }

  showSection(element, button) {
    element.classList.remove('hidden');
    element.style.maxHeight = element.scrollHeight + 'px';
    element.style.opacity = '1';
    
    button.textContent = button.dataset.hideText || 'Hide';
    button.setAttribute('aria-expanded', 'true');
    
    // Reset max-height after animation
    setTimeout(() => {
      element.style.maxHeight = 'none';
    }, 300);
  }
}
```

## 10. Offline Support and Caching

### Workbox Configuration
Configure offline support for the radio application [ref: 0-1]:

```javascript
VitePWA({
  workbox: {
    globPatterns: ["**/*.{js,css,html,pdf,mp3,png,jpg}"],
    runtimeCaching: [{
      urlPattern: ({ url }) => {
        return url.pathname.startsWith("/api");
      },
      handler: "CacheFirst",
      options: {
        cacheName: "api-cache",
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    }]
  }
})
```

## 11. Recommended Optimizations

### Performance Improvements
- Implement lazy loading for all media assets
- Use WebP format for images with fallbacks
- Enable gzip compression for static assets
- Implement service worker caching strategies

### Dark Mode Implementation
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1a1a1a;
    --text-color: #ffffff;
    --accent-color: #ff6b6b;
  }
}
```

### PWA Notifications
```javascript
// Request notification permission
if ('Notification' in window) {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      // Enable radio notifications
    }
  });
}
```

### Accessibility Enhancements
- Implement ARIA labels for all interactive elements
- Ensure keyboard navigation support
- Add screen reader announcements for dynamic content
- Maintain proper color contrast ratios

This comprehensive guide provides the foundation for transforming Radio Adamowo into a fully-featured PWA with modern web capabilities and enhanced user experience.