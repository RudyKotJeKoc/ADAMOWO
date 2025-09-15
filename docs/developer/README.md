# Radio Adamowo - Developer Guide
*Complete technical documentation for developers working with the Radio Adamowo platform*

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Development Environment Setup](#development-environment-setup)
3. [API Documentation](#api-documentation)
4. [Plugin Development](#plugin-development)
5. [Frontend Framework](#frontend-framework)
6. [Database Schema](#database-schema)
7. [Testing Framework](#testing-framework)
8. [Deployment Guide](#deployment-guide)
9. [Contributing Guidelines](#contributing-guidelines)
10. [Security Considerations](#security-considerations)

## Architecture Overview

### System Architecture
Radio Adamowo follows a modern, modular architecture designed for scalability and maintainability:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                         │
├─────────────────────────────────────────────────────────────┤
│  PWA Shell    │ Plugin System │ Service Worker │ Manifest  │
│  ├─ Vanilla JS │ ├─ Core Plugins │ ├─ Caching   │ ├─ Config │
│  ├─ Tailwind  │ ├─ User Plugins │ ├─ Sync      │ └─ Icons  │
│  ├─ GSAP      │ └─ Hook System  │ └─ Push      │           │
│  └─ HLS.js    │                │              │           │
├─────────────────────────────────────────────────────────────┤
│                     API Layer (PHP 8+)                     │
├─────────────────────────────────────────────────────────────┤
│  REST API v1  │ Authentication │ Rate Limiting │ Security  │
│  ├─ Stream    │ ├─ JWT/Session │ ├─ Per-IP     │ ├─ CSRF   │
│  ├─ Comments  │ ├─ RBAC        │ ├─ Per-User   │ ├─ CORS   │
│  ├─ Podcasts  │ ├─ OAuth2      │ └─ Per-API    │ ├─ XSS    │
│  ├─ Users     │ └─ 2FA Support │               │ └─ SQLi   │
│  ├─ Analytics │                │               │           │
│  └─ Notifs    │                │               │           │
├─────────────────────────────────────────────────────────────┤
│                   Database Layer (MySQL 8+)                │
├─────────────────────────────────────────────────────────────┤
│  Core Tables  │ Extended Tables │ Analytics    │ Cache     │
│  ├─ Users     │ ├─ Podcasts     │ ├─ Events    │ ├─ Redis  │
│  ├─ Comments  │ ├─ Playlists    │ ├─ Sessions  │ └─ Memory │
│  ├─ Sessions  │ ├─ Notifications│ ├─ Metrics   │           │
│  └─ Settings  │ └─ Content      │ └─ Reports   │           │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### **Frontend**
- **Core**: Vanilla JavaScript ES2020+
- **CSS**: Tailwind CSS v3 + Custom CSS
- **Animation**: GSAP v3 for advanced animations
- **Audio**: HLS.js for adaptive streaming
- **Charts**: Chart.js for data visualization
- **Build**: Vite v5 for modern bundling

#### **Backend**
- **Language**: PHP 8+ with strict typing
- **Database**: MySQL 8+ / MariaDB 10.6+
- **Caching**: Redis (optional) or file-based
- **Session**: PHP sessions with database storage
- **Security**: Custom security layer with rate limiting

#### **Infrastructure**
- **Web Server**: Nginx or Apache with HTTPS
- **SSL/TLS**: Let's Encrypt or commercial certificate
- **CDN**: Optional CDN for media delivery
- **Monitoring**: Built-in analytics + external monitoring

### Design Principles

#### **Backward Compatibility**
- All existing functionality preserved
- Original API endpoints continue to work
- Graceful degradation for older browsers
- Progressive enhancement approach

#### **Modularity**
- Plugin-based architecture for extensibility
- Loosely coupled components
- Event-driven communication
- Dependency injection for testability

#### **Security First**
- Defense in depth strategy
- Input validation at all layers
- Output encoding for XSS prevention
- CSRF protection on all forms
- Rate limiting to prevent abuse

#### **Performance**
- Lazy loading for non-critical resources
- Efficient caching strategies
- Optimized database queries
- Compressed asset delivery
- Service worker for offline capabilities

## Development Environment Setup

### Prerequisites
- **Node.js**: v18+ with npm/pnpm
- **PHP**: v8.0+ with extensions: PDO, MySQL, JSON, MBString
- **MySQL**: v8.0+ or MariaDB 10.6+
- **Web Server**: Nginx/Apache (development server included)
- **Git**: Version control

### Quick Start
```bash
# Clone repository
git clone https://github.com/RudyKotJeKoc/ADAMOWO.git
cd ADAMOWO

# Install dependencies
npm install
# or
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Set up database
mysql -u root -p < schema-extended.sql

# Start development server
npm run dev
```

### Environment Configuration
Create `.env` file with:
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=radio_adamowo
DB_USER=your_username
DB_PASS=your_password

# Application Settings
APP_URL=http://localhost:3000
APP_ENV=development
APP_DEBUG=true

# Security
SECRET_KEY=your-secret-key-here
CSRF_SECRET=your-csrf-secret

# External Services
CDN_URL=https://cdn.yourdomain.com
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Development Scripts
```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run type-check

# Bundle analysis
npm run analyze

# Lighthouse audit
npm run lighthouse
```

## API Documentation

### Base URL Structure
```
Production:  https://radioadamowo.pl/api/v1/
Development: http://localhost:3000/api/v1/
```

### Authentication
Most API endpoints support optional authentication:
```javascript
// Optional authentication header
{
  "Authorization": "Bearer your-jwt-token"
}

// Required for admin endpoints
{
  "Authorization": "Bearer admin-jwt-token"
}
```

### Response Format
All API endpoints return consistent JSON responses:
```javascript
// Success Response
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ },
  "timestamp": "2025-01-15T10:30:00Z"
}

// Error Response  
{
  "success": false,
  "message": "Error description",
  "details": { /* error details */ },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Stream Management API

#### **GET** `/stream/status`
Get current stream status and statistics.

**Response:**
```javascript
{
  "success": true,
  "data": {
    "status": "live",
    "current_time": "2025-01-15T10:30:00Z",
    "stream_name": "Radio Adamowo - Live Stream",
    "server_status": "online",
    "bitrate": 128,
    "format": "mp3",
    "listeners": 127,
    "peak_listeners": 247,
    "uptime": "14 days, 6 hours"
  }
}
```

#### **GET** `/stream/current`
Get currently playing track information.

**Response:**
```javascript
{
  "success": true,
  "data": {
    "title": "Atmospheric Manipulation #3",
    "artist": "Radio Adamowo",
    "category": "ambient",
    "started_at": "2025-01-15T10:27:00Z",
    "progress": 65.5,
    "duration": 180,
    "remaining": 63
  }
}
```

#### **GET** `/stream/playlist`
Get current playlist with pagination.

**Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 50)
- `category`: Filter by category (optional)

**Response:**
```javascript
{
  "success": true,
  "data": {
    "tracks": [
      {
        "id": 1,
        "title": "Track Title",
        "artist": "Artist Name",
        "category": "ambient",
        "duration": 180,
        "url": "https://example.com/track.mp3"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 145,
      "total_pages": 8
    },
    "categories": ["ambient", "hiphop", "disco", "barbara", "kids"]
  }
}
```

### Comments API

#### **GET** `/comments`
Get comments with enhanced features.

**Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `date`: Filter by date (YYYY-MM-DD format)
- `approved`: Filter by approval status (0/1, default: 1)

**Response:**
```javascript
{
  "success": true,
  "data": {
    "comments": [
      {
        "id": 123,
        "comment_date": "2025-01-15",
        "name": "Anna K.",
        "text": "Very insightful analysis of manipulation techniques...",
        "created_at": "2025-01-15T09:15:00Z",
        "like_count": 5,
        "dislike_count": 0,
        "heart_count": 3,
        "report_count": 0,
        "is_approved": 1,
        "is_flagged": 0
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 1247,
      "total_pages": 63
    }
  }
}
```

#### **POST** `/comments/add`
Add a new comment.

**Request Body:**
```javascript
{
  "name": "User Name",
  "text": "Comment text content",
  "date": "2025-01-15"
}
```

**Response:**
```javascript
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "id": 124,
    "comment_date": "2025-01-15",
    "name": "User Name",
    "text": "Comment text content",
    "created_at": "2025-01-15T10:30:00Z",
    "is_approved": 1
  }
}
```

#### **POST** `/comments/react/{id}`
React to a comment.

**Request Body:**
```javascript
{
  "type": "like" // "like", "dislike", "heart"
}
```

### Notifications API

#### **GET** `/notifications/unread`
Get unread notifications (requires authentication).

**Response:**
```javascript
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": 1,
        "type": "comment",
        "title": "New comment on your post",
        "message": "Someone reacted to your comment",
        "data": {
          "comment_id": 123,
          "action": "like"
        },
        "created_at": "2025-01-15T10:25:00Z",
        "is_read": 0
      }
    ],
    "count": 3
  }
}
```

#### **POST** `/notifications/subscribe`
Subscribe to push notifications.

**Request Body:**
```javascript
{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "p256dh_key": "base64-encoded-key",
  "auth_key": "base64-encoded-key"
}
```

### Error Handling

#### **Rate Limiting**
When rate limits are exceeded:
```javascript
{
  "success": false,
  "message": "Rate limit exceeded",
  "details": {
    "limit": 60,
    "window": 3600,
    "reset_at": "2025-01-15T11:30:00Z"
  }
}
```

#### **Validation Errors**
When request data is invalid:
```javascript
{
  "success": false,
  "message": "Validation failed",
  "details": {
    "field_name": ["Error message 1", "Error message 2"],
    "another_field": ["Required field missing"]
  }
}
```

## Plugin Development

### Plugin Architecture
Radio Adamowo uses a hook-based plugin system for extensibility:

```javascript
// plugins/example-plugin/plugin.js
class ExamplePlugin extends BasePlugin {
    constructor() {
        super('example-plugin', '1.0.0');
        this.description = 'An example plugin for Radio Adamowo';
    }

    onInit() {
        // Plugin initialization
        this.addHook('audio.play', this.onAudioPlay.bind(this));
        this.addHook('comment.added', this.onCommentAdded.bind(this));
        
        console.log('Example Plugin initialized');
    }

    onAudioPlay(audioData) {
        console.log('Audio playing:', audioData.title);
        return audioData; // Must return data for hook chain
    }

    onCommentAdded(commentData) {
        // Custom logic when comments are added
        return commentData;
    }

    onDestroy() {
        // Cleanup when plugin is unloaded
    }
}

// Auto-register plugin
if (window.pluginManager) {
    window.pluginManager.register('example-plugin', new ExamplePlugin());
}
```

### Available Hooks
Plugin system provides numerous hooks for customization:

#### **Audio Hooks**
- `audio.play`: When audio starts playing
- `audio.pause`: When audio is paused
- `audio.stop`: When audio stops
- `audio.skip`: When user skips to next track
- `audio.volume`: When volume changes
- `audio.quality`: When quality setting changes

#### **Content Hooks**
- `comment.added`: When new comment is posted
- `comment.moderated`: When comment is moderated
- `podcast.played`: When podcast starts playing
- `content.viewed`: When content is accessed

#### **UI Hooks**
- `theme.change`: When theme is switched
- `ui.modal.open`: When modal dialogs open
- `ui.navigation`: When user navigates
- `ui.resize`: When window resizes

#### **System Hooks**
- `system.ready`: When system fully initializes
- `plugin.registered`: When new plugin is registered
- `plugin.unregistered`: When plugin is removed
- `settings.updated`: When user settings change

### Plugin Template
Create new plugins using this structure:

```
plugins/
  your-plugin-name/
    ├── plugin.js          # Main plugin file
    ├── plugin.json        # Plugin metadata
    ├── styles.css         # Plugin styles (optional)
    ├── templates/         # HTML templates (optional)
    ├── assets/           # Images, icons, etc. (optional)
    └── README.md         # Plugin documentation
```

**plugin.json:**
```javascript
{
  "name": "your-plugin-name",
  "version": "1.0.0",
  "description": "Your plugin description",
  "author": "Your Name",
  "license": "MIT",
  "dependencies": [],
  "permissions": ["audio", "comments"],
  "enabled": true,
  "category": "enhancement"
}
```

### Core Plugins

#### **AudioVisualizerPlugin**
Real-time audio visualization:
- Canvas-based frequency visualization
- Multiple visualization modes
- Customizable colors and styles
- Performance optimized

#### **AnalyticsPlugin**
User behavior tracking:
- Session management
- Event tracking
- Performance monitoring
- Privacy-compliant data collection

#### **NotificationPlugin**
Push notification system:
- Web Push API integration
- Service Worker management
- Permission handling
- Cross-browser compatibility

#### **KeyboardShortcutsPlugin**
Keyboard navigation:
- Customizable key bindings
- Context-aware shortcuts
- Settings persistence
- Accessibility features

#### **ThemeManagerPlugin**
Dynamic theming:
- Multiple theme support
- CSS custom properties
- Time-based auto switching
- User preference storage

## Frontend Framework

### Component Architecture
Frontend follows a modular component approach:

```javascript
// components/AudioPlayer.js
class AudioPlayer {
    constructor(container, options = {}) {
        this.container = container;
        this.options = { ...this.defaultOptions, ...options };
        this.state = {
            isPlaying: false,
            volume: 0.7,
            currentTrack: null
        };
        
        this.init();
    }

    init() {
        this.createElements();
        this.bindEvents();
        this.loadState();
    }

    createElements() {
        this.container.innerHTML = this.template();
        this.elements = {
            playBtn: this.container.querySelector('.play-btn'),
            volumeSlider: this.container.querySelector('.volume-slider'),
            progressBar: this.container.querySelector('.progress-bar')
        };
    }

    bindEvents() {
        this.elements.playBtn.addEventListener('click', this.togglePlay.bind(this));
        this.elements.volumeSlider.addEventListener('input', this.setVolume.bind(this));
        
        // Plugin system integration
        if (window.pluginManager) {
            window.pluginManager.addHook('audio.play', this.onAudioPlay.bind(this));
        }
    }

    template() {
        return `
            <div class="audio-player">
                <button class="play-btn">
                    <i class="fas fa-play"></i>
                </button>
                <div class="progress-container">
                    <div class="progress-bar"></div>
                </div>
                <input type="range" class="volume-slider" min="0" max="100" value="70">
            </div>
        `;
    }

    togglePlay() {
        if (this.state.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.state.isPlaying = true;
        this.updateUI();
        
        // Trigger plugin hooks
        if (window.pluginManager) {
            window.pluginManager.executeHook('audio.play', this.state.currentTrack);
        }
    }

    pause() {
        this.state.isPlaying = false;
        this.updateUI();
        
        if (window.pluginManager) {
            window.pluginManager.executeHook('audio.pause', this.state.currentTrack);
        }
    }

    updateUI() {
        const icon = this.elements.playBtn.querySelector('i');
        icon.className = this.state.isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }
}
```

### State Management
Simple state management without complex frameworks:

```javascript
// utils/StateManager.js
class StateManager {
    constructor() {
        this.state = {};
        this.listeners = new Map();
    }

    setState(key, value) {
        const oldValue = this.state[key];
        this.state[key] = value;
        
        this.notifyListeners(key, value, oldValue);
    }

    getState(key) {
        return this.state[key];
    }

    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key).push(callback);

        // Return unsubscribe function
        return () => {
            const listeners = this.listeners.get(key);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }

    notifyListeners(key, newValue, oldValue) {
        const listeners = this.listeners.get(key) || [];
        listeners.forEach(callback => {
            try {
                callback(newValue, oldValue);
            } catch (error) {
                console.error('State listener error:', error);
            }
        });
    }
}

// Global state instance
window.appState = new StateManager();
```

### API Client
Centralized API communication:

```javascript
// utils/ApiClient.js
class ApiClient {
    constructor(baseUrl = '/api/v1') {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            'Content-Type': 'application/json'
        };
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: { ...this.defaultHeaders, ...options.headers },
            ...options
        };

        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new ApiError(data.message, response.status, data);
            }

            return data;
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Network error', 0, { originalError: error });
        }
    }

    async get(endpoint, params = {}) {
        const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                url.searchParams.append(key, params[key]);
            }
        });

        return this.request(url.pathname + url.search);
    }

    async post(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }
}

class ApiError extends Error {
    constructor(message, status, details = {}) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.details = details;
    }
}

// Global API client
window.api = new ApiClient();
```

## Database Schema

### Core Tables

#### **users**
User account management:
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'moderator', 'admin') DEFAULT 'user',
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    is_active TINYINT(1) DEFAULT 1,
    email_verified TINYINT(1) DEFAULT 0,
    preferences JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### **calendar_comments**
Enhanced comment system:
```sql
CREATE TABLE calendar_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    parent_id INT NULL,
    comment_date DATE NOT NULL,
    name VARCHAR(50) NOT NULL,
    text TEXT NOT NULL,
    ip_address VARCHAR(64) NOT NULL,
    is_approved TINYINT(1) DEFAULT 1,
    is_flagged TINYINT(1) DEFAULT 0,
    edit_count INT DEFAULT 0,
    last_edited TIMESTAMP NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (parent_id) REFERENCES calendar_comments(id) ON DELETE CASCADE
);
```

#### **comment_reactions**
Comment interaction system:
```sql
CREATE TABLE comment_reactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    comment_id INT NOT NULL,
    user_id INT NULL,
    client_id VARCHAR(64) NOT NULL,
    reaction_type ENUM('like', 'dislike', 'heart', 'angry', 'laugh') NOT NULL,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (comment_id) REFERENCES calendar_comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_reaction (comment_id, COALESCE(user_id, 0), client_id)
);
```

### Extended Tables

#### **podcasts**
Content management:
```sql
CREATE TABLE podcasts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    audio_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    category VARCHAR(50) NOT NULL,
    duration_seconds INT,
    file_size BIGINT,
    is_published TINYINT(1) DEFAULT 0,
    publish_date TIMESTAMP NULL,
    play_count BIGINT DEFAULT 0,
    like_count INT DEFAULT 0,
    metadata JSON,
    seo_title VARCHAR(200),
    seo_description TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FULLTEXT INDEX ft_content (title, description)
);
```

#### **notifications**
Notification system:
```sql
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    type ENUM('info', 'warning', 'success', 'error', 'podcast', 'comment', 'system') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    is_read TINYINT(1) DEFAULT 0,
    is_email_sent TINYINT(1) DEFAULT 0,
    is_push_sent TINYINT(1) DEFAULT 0,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### **stream_analytics**
User behavior tracking:
```sql
CREATE TABLE stream_analytics (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(64) NOT NULL,
    user_id INT NULL,
    event_type ENUM('play', 'pause', 'stop', 'skip', 'seek', 'volume', 'connect', 'disconnect') NOT NULL,
    track_info JSON,
    timestamp_seconds INT,
    ip_address VARCHAR(45),
    user_agent_hash VARCHAR(64),
    referrer VARCHAR(500),
    country_code VARCHAR(2),
    city VARCHAR(100),
    device_type ENUM('mobile', 'desktop', 'tablet', 'tv', 'other'),
    browser VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

### Database Migration System
Automated database updates:

```php
// migrations/Migration_001_ExtendedSchema.php
class Migration_001_ExtendedSchema extends BaseMigration
{
    public function up()
    {
        // Add new columns to existing tables
        $this->addColumn('calendar_comments', 'user_id', 'INT NULL');
        $this->addColumn('calendar_comments', 'parent_id', 'INT NULL');
        $this->addColumn('calendar_comments', 'metadata', 'JSON');
        
        // Create new tables
        $this->createTable('comment_reactions', [
            'id' => 'BIGINT AUTO_INCREMENT PRIMARY KEY',
            'comment_id' => 'INT NOT NULL',
            'reaction_type' => 'ENUM("like", "dislike", "heart") NOT NULL',
            'client_id' => 'VARCHAR(64) NOT NULL',
            'created_at' => 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
        ]);
        
        // Add foreign keys
        $this->addForeignKey('comment_reactions', 'comment_id', 'calendar_comments', 'id');
    }
    
    public function down()
    {
        // Reverse migration
        $this->dropTable('comment_reactions');
        $this->removeColumn('calendar_comments', 'user_id');
        $this->removeColumn('calendar_comments', 'parent_id');
        $this->removeColumn('calendar_comments', 'metadata');
    }
}
```

## Testing Framework

### Unit Testing
JavaScript unit tests using Vitest:

```javascript
// tests/unit/AudioPlayer.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AudioPlayer } from '../../src/components/AudioPlayer.js';

describe('AudioPlayer', () => {
    let container;
    let player;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        player = new AudioPlayer(container);
    });

    it('should initialize with default state', () => {
        expect(player.state.isPlaying).toBe(false);
        expect(player.state.volume).toBe(0.7);
    });

    it('should toggle play state', () => {
        player.togglePlay();
        expect(player.state.isPlaying).toBe(true);
        
        player.togglePlay();
        expect(player.state.isPlaying).toBe(false);
    });

    it('should update volume', () => {
        player.setVolume(0.5);
        expect(player.state.volume).toBe(0.5);
    });

    it('should trigger plugin hooks', () => {
        const hookSpy = vi.fn();
        window.pluginManager = {
            executeHook: hookSpy
        };

        player.play();
        expect(hookSpy).toHaveBeenCalledWith('audio.play', player.state.currentTrack);
    });
});
```

### Integration Testing
API integration tests:

```javascript
// tests/integration/api.test.js
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { ApiClient } from '../../src/utils/ApiClient.js';

describe('API Integration', () => {
    let api;
    
    beforeAll(() => {
        api = new ApiClient('http://localhost:3000/api/v1');
    });

    it('should get stream status', async () => {
        const response = await api.get('/stream/status');
        
        expect(response.success).toBe(true);
        expect(response.data).toHaveProperty('status');
        expect(response.data).toHaveProperty('listeners');
    });

    it('should get current track', async () => {
        const response = await api.get('/stream/current');
        
        expect(response.success).toBe(true);
        expect(response.data).toHaveProperty('title');
        expect(response.data).toHaveProperty('progress');
    });

    it('should add comment', async () => {
        const commentData = {
            name: 'Test User',
            text: 'Test comment content',
            date: '2025-01-15'
        };
        
        const response = await api.post('/comments/add', commentData);
        
        expect(response.success).toBe(true);
        expect(response.data).toHaveProperty('id');
        expect(response.data.name).toBe(commentData.name);
    });

    it('should handle rate limiting', async () => {
        // Make multiple requests to trigger rate limit
        const requests = Array(70).fill().map(() => 
            api.get('/stream/status')
        );
        
        await expect(Promise.all(requests)).rejects.toThrow('Rate limit exceeded');
    });
});
```

### End-to-End Testing
Browser automation tests with Playwright:

```javascript
// tests/e2e/user-journey.spec.js
import { test, expect } from '@playwright/test';

test.describe('User Journey', () => {
    test('complete user interaction flow', async ({ page }) => {
        // Visit homepage
        await page.goto('/');
        
        // Start audio
        await page.click('#start-btn');
        
        // Wait for audio to start
        await page.waitForSelector('.fa-pause', { timeout: 5000 });
        
        // Navigate to calendar
        await page.click('a[href="#kalendarium"]');
        
        // Add comment
        await page.click('#calendar-input');
        await page.fill('#calendar-input', '2025-01-15');
        await page.click('.flatpickr-day[aria-label*="January 15"]');
        
        // Fill modal form
        await page.fill('#modal-name-input', 'Test User');
        await page.fill('#modal-note-input', 'Test comment for automation');
        await page.click('button[type="submit"]');
        
        // Verify success
        await expect(page.locator('#modal-feedback')).toContainText('success');
        
        // Check if comment appears
        await page.reload();
        await page.click('#calendar-input');
        await page.fill('#calendar-input', '2025-01-15');
        
        await expect(page.locator('#modal-notes-display')).toContainText('Test User');
    });

    test('audio controls work correctly', async ({ page }) => {
        await page.goto('/');
        
        // Start audio
        await page.click('#start-btn');
        
        // Test play/pause
        await page.click('#radio-play-pause-btn');
        await expect(page.locator('#radio-play-icon')).toBeHidden();
        await expect(page.locator('#radio-pause-icon')).toBeVisible();
        
        // Test volume control
        await page.fill('#volume-slider', '50');
        
        // Test quality selector
        await page.selectOption('#quality-selector', 'high');
        
        // Verify audio element exists and is playing
        const audio = await page.locator('#radio-player');
        const isPaused = await audio.evaluate(el => el.paused);
        expect(isPaused).toBe(false);
    });

    test('mobile responsive design', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');
        
        // Test mobile menu
        await page.click('#menu-toggle');
        await expect(page.locator('#mobile-menu')).toBeVisible();
        
        // Test mobile navigation
        await page.click('#mobile-menu a[href="#podkasty"]');
        await expect(page.locator('#mobile-menu')).toBeHidden();
        
        // Verify responsive layout
        const header = await page.locator('header');
        await expect(header).toBeVisible();
    });
});
```

### Performance Testing
Load testing and performance monitoring:

```javascript
// tests/performance/load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
    stages: [
        { duration: '2m', target: 100 }, // Ramp up
        { duration: '5m', target: 100 }, // Sustain load
        { duration: '2m', target: 200 }, // Spike
        { duration: '5m', target: 200 }, // Sustain spike
        { duration: '2m', target: 0 },   // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(99)<1500'], // 99% of requests under 1.5s
        http_req_failed: ['rate<0.1'],     // Error rate under 10%
        errors: ['rate<0.1'],
    },
};

export default function () {
    // Test homepage load
    let response = http.get('https://radioadamowo.pl/');
    check(response, {
        'homepage loads': (r) => r.status === 200,
        'homepage load time OK': (r) => r.timings.duration < 2000,
    }) || errorRate.add(1);

    // Test API endpoints
    response = http.get('https://radioadamowo.pl/api/v1/stream/status');
    check(response, {
        'API responds': (r) => r.status === 200,
        'API response time OK': (r) => r.timings.duration < 500,
    }) || errorRate.add(1);

    response = http.get('https://radioadamowo.pl/api/v1/comments?limit=20');
    check(response, {
        'Comments API responds': (r) => r.status === 200,
        'Comments load quickly': (r) => r.timings.duration < 1000,
    }) || errorRate.add(1);

    sleep(1);
}
```

## Deployment Guide

### Production Environment Setup

#### **Server Requirements**
- **CPU**: 2+ cores recommended
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 50GB+ SSD
- **Bandwidth**: 100Mbps+ for streaming
- **OS**: Ubuntu 20.04+ or CentOS 8+

#### **Software Stack**
```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Install PHP 8+
sudo apt install php8.1 php8.1-fpm php8.1-mysql php8.1-json php8.1-mbstring

# Install MySQL 8
sudo apt install mysql-server-8.0

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs

# Install SSL certificate (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
```

#### **Nginx Configuration**
```nginx
# /etc/nginx/sites-available/radioadamowo
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name radioadamowo.pl www.radioadamowo.pl;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/radioadamowo.pl/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/radioadamowo.pl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' cdn.tailwindcss.com cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com cdn.tailwindcss.com; font-src fonts.gstatic.com; img-src 'self' data:; media-src 'self' www.soundhelix.com; connect-src 'self';" always;

    root /var/www/radioadamowo/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Static Assets with Long Cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API Routes
    location /api/ {
        try_files $uri $uri/ @php;
    }

    # Admin Panel
    location /admin/ {
        try_files $uri $uri/ /admin/index.html;
    }

    # PHP Processing
    location @php {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Main Application
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    location /api/ {
        limit_req zone=api burst=20 nodelay;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name radioadamowo.pl www.radioadamowo.pl;
    return 301 https://$server_name$request_uri;
}
```

### Automated Deployment

#### **CI/CD Pipeline with GitHub Actions**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  PHP_VERSION: '8.1'

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: password
          MYSQL_DATABASE: radio_adamowo_test
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: ${{ env.PHP_VERSION }}
        extensions: pdo, pdo_mysql, json, mbstring
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run tests
      run: npm run test
      env:
        DB_HOST: 127.0.0.1
        DB_PORT: 3306
        DB_DATABASE: radio_adamowo_test
        DB_USERNAME: root
        DB_PASSWORD: password
    
    - name: Build for production
      run: npm run build
    
    - name: Run E2E tests
      run: npx playwright test
      env:
        CI: true

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build for production
      run: npm run build
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        port: ${{ secrets.PORT }}
        script: |
          cd /var/www/radioadamowo
          git pull origin main
          npm ci --production
          npm run build
          php database/migrate.php
          sudo systemctl reload nginx
          sudo systemctl reload php8.1-fpm
    
    - name: Notify deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

#### **Database Migration Script**
```php
<?php
// database/migrate.php
require_once __DIR__ . '/../config.php';

class DatabaseMigrator
{
    private $pdo;
    private $migrationsPath;
    
    public function __construct($pdo, $migrationsPath = __DIR__ . '/migrations')
    {
        $this->pdo = $pdo;
        $this->migrationsPath = $migrationsPath;
        $this->createMigrationsTable();
    }
    
    public function migrate()
    {
        $appliedMigrations = $this->getAppliedMigrations();
        $migrationFiles = $this->getMigrationFiles();
        
        foreach ($migrationFiles as $file) {
            $migrationName = pathinfo($file, PATHINFO_FILENAME);
            
            if (in_array($migrationName, $appliedMigrations)) {
                echo "Skipping {$migrationName} (already applied)\n";
                continue;
            }
            
            echo "Applying {$migrationName}...\n";
            
            try {
                $this->pdo->beginTransaction();
                
                require_once $file;
                $className = $this->getClassNameFromFile($migrationName);
                $migration = new $className($this->pdo);
                $migration->up();
                
                $this->recordMigration($migrationName);
                $this->pdo->commit();
                
                echo "Applied {$migrationName} successfully\n";
            } catch (Exception $e) {
                $this->pdo->rollback();
                echo "Failed to apply {$migrationName}: {$e->getMessage()}\n";
                exit(1);
            }
        }
        
        echo "All migrations completed successfully\n";
    }
    
    private function createMigrationsTable()
    {
        $this->pdo->exec("
            CREATE TABLE IF NOT EXISTS migrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                migration VARCHAR(255) NOT NULL UNIQUE,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ");
    }
    
    private function getAppliedMigrations()
    {
        $stmt = $this->pdo->query("SELECT migration FROM migrations");
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
    
    private function getMigrationFiles()
    {
        $files = glob($this->migrationsPath . '/*.php');
        sort($files);
        return $files;
    }
    
    private function recordMigration($migrationName)
    {
        $stmt = $this->pdo->prepare("INSERT INTO migrations (migration) VALUES (?)");
        $stmt->execute([$migrationName]);
    }
    
    private function getClassNameFromFile($filename)
    {
        // Convert filename like "001_CreateUsersTable" to "Migration_001_CreateUsersTable"
        return 'Migration_' . $filename;
    }
}

// Run migrations
try {
    $pdo = getApiDbConnection();
    $migrator = new DatabaseMigrator($pdo);
    $migrator->migrate();
} catch (Exception $e) {
    echo "Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
```

### Monitoring and Maintenance

#### **Health Check Endpoint**
```php
<?php
// api/v1/health.php
header('Content-Type: application/json');

$health = [
    'status' => 'ok',
    'timestamp' => date('c'),
    'version' => '2.1.0',
    'checks' => []
];

// Database check
try {
    $pdo = getApiDbConnection();
    $stmt = $pdo->query("SELECT 1");
    $health['checks']['database'] = [
        'status' => 'healthy',
        'response_time' => microtime(true) - $_SERVER['REQUEST_TIME_FLOAT']
    ];
} catch (Exception $e) {
    $health['status'] = 'error';
    $health['checks']['database'] = [
        'status' => 'unhealthy',
        'error' => $e->getMessage()
    ];
}

// Disk space check
$diskFree = disk_free_space('/');
$diskTotal = disk_total_space('/');
$diskUsedPercent = (1 - ($diskFree / $diskTotal)) * 100;

$health['checks']['disk'] = [
    'status' => $diskUsedPercent < 90 ? 'healthy' : 'warning',
    'used_percent' => round($diskUsedPercent, 2),
    'free_bytes' => $diskFree
];

// Memory check
$memoryUsage = memory_get_usage(true);
$memoryLimit = ini_get('memory_limit');
$health['checks']['memory'] = [
    'status' => 'healthy',
    'usage_bytes' => $memoryUsage,
    'limit' => $memoryLimit
];

http_response_code($health['status'] === 'ok' ? 200 : 503);
echo json_encode($health, JSON_PRETTY_PRINT);
```

#### **Log Monitoring**
```bash
#!/bin/bash
# scripts/monitor-logs.sh

LOG_DIR="/var/log/radioadamowo"
ERROR_THRESHOLD=10
ALERT_EMAIL="admin@radioadamowo.pl"

# Create log directory if it doesn't exist
mkdir -p $LOG_DIR

# Monitor error logs
error_count=$(grep -c "ERROR\|CRITICAL" $LOG_DIR/app.log)

if [ $error_count -gt $ERROR_THRESHOLD ]; then
    echo "High error rate detected: $error_count errors" | \
    mail -s "[ALERT] Radio Adamowo - High Error Rate" $ALERT_EMAIL
fi

# Monitor disk space
disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')

if [ $disk_usage -gt 90 ]; then
    echo "Disk usage critical: ${disk_usage}%" | \
    mail -s "[CRITICAL] Radio Adamowo - Disk Space" $ALERT_EMAIL
fi

# Monitor process
if ! pgrep -f "nginx" > /dev/null; then
    echo "Nginx is not running" | \
    mail -s "[CRITICAL] Radio Adamowo - Service Down" $ALERT_EMAIL
    systemctl restart nginx
fi

if ! pgrep -f "php-fpm" > /dev/null; then
    echo "PHP-FPM is not running" | \
    mail -s "[CRITICAL] Radio Adamowo - Service Down" $ALERT_EMAIL
    systemctl restart php8.1-fpm
fi
```

## Contributing Guidelines

### Code Style Standards

#### **JavaScript**
```javascript
// Use ESLint configuration
// .eslintrc.js
module.exports = {
    extends: ['eslint:recommended'],
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
    },
    env: {
        browser: true,
        es6: true,
        node: true
    },
    rules: {
        'indent': ['error', 4],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'no-console': 'warn',
        'no-unused-vars': 'error',
        'prefer-const': 'error',
        'arrow-spacing': 'error'
    }
};
```

#### **PHP**
```php
<?php
// Follow PSR-12 coding standards
declare(strict_types=1);

namespace RadioAdamowo\Services;

use RadioAdamowo\Exceptions\ValidationException;

class CommentService
{
    private DatabaseInterface $database;
    private ValidatorInterface $validator;

    public function __construct(
        DatabaseInterface $database,
        ValidatorInterface $validator
    ) {
        $this->database = $database;
        $this->validator = $validator;
    }

    public function createComment(array $data): Comment
    {
        $this->validator->validate($data, [
            'name' => 'required|string|min:2|max:50',
            'text' => 'required|string|min:5|max:1000',
            'date' => 'required|date'
        ]);

        // Implementation continues...
    }
}
```

### Git Workflow

#### **Branch Naming Convention**
- `feature/description` - New features
- `bugfix/description` - Bug fixes  
- `hotfix/description` - Critical fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

#### **Commit Messages**
Follow conventional commits format:
```
type(scope): subject

body

footer
```

Examples:
```
feat(api): add comment reaction endpoints

- Add like/dislike/heart reactions
- Implement rate limiting for reactions
- Add reaction count aggregation

Closes #123
```

```
fix(audio): resolve playback issues on Safari

- Fix Web Audio API compatibility
- Add fallback for unsupported formats
- Improve error handling for stream failures

Fixes #456
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/comment-reactions
   ```

2. **Make Changes with Tests**
   - Write tests for new functionality
   - Ensure all existing tests pass
   - Update documentation if needed

3. **Submit Pull Request**
   - Fill out PR template completely
   - Link related issues
   - Request review from maintainers

4. **Code Review Process**
   - Address reviewer feedback
   - Ensure CI/CD pipeline passes
   - Squash commits if requested

5. **Merge Requirements**
   - All tests must pass
   - Code coverage maintained
   - Documentation updated
   - Performance impact assessed

### Security Guidelines

#### **Input Validation**
```php
// Always validate and sanitize input
function validateCommentData(array $data): array
{
    $validator = new Validator();
    
    $rules = [
        'name' => 'required|string|min:2|max:50|alpha_spaces',
        'text' => 'required|string|min:5|max:1000',
        'date' => 'required|date|date_format:Y-m-d|before_or_equal:today',
        'email' => 'nullable|email|max:100'
    ];
    
    $validated = $validator->validate($data, $rules);
    
    // Additional sanitization
    $validated['name'] = htmlspecialchars($validated['name'], ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $validated['text'] = htmlspecialchars($validated['text'], ENT_QUOTES | ENT_HTML5, 'UTF-8');
    
    return $validated;
}
```

#### **SQL Injection Prevention**
```php
// Always use prepared statements
function getCommentsByDate(PDO $pdo, string $date): array
{
    $stmt = $pdo->prepare("
        SELECT id, name, text, created_at 
        FROM calendar_comments 
        WHERE comment_date = ? AND is_approved = 1
        ORDER BY created_at ASC
    ");
    
    $stmt->execute([$date]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
```

#### **CSRF Protection**
```php
// Generate and validate CSRF tokens
class CsrfProtection
{
    public static function generateToken(): string
    {
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        
        return $_SESSION['csrf_token'];
    }
    
    public static function validateToken(string $token): bool
    {
        return isset($_SESSION['csrf_token']) && 
               hash_equals($_SESSION['csrf_token'], $token);
    }
}
```

---

## Conclusion

Radio Adamowo represents a comprehensive, modern web application built with scalability, security, and user experience in mind. This developer guide provides all the technical information needed to understand, extend, and maintain the platform.

### Key Achievements
- ✅ **Backward Compatibility**: All original features preserved and enhanced
- ✅ **Modern Architecture**: Plugin-based, modular design
- ✅ **Security First**: Comprehensive security measures implemented
- ✅ **Performance Optimized**: Fast loading, efficient caching
- ✅ **Developer Friendly**: Well-documented, testable codebase
- ✅ **Production Ready**: Complete deployment and monitoring setup

### Next Steps
- Implement additional plugin examples
- Add GraphQL API support
- Develop mobile applications
- Enhance AI features
- Expand analytics capabilities

---

*Radio Adamowo Developer Guide v2.1.0*  
*Last Updated: January 2025*

**Development Support:**
- Technical Questions: dev@radioadamowo.pl
- Bug Reports: GitHub Issues
- Feature Requests: GitHub Discussions
- Security Issues: security@radioadamowo.pl