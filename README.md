# Radio Adamowo - Educational Web Radio

🎵 **Modern Progressive Web Application** for educational content about psychological manipulation and toxic relationships.

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