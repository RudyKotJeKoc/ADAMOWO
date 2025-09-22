/**
 * Radio Adamowo - Optimized Audio Application
 * Consolidated best features from all project versions
 * 
 * Key Features:
 * - HLS.js streaming with comprehensive fallback support
 * - Advanced Web Audio API with real-time visualizations  
 * - Complete Media Session API integration
 * - Multi-category playlist management
 * - Enterprise-grade CSRF-protected comment system
 * - Progressive Web App with service worker
 * - Optimized performance and error handling
 * - Cross-browser compatibility
 */

// Enhanced Application Configuration
const CONFIG = {
    STREAM_URLS: {
        main: 'https://stream.radioadamowo.pl/live.m3u8',
        fallback: 'https://backup.radioadamowo.pl/stream',
        backup: 'https://stream2.radioadamowo.pl/live'
    },
    API: {
        baseUrl: './api',
        endpoints: {
            csrf: './api-csrf-token.php',
            addComment: './api-add-comment.php', 
            getComments: './api-get-comments.php'
        }
    },
    AUDIO: {
        crossfadeDuration: 1000,
        visualizerFFTSize: 256,
        maxVolume: 0.8,
        fadeStep: 0.05,
        sampleRate: 44100,
        bufferSize: 4096
    },
    UI: {
        loadingDelay: 2000,
        notificationDuration: 4000,
        animationDuration: 300,
        debounceDelay: 500
    },
    CACHE: {
        playlistCache: 'radio-adamowo-playlists',
        commentsCache: 'radio-adamowo-comments',
        maxCacheAge: 3600000 // 1 hour
    }
};

// Advanced Application State Management
class AppState {
    constructor() {
        this.isPlaying = false;
        this.currentVolume = parseFloat(localStorage.getItem('radioVolume')) || 0.5;
        this.currentPlaylist = localStorage.getItem('currentPlaylist') || 'ambient';
        this.currentTrackIndex = parseInt(localStorage.getItem('trackIndex')) || 0;
        this.isStreamMode = localStorage.getItem('streamMode') !== 'false';
        this.csrfToken = null;
        this.lastActivity = Date.now();
        this.connectionState = 'disconnected';
        this.bufferHealth = 0;
        this.listeners = new Map();
        this.initEventSystem();
    }
    
    initEventSystem() {
        // Custom event system for state changes
        this.eventTarget = new EventTarget();
    }
    
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);
    }
    
    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
        this.eventTarget.dispatchEvent(new CustomEvent(event, { detail: data }));
    }
    
    setState(key, value) {
        const oldValue = this[key];
        this[key] = value;
        this.emit('stateChange', { key, value, oldValue });
        this.persistState(key, value);
    }
    
    persistState(key, value) {
        const persistKeys = ['currentVolume', 'currentPlaylist', 'currentTrackIndex', 'isStreamMode'];
        if (persistKeys.includes(key)) {
            localStorage.setItem(key.replace('current', '').replace('is', '').toLowerCase(), value);
        }
    }
}

// Enhanced Audio Engine with HLS and Web Audio API
class AudioEngine {
    constructor(state) {
        this.state = state;
        this.audioContext = null;
        this.audioElement = null;
        this.audioSource = null;
        this.analyser = null;
        this.gainNode = null;
        this.hls = null;
        this.isInitialized = false;
        this.visualizerData = null;
        this.crossfadeElement = null;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.reconnectTimer = null;
    }
    
    async initialize() {
        try {
            if (this.isInitialized) return true;
            
            // Initialize Web Audio Context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: CONFIG.AUDIO.sampleRate
            });
            
            // Create audio element
            this.audioElement = document.createElement('audio');
            this.audioElement.crossOrigin = 'anonymous';
            this.audioElement.preload = 'metadata';
            
            // Setup audio graph
            this.audioSource = this.audioContext.createMediaElementSource(this.audioElement);
            this.gainNode = this.audioContext.createGain();
            this.analyser = this.audioContext.createAnalyser();
            
            this.analyser.fftSize = CONFIG.AUDIO.visualizerFFTSize;
            this.visualizerData = new Uint8Array(this.analyser.frequencyBinCount);
            
            // Connect audio graph: source -> gain -> analyser -> destination
            this.audioSource.connect(this.gainNode);
            this.gainNode.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            // Set initial volume
            this.gainNode.gain.value = this.state.currentVolume;
            
            // Setup HLS if supported
            if (Hls.isSupported()) {
                this.hls = new Hls({
                    debug: false,
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                this.setupHlsEvents();
            }
            
            this.setupAudioEvents();
            this.isInitialized = true;
            this.state.emit('audioInitialized', true);
            return true;
            
        } catch (error) {
            console.error('Audio initialization failed:', error);
            this.state.emit('audioError', { type: 'initialization', error });
            return false;
        }
    }
    
    setupHlsEvents() {
        if (!this.hls) return;
        
        this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            console.log('HLS media attached successfully');
            this.state.setState('connectionState', 'connected');
        });
        
        this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
            console.log('HLS manifest parsed, levels:', data.levels.length);
            this.retryCount = 0;
        });
        
        this.hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS Error:', data);
            this.handleStreamError(data);
        });
        
        this.hls.on(Hls.Events.BUFFER_APPENDED, () => {
            const buffered = this.audioElement.buffered;
            if (buffered.length > 0) {
                const bufferEnd = buffered.end(buffered.length - 1);
                const currentTime = this.audioElement.currentTime;
                this.state.bufferHealth = Math.max(0, bufferEnd - currentTime);
            }
        });
    }
    
    setupAudioEvents() {
        this.audioElement.addEventListener('loadstart', () => {
            this.state.setState('connectionState', 'connecting');
        });
        
        this.audioElement.addEventListener('canplay', () => {
            this.state.setState('connectionState', 'ready');
        });
        
        this.audioElement.addEventListener('playing', () => {
            this.state.setState('isPlaying', true);
            this.state.setState('connectionState', 'streaming');
        });
        
        this.audioElement.addEventListener('pause', () => {
            this.state.setState('isPlaying', false);
        });
        
        this.audioElement.addEventListener('error', (e) => {
            console.error('Audio element error:', e.target.error);
            this.handleStreamError({ type: 'mediaError', details: e.target.error });
        });
        
        this.audioElement.addEventListener('stalled', () => {
            console.warn('Audio stream stalled');
            this.state.emit('streamWarning', { type: 'stalled' });
        });
        
        this.audioElement.addEventListener('waiting', () => {
            this.state.setState('connectionState', 'buffering');
        });
    }
    
    async play(url = null) {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }
            
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            const streamUrl = url || (this.state.isStreamMode ? 
                CONFIG.STREAM_URLS.main : 
                this.getCurrentPlaylistTrack().url);
            
            if (this.hls && this.state.isStreamMode) {
                await this.playHlsStream(streamUrl);
            } else {
                await this.playDirectAudio(streamUrl);
            }
            
        } catch (error) {
            console.error('Playback failed:', error);
            this.state.emit('audioError', { type: 'playback', error });
        }
    }
    
    async playHlsStream(url) {
        if (!this.hls) {
            throw new Error('HLS not supported');
        }
        
        this.hls.loadSource(url);
        this.hls.attachMedia(this.audioElement);
        
        return new Promise((resolve, reject) => {
            const onReady = () => {
                this.audioElement.play()
                    .then(resolve)
                    .catch(reject);
                this.hls.off(Hls.Events.MANIFEST_PARSED, onReady);
            };
            
            this.hls.on(Hls.Events.MANIFEST_PARSED, onReady);
            
            setTimeout(() => {
                reject(new Error('HLS loading timeout'));
            }, 10000);
        });
    }
    
    async playDirectAudio(url) {
        this.audioElement.src = url;
        return this.audioElement.play();
    }
    
    pause() {
        if (this.audioElement) {
            this.audioElement.pause();
        }
    }
    
    setVolume(volume) {
        volume = Math.max(0, Math.min(1, volume));
        this.state.setState('currentVolume', volume);
        
        if (this.gainNode) {
            // Smooth volume transition
            this.gainNode.gain.setTargetAtTime(
                volume, 
                this.audioContext.currentTime, 
                0.1
            );
        }
    }
    
    getVisualizerData() {
        if (this.analyser && this.visualizerData) {
            this.analyser.getByteFrequencyData(this.visualizerData);
            return this.visualizerData;
        }
        return null;
    }
    
    handleStreamError(data) {
        this.retryCount++;
        this.state.setState('connectionState', 'error');
        
        if (this.retryCount <= this.maxRetries) {
            console.log(`Retrying connection (${this.retryCount}/${this.maxRetries})`);
            this.scheduleReconnect();
        } else {
            console.error('Max retries exceeded, trying fallback');
            this.tryFallbackStream();
        }
    }
    
    scheduleReconnect() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }
        
        const delay = Math.min(1000 * Math.pow(2, this.retryCount), 30000);
        this.reconnectTimer = setTimeout(() => {
            this.play();
        }, delay);
    }
    
    tryFallbackStream() {
        const fallbackUrl = CONFIG.STREAM_URLS.fallback;
        console.log('Attempting fallback stream:', fallbackUrl);
        this.retryCount = 0;
        this.play(fallbackUrl);
    }
    
    getCurrentPlaylistTrack() {
        const playlist = PlaylistManager.getPlaylist(this.state.currentPlaylist);
        return playlist[this.state.currentTrackIndex] || playlist[0];
    }
}

// Enhanced Playlist Manager
class PlaylistManager {
    static playlists = new Map();
    static isLoaded = false;
    
    static async loadPlaylists() {
        if (this.isLoaded) return;
        
        try {
            const response = await fetch('./playlist.json');
            const playlistData = await response.json();
            
            // Process and categorize playlists
            const categorized = this.categorizePlaylist(playlistData);
            
            // Store in Map for efficient access
            Object.entries(categorized).forEach(([category, tracks]) => {
                this.playlists.set(category, tracks);
            });
            
            // Cache playlists
            localStorage.setItem(CONFIG.CACHE.playlistCache, JSON.stringify(categorized));
            this.isLoaded = true;
            
        } catch (error) {
            console.error('Failed to load playlists:', error);
            this.loadCachedPlaylists();
        }
    }
    
    static categorizePlaylist(playlistData) {
        const categorized = {
            ambient: [],
            disco: [],
            hiphop: [],
            podcasts: []
        };
        
        playlistData.forEach(item => {
            if (item.category) {
                categorized[item.category] = categorized[item.category] || [];
                categorized[item.category].push({
                    title: item.title || `Track ${categorized[item.category].length + 1}`,
                    artist: item.artist || 'Nieznany Artysta',
                    url: item.file || item.url
                });
            }
        });
        
        return categorized;
    }
    
    static loadCachedPlaylists() {
        try {
            const cached = localStorage.getItem(CONFIG.CACHE.playlistCache);
            if (cached) {
                const data = JSON.parse(cached);
                Object.entries(data).forEach(([category, tracks]) => {
                    this.playlists.set(category, tracks);
                });
                this.isLoaded = true;
            }
        } catch (error) {
            console.error('Failed to load cached playlists:', error);
        }
    }
    
    static getPlaylist(category) {
        return this.playlists.get(category) || [];
    }
    
    static getAllPlaylists() {
        return Object.fromEntries(this.playlists);
    }
}

// Enhanced UI Controller
class UIController {
    constructor(state, audioEngine) {
        this.state = state;
        this.audioEngine = audioEngine;
        this.elements = {};
        this.animations = new Map();
        this.debounceTimers = new Map();
        this.initializeElements();
        this.setupEventListeners();
    }
    
    initializeElements() {
        // Cache DOM elements
        this.elements = {
            startBtn: document.getElementById('start-btn'),
            playBtn: document.getElementById('play-btn'),
            pauseBtn: document.getElementById('pause-btn'),
            volumeSlider: document.getElementById('volume-slider'),
            visualizerCanvas: document.getElementById('visualizer-canvas'),
            playlistSelect: document.getElementById('playlist-select'),
            statusDisplay: document.getElementById('status'),
            nowPlaying: document.getElementById('now-playing'),
            connectionStatus: document.getElementById('connection-status'),
            bufferIndicator: document.getElementById('buffer-indicator')
        };
    }
    
    setupEventListeners() {
        // State change listeners
        this.state.on('stateChange', (data) => {
            this.handleStateChange(data);
        });
        
        // UI event listeners with debouncing
        this.setupDebouncedListener('volumeSlider', 'input', (e) => {
            this.audioEngine.setVolume(parseFloat(e.target.value));
        }, 100);
        
        this.setupDebouncedListener('playlistSelect', 'change', (e) => {
            this.state.setState('currentPlaylist', e.target.value);
        }, 0);
        
        // Button listeners
        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => this.handleStart());
        }
        
        if (this.elements.playBtn) {
            this.elements.playBtn.addEventListener('click', () => this.handlePlay());
        }
        
        if (this.elements.pauseBtn) {
            this.elements.pauseBtn.addEventListener('click', () => this.handlePause());
        }
    }
    
    setupDebouncedListener(elementKey, event, callback, delay) {
        const element = this.elements[elementKey];
        if (!element) return;
        
        element.addEventListener(event, (e) => {
            const timerId = `${elementKey}-${event}`;
            
            if (this.debounceTimers.has(timerId)) {
                clearTimeout(this.debounceTimers.get(timerId));
            }
            
            this.debounceTimers.set(timerId, setTimeout(() => {
                callback(e);
                this.debounceTimers.delete(timerId);
            }, delay));
        });
    }
    
    handleStateChange(data) {
        const { key, value } = data;
        
        switch (key) {
            case 'isPlaying':
                this.updatePlayButton(value);
                break;
            case 'currentVolume':
                this.updateVolumeSlider(value);
                break;
            case 'connectionState':
                this.updateConnectionStatus(value);
                break;
            case 'currentPlaylist':
                this.updatePlaylistDisplay(value);
                break;
        }
    }
    
    updatePlayButton(isPlaying) {
        if (this.elements.playBtn) {
            this.elements.playBtn.style.display = isPlaying ? 'none' : 'block';
        }
        if (this.elements.pauseBtn) {
            this.elements.pauseBtn.style.display = isPlaying ? 'block' : 'none';
        }
    }
    
    updateVolumeSlider(volume) {
        if (this.elements.volumeSlider && !this.debounceTimers.has('volumeSlider-input')) {
            this.elements.volumeSlider.value = volume;
        }
    }
    
    updateConnectionStatus(status) {
        if (this.elements.connectionStatus) {
            this.elements.connectionStatus.textContent = this.getStatusText(status);
            this.elements.connectionStatus.className = `status-${status}`;
        }
    }
    
    getStatusText(status) {
        const statusTexts = {
            'disconnected': 'Rozłączono',
            'connecting': 'Łączenie...',
            'connected': 'Połączono',
            'ready': 'Gotowy',
            'streaming': 'Odtwarzanie',
            'buffering': 'Buforowanie...',
            'error': 'Błąd połączenia'
        };
        
        return statusTexts[status] || status;
    }
    
    async handleStart() {
        try {
            await this.audioEngine.initialize();
            this.showMainInterface();
        } catch (error) {
            console.error('Failed to start audio:', error);
            this.showError('Nie udało się zainicjować audio');
        }
    }
    
    async handlePlay() {
        try {
            await this.audioEngine.play();
        } catch (error) {
            console.error('Playback failed:', error);
            this.showError('Nie udało się rozpocząć odtwarzania');
        }
    }
    
    handlePause() {
        this.audioEngine.pause();
    }
    
    showMainInterface() {
        const overlay = document.getElementById('autoplay-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
    
    showError(message) {
        // Implement error display logic
        console.error('UI Error:', message);
        // You can enhance this with actual UI error display
    }
}

// Enhanced Application Initializer
class RadioAdamowoApp {
    constructor() {
        this.state = new AppState();
        this.audioEngine = new AudioEngine(this.state);
        this.uiController = new UIController(this.state, this.audioEngine);
        this.visualizer = null;
        this.mediaSession = null;
        this.commentSystem = null;
        this.isInitialized = false;
    }
    
    async initialize() {
        if (this.isInitialized) return;
        
        try {
            // Load playlists
            await PlaylistManager.loadPlaylists();
            
            // Initialize visualizer if canvas exists
            const canvas = document.getElementById('visualizer-canvas');
            if (canvas) {
                this.visualizer = new AudioVisualizer(canvas, this.audioEngine);
            }
            
            // Initialize Media Session API
            this.initializeMediaSession();
            
            // Initialize comment system
            this.initializeCommentSystem();
            
            // Setup service worker registration
            this.registerServiceWorker();
            
            this.isInitialized = true;
            console.log('Radio Adamowo app initialized successfully');
            
        } catch (error) {
            console.error('App initialization failed:', error);
        }
    }
    
    initializeMediaSession() {
        if ('mediaSession' in navigator) {
            this.mediaSession = new MediaSessionController(this.state, this.audioEngine);
        }
    }
    
    initializeCommentSystem() {
        const commentContainer = document.getElementById('comments-container');
        if (commentContainer) {
            this.commentSystem = new CommentSystem(commentContainer);
        }
    }
    
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw-optimized.js');
                console.log('Optimized Service Worker registered successfully:', registration);
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    console.log('Service Worker update found');
                });
                
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    const app = new RadioAdamowoApp();
    await app.initialize();
    
    // Export to global scope for debugging
    window.RadioAdamowo = app;
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RadioAdamowoApp, CONFIG };
}