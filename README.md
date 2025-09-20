# Radio Adamowo - Professional Educational Web Radio

🎵 **Modern Progressive Web Application** for educational content about psychological manipulation and toxic relationships.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/RudyKotJeKoc/ADAMOWO)
[![Security Status](https://img.shields.io/badge/security-enhanced-green)](https://github.com/RudyKotJeKoc/ADAMOWO)
[![PWA Ready](https://img.shields.io/badge/PWA-ready-blue)](https://github.com/RudyKotJeKoc/ADAMOWO)
[![Multi-language](https://img.shields.io/badge/i18n-pl%20%7C%20en%20%7C%20nl-orange)](https://github.com/RudyKotJeKoc/ADAMOWO)

## 🚀 Professional Features

### 🔒 **Enterprise-Grade Security**
- **CSRF Protection**: Complete protection against cross-site request forgery
- **SQL Injection Prevention**: Prepared statements and input validation
- **XSS Protection**: Output sanitization and content security policy
- **Rate Limiting**: Comprehensive rate limiting for API endpoints
- **Secure Sessions**: HTTPOnly, secure cookies with proper lifetime management

### 🌍 **Multi-language Support**
- **Polish (pl)**: Native language with complete translations
- **English (en)**: Full international support
- **Dutch (nl)**: Additional European language support
- **Automatic Detection**: Browser language detection with manual override
- **Dynamic Switching**: Change language without page reload

### 📻 **Advanced Audio System**
- **HLS Streaming**: Live stream support with HLS.js
- **Multiple Fallbacks**: Comprehensive fallback strategy for maximum compatibility
- **Web Audio API**: Real-time audio visualization and processing
- **Media Session API**: System-level media controls and notifications
- **Playlist Management**: Categorized playlists with metadata support

### 📱 **Progressive Web App**
- **Offline Support**: Complete offline functionality with service worker
- **Installation**: Add to home screen on mobile and desktop
- **Push Notifications**: Background sync and push notification support
- **App Shortcuts**: Quick actions from home screen
- **Responsive Design**: Mobile-first design with desktop optimization

### 🎓 **Educational Content System**
- **Interactive Calendar**: Event-based content with comment system
- **Podcast Integration**: Educational podcast episodes with metadata
- **Content Categories**: Organized content by topics and difficulty
- **Progress Tracking**: User progress and achievement system

## 🏗 **Architecture Overview**

### **Modular Frontend**
```
├── app-optimized.js         # Main application controller
├── src/
│   ├── i18n.js             # Internationalization manager
│   └── plugins.js          # Plugin system architecture
├── lang/                   # Translation files
│   ├── pl.json            # Polish translations
│   ├── en.json            # English translations
│   └── nl.json            # Dutch translations
└── sw-optimized.js         # Service worker for PWA features
```

### **Secure Backend**
```
├── api/v1/                 # REST API endpoints
│   ├── config.php         # API configuration
│   ├── comments.php       # Comment system API
│   ├── stream.php         # Streaming API
│   └── notifications.php  # Push notifications
├── config-enhanced.php     # Enhanced security configuration
├── get_comments.php        # Secure comment retrieval
├── add_comment.php         # Secure comment addition
└── get_csrf_token.php      # CSRF token generation
```

## ✨ Features

### 🔴 Live Streaming
- **HLS.js integration** for modern browsers
- **Safari native HLS** support
- **Automatic fallback** streaming
- **Real-time visualizations** with Web Audio API

### 🎵 Multi-Category Playlists
- **Barbara-themed psychological tracks** 
- **Disco, Hip-Hop, Ambient** music categories
- **Educational podcasts** and audio content
- **Crossfade transitions** between tracks

### 🔒 Security & Privacy
- **CSRF protection** with rate limiting
- **SQL injection prevention** 
- **Input validation** and XSS protection
- **Privacy-first** approach with local data

### 📱 Progressive Web App
- **Installable** on desktop and mobile
- **Offline-first** with intelligent caching
- **Responsive design** for all devices
- **Lighthouse optimized** performance

### ♿ Accessibility
- **ARIA labels** for screen readers
- **Keyboard navigation** support
- **Semantic HTML** structure
- **High contrast** themes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PHP 8.0+
- MySQL/MariaDB database
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RudyKotJeKoc/ADAMOWO.git
   cd ADAMOWO
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure database**
   ```bash
   # Copy and edit database configuration
   cp db_config_example.php db_config.php
   # Edit db_config.php with your database credentials
   ```

4. **Set up database schema**
   ```bash
   # Import the database schema
   mysql -u your_user -p your_database < schema-comprehensive.sql
   ```

5. **Development server**
   ```bash
   npm run dev
   ```

6. **Production build**
   ```bash
   npm run build
   npm run preview
   ```

## 📁 Project Structure

```
ADAMOWO/
├── index.html              # Main application page
├── app.js                  # Core application logic
├── styles.css              # Custom styles and themes
├── manifest.json           # PWA manifest
├── sw-comprehensive.js     # Service worker
├── playlist.json           # Barbara-themed track list
├── add_comment.php         # Comment system backend
├── get_csrf_token.php      # CSRF protection
├── images/                 # Application assets
└── docs/                   # Additional documentation
```

## 🎵 Live Streaming Setup

The application supports live HLS streaming. Configure your stream URLs in `app.js`:

```javascript
const STREAM_URL = 'https://your-domain.com/live.m3u8';
const FALLBACK_URL = 'https://backup-domain.com/stream';
```

## 💬 Comment System

The interactive calendar comment system includes:

- **CSRF protection** for secure submissions
- **Rate limiting** (5 comments per 10 minutes)
- **Input validation** and XSS protection
- **Persistent storage** with MySQL/MariaDB

## 🔧 Configuration

### Environment Variables
Create a `.env` file for sensitive configuration:

```env
DB_HOST=localhost
DB_NAME=radio_adamowo
DB_USER=your_user
DB_PASS=your_password
STREAM_URL=your_stream_url
```

### PWA Configuration
Edit `manifest.json` for your deployment:

```json
{
  "name": "Your Radio Name",
  "start_url": "/",
  "theme_color": "#f59e0b",
  "background_color": "#000000"
}
```

## 🧪 Testing & Quality

### Lighthouse Performance
Run audits to maintain high quality scores:

```bash
npm run lighthouse
```

**Target Scores:**
- ✅ Performance: 90+
- ✅ Accessibility: 95+  
- ✅ Best Practices: 95+
- ✅ SEO: 90+
- ✅ PWA: 100

### Security Testing
Regular security assessments:

- **CSRF protection** validation
- **SQL injection** prevention tests  
- **XSS vulnerability** scans
- **Rate limiting** verification

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- **ESLint** for JavaScript linting
- **Prettier** for code formatting
- **Semantic commits** with clear messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 **Email**: contact@radioadamowo.pl
- 🐛 **Issues**: [GitHub Issues](https://github.com/RudyKotJeKoc/ADAMOWO/issues)
- 📖 **Docs**: [Wiki](https://github.com/RudyKotJeKoc/ADAMOWO/wiki)

## 🙏 Acknowledgments

- **HLS.js** for live streaming support
- **GSAP** for animations
- **Tailwind CSS** for styling
- **Chart.js** for data visualization

---

⭐ **Star this repo** if you find it helpful!