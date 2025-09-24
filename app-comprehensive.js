/**
 * Radio Adamowo - Comprehensive Audio Application
 * Enhanced version combining best features from all project variants
 * 
 * Features:
 * - HLS.js streaming with Safari fallback
 * - Web Audio API visualizations
 * - Media Session API integration
 * - Multi-category playlists
 * - CSRF-protected comment system
 * - Service Worker integration
 * - Progressive loading and error handling
 */

// Application constants and configuration
const CONFIG = {
    STREAM_URLS: {
        main: 'https://stream.radioadamowo.pl/live.m3u8',
        fallback: 'https://backup.radioadamowo.pl/stream',
    },
    API: {
        baseUrl: './api',
        endpoints: {
            csrf: './get_csrf_token.php',
            addComment: './add_comment.php',
            getComments: './get_comments.php'
        }
    },
    AUDIO: {
        crossfadeDuration: 1000,
        visualizerFFTSize: 256,
        maxVolume: 0.8,
        fadeStep: 0.05
    },
    UI: {
        loadingDelay: 3000,
        notificationDuration: 3000,
        animationDuration: 500
    }
};

// Application state management
class AppState {
    constructor() {
        this.isPlaying = false;
        this.currentVolume = 0.5;
        this.currentPlaylist = 'ambient';
        this.currentTrackIndex = 0;
        this.isStreamMode = true;
        this.csrfToken = null;
        this.playlists = {
            ambient: [],
            disco: [],
            hiphop: [],
            podcasts: []
        };
    }

    updateState(key, value) {
        this[key] = value;
        this.saveToStorage();
        this.notifyStateChange(key, value);
    }

    saveToStorage() {
        try {
            const state = {
                currentVolume: this.currentVolume,
                currentPlaylist: this.currentPlaylist,
                isStreamMode: this.isStreamMode
            };
            localStorage.setItem('radioAdamowoState', JSON.stringify(state));
        } catch (error) {
            console.warn('Failed to save state to localStorage:', error);
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('radioAdamowoState');
            if (saved) {
                const state = JSON.parse(saved);
                Object.assign(this, state);
            }
        } catch (error) {
            console.warn('Failed to load state from localStorage:', error);
        }
    }

    notifyStateChange(key, value) {
        window.dispatchEvent(new CustomEvent('appStateChange', {
            detail: { key, value }
        }));
    }
}

// Enhanced Audio Engine with HLS support
class AudioEngine {
    constructor() {
        this.audioContext = null;
        this.audioSource = null;
        this.analyser = null;
        this.gainNode = null;
        this.currentAudio = null;
        this.hls = null;
        this.isInitialized = false;
        this.visualizerData = null;
    }

    async initialize() {
        if (this.isInitialized) return;

        try {
            // Initialize Web Audio Context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            // Create audio graph
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = CONFIG.AUDIO.visualizerFFTSize;
            this.gainNode = this.audioContext.createGain();
            this.gainNode.gain.value = appState.currentVolume;

            // Connect nodes
            this.gainNode.connect(this.audioContext.destination);
            this.analyser.connect(this.gainNode);

            this.visualizerData = new Uint8Array(this.analyser.frequencyBinCount);
            this.isInitialized = true;

            console.log('Audio engine initialized successfully');
        } catch (error) {
            console.error('Failed to initialize audio engine:', error);
            throw error;
        }
    }

    async startStream(url = CONFIG.STREAM_URLS.main) {
        await this.initialize();

        try {
            // Stop any existing audio
            this.stop();

            // Create new audio element
            this.currentAudio = new Audio();
            this.currentAudio.crossOrigin = 'anonymous';
            this.currentAudio.preload = 'none';
            
            // Set up HLS if supported
            if (Hls.isSupported()) {
                this.hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                
                this.hls.loadSource(url);
                this.hls.attachMedia(this.currentAudio);
                
                this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    console.log('HLS manifest loaded successfully');
                });

                this.hls.on(Hls.Events.ERROR, (event, data) => {
                    if (data.fatal) {
                        this.handleStreamError(data);
                    }
                });
            } else if (this.currentAudio.canPlayType('application/vnd.apple.mpegurl')) {
                // Native HLS support (Safari)
                this.currentAudio.src = url;
            } else {
                throw new Error('HLS not supported in this browser');
            }

            // Connect to Web Audio API
            if (!this.audioSource) {
                this.audioSource = this.audioContext.createMediaElementSource(this.currentAudio);
                this.audioSource.connect(this.analyser);
            }

            // Set up event listeners
            this.setupAudioEvents();

            // Start playback
            await this.currentAudio.play();
            appState.updateState('isPlaying', true);

            // Update Media Session
            this.updateMediaSession({
                title: 'Radio Adamowo - Live Stream',
                artist: 'Radio Adamowo',
                artwork: [
                    { src: '/images/radio-logo-96.png', sizes: '96x96', type: 'image/png' },
                    { src: '/images/radio-logo-256.png', sizes: '256x256', type: 'image/png' },
                    { src: '/images/radio-logo-512.png', sizes: '512x512', type: 'image/png' }
                ]
            });

            return true;
        } catch (error) {
            console.error('Stream start failed:', error);
            await this.tryFallbackStream();
            return false;
        }
    }

    async tryFallbackStream() {
        console.log('Attempting fallback stream...');
        try {
            await this.startStream(CONFIG.STREAM_URLS.fallback);
        } catch (error) {
            console.error('Fallback stream also failed:', error);
            this.showError('Unable to connect to radio stream. Please check your connection and try again.');
        }
    }

    setupAudioEvents() {
        if (!this.currentAudio) return;

        this.currentAudio.addEventListener('loadstart', () => {
            console.log('Audio loading started');
            this.showNotification('Connecting to stream...', 'info');
        });

        this.currentAudio.addEventListener('canplay', () => {
            console.log('Audio can start playing');
            this.hideLoadingIndicator();
        });

        this.currentAudio.addEventListener('playing', () => {
            console.log('Audio started playing');
            this.hideNotification();
            this.startVisualizer();
        });

        this.currentAudio.addEventListener('pause', () => {
            console.log('Audio paused');
            appState.updateState('isPlaying', false);
        });

        this.currentAudio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.handleAudioError(e);
        });

        this.currentAudio.addEventListener('stalled', () => {
            this.showNotification('Stream buffering...', 'warning');
        });
    }

    stop() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }

        if (this.hls) {
            this.hls.destroy();
            this.hls = null;
        }

        if (this.audioSource) {
            this.audioSource.disconnect();
            this.audioSource = null;
        }

        appState.updateState('isPlaying', false);
        this.stopVisualizer();
    }

    setVolume(volume) {
        if (this.gainNode) {
            const clampedVolume = Math.max(0, Math.min(1, volume));
            this.gainNode.gain.setValueAtTime(clampedVolume, this.audioContext.currentTime);
            appState.updateState('currentVolume', clampedVolume);
        }
    }

    startVisualizer() {
        if (!this.analyser || !this.visualizerData) return;

        const animate = () => {
            if (!appState.isPlaying) return;

            this.analyser.getByteFrequencyData(this.visualizerData);
            this.updateVisualizer(this.visualizerData);
            requestAnimationFrame(animate);
        };

        animate();
    }

    stopVisualizer() {
        // Visualizer stops automatically when isPlaying becomes false
    }

    updateVisualizer(data) {
        // This will be called by the UI visualizer component
        window.dispatchEvent(new CustomEvent('visualizerUpdate', { detail: data }));
    }

    updateMediaSession(metadata) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata(metadata);
            
            navigator.mediaSession.setActionHandler('play', () => {
                if (this.currentAudio) {
                    this.currentAudio.play();
                }
            });

            navigator.mediaSession.setActionHandler('pause', () => {
                if (this.currentAudio) {
                    this.currentAudio.pause();
                }
            });

            navigator.mediaSession.setActionHandler('stop', () => {
                this.stop();
            });
        }
    }

    handleStreamError(data) {
        console.error('HLS Error:', data);
        
        switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
                this.showError('Network error occurred. Attempting to recover...');
                if (this.hls) {
                    this.hls.startLoad();
                }
                break;
            case Hls.ErrorTypes.MEDIA_ERROR:
                this.showError('Media error occurred. Attempting to recover...');
                if (this.hls) {
                    this.hls.recoverMediaError();
                }
                break;
            default:
                this.showError('Playback error occurred. Please refresh and try again.');
                break;
        }
    }

    handleAudioError(error) {
        console.error('Audio playback error:', error);
        this.showError('Audio playback failed. Please check your connection.');
    }

    showNotification(message, type = 'info') {
        window.dispatchEvent(new CustomEvent('showNotification', {
            detail: { message, type }
        }));
    }

    hideNotification() {
        window.dispatchEvent(new CustomEvent('hideNotification'));
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    hideLoadingIndicator() {
        window.dispatchEvent(new CustomEvent('hideLoading'));
    }
}

// Enhanced UI Manager with GSAP animations
class UIManager {
    constructor() {
        this.elements = {};
        this.notifications = [];
        this.isInitialized = false;
    }

    initialize() {
        if (this.isInitialized) return;

        // Cache DOM elements
        this.cacheElements();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize animations
        this.initializeAnimations();
        
        // Set up visualizer
        this.setupVisualizer();
        
        this.isInitialized = true;
        console.log('UI Manager initialized');
    }

    cacheElements() {
        this.elements = {
            startBtn: document.getElementById('start-btn'),
            playPauseBtn: document.getElementById('play-pause-btn'),
            volumeSlider: document.getElementById('volume-slider'),
            playlistSelect: document.getElementById('playlist-select'),
            visualizerCanvas: document.getElementById('visualizer-canvas'),
            loadingScreen: document.getElementById('loading-screen'),
            notificationContainer: document.getElementById('notification-container'),
            playerInfo: document.getElementById('player-info'),
            streamToggle: document.getElementById('stream-toggle')
        };
    }

    setupEventListeners() {
        // Play/Pause button
        if (this.elements.playPauseBtn) {
            this.elements.playPauseBtn.addEventListener('click', () => {
                this.togglePlayback();
            });
        }

        // Volume control
        if (this.elements.volumeSlider) {
            this.elements.volumeSlider.addEventListener('input', (e) => {
                const volume = parseFloat(e.target.value);
                audioEngine.setVolume(volume);
                this.updateVolumeDisplay(volume);
            });
        }

        // Playlist selection
        if (this.elements.playlistSelect) {
            this.elements.playlistSelect.addEventListener('change', (e) => {
                appState.updateState('currentPlaylist', e.target.value);
            });
        }

        // Stream mode toggle
        if (this.elements.streamToggle) {
            this.elements.streamToggle.addEventListener('change', (e) => {
                appState.updateState('isStreamMode', e.target.checked);
            });
        }

        // Custom events
        window.addEventListener('visualizerUpdate', (e) => {
            this.updateVisualizerCanvas(e.detail);
        });

        window.addEventListener('showNotification', (e) => {
            this.showNotification(e.detail.message, e.detail.type);
        });

        window.addEventListener('hideNotification', () => {
            this.hideNotification();
        });

        window.addEventListener('appStateChange', (e) => {
            this.handleStateChange(e.detail.key, e.detail.value);
        });
    }

    initializeAnimations() {
        // GSAP timeline for loading screen
        this.loadingTimeline = gsap.timeline();
        
        // Set up scroll triggers and other animations
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.create({
                trigger: ".hero-section",
                start: "top center",
                animation: gsap.from(".hero-content", {
                    duration: 1,
                    y: 100,
                    opacity: 0,
                    ease: "power2.out"
                })
            });
        }
    }

    setupVisualizer() {
        const canvas = this.elements.visualizerCanvas;
        if (!canvas) return;

        this.visualizerCtx = canvas.getContext('2d');
        this.resizeVisualizer();
        
        window.addEventListener('resize', () => this.resizeVisualizer());
    }

    resizeVisualizer() {
        const canvas = this.elements.visualizerCanvas;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        
        this.visualizerCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    updateVisualizerCanvas(data) {
        if (!this.visualizerCtx || !data) return;

        const canvas = this.elements.visualizerCanvas;
        const ctx = this.visualizerCtx;
        const width = canvas.width / window.devicePixelRatio;
        const height = canvas.height / window.devicePixelRatio;

        // Clear canvas
        ctx.fillStyle = 'rgba(18, 18, 18, 0.3)';
        ctx.fillRect(0, 0, width, height);

        // Draw frequency bars
        const barWidth = width / data.length;
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, '#f59e0b');
        gradient.addColorStop(0.5, '#fbbf24');
        gradient.addColorStop(1, '#fde047');

        for (let i = 0; i < data.length; i++) {
            const barHeight = (data[i] / 255) * height * 0.8;
            const x = i * barWidth;
            const y = height - barHeight;

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth - 1, barHeight);
        }
    }

    async togglePlayback() {
        if (appState.isPlaying) {
            audioEngine.stop();
            this.updatePlayButton(false);
        } else {
            this.showLoadingIndicator();
            const success = await audioEngine.startStream();
            if (success) {
                this.updatePlayButton(true);
            }
            this.hideLoadingIndicator();
        }
    }

    updatePlayButton(isPlaying) {
        const btn = this.elements.playPauseBtn;
        if (!btn) return;

        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
        
        btn.setAttribute('aria-label', isPlaying ? 'Pause' : 'Play');
        btn.title = isPlaying ? 'Pause Radio' : 'Play Radio';
    }

    updateVolumeDisplay(volume) {
        const percentage = Math.round(volume * 100);
        const display = document.getElementById('volume-display');
        if (display) {
            display.textContent = `${percentage}%`;
        }
    }

    showNotification(message, type = 'info', duration = CONFIG.UI.notificationDuration) {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;

        if (this.elements.notificationContainer) {
            this.elements.notificationContainer.appendChild(notification);
        }

        // Animate in
        gsap.fromTo(notification, 
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
        );

        // Auto-hide after duration
        setTimeout(() => {
            this.hideNotification(notification);
        }, duration);
    }

    hideNotification(notification = null) {
        const target = notification || this.elements.notificationContainer?.lastElementChild;
        if (!target) return;

        gsap.to(target, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => target.remove()
        });
    }

    showLoadingIndicator() {
        const loader = document.getElementById('audio-loading');
        if (loader) {
            loader.style.display = 'block';
            gsap.fromTo(loader, 
                { opacity: 0 },
                { opacity: 1, duration: 0.3 }
            );
        }
    }

    hideLoadingIndicator() {
        const loader = document.getElementById('audio-loading');
        if (loader) {
            gsap.to(loader, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    loader.style.display = 'none';
                }
            });
        }
    }

    handleStateChange(key, value) {
        switch (key) {
            case 'isPlaying':
                this.updatePlayButton(value);
                break;
            case 'currentVolume':
                this.updateVolumeDisplay(value);
                break;
            case 'currentPlaylist':
                // Update playlist UI
                break;
        }
    }
}

// Comment System with CSRF Protection
class CommentSystem {
    constructor() {
        this.csrfToken = null;
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;

        await this.refreshCSRFToken();
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('Comment system initialized');
    }

    async refreshCSRFToken() {
        try {
            const response = await fetch(CONFIG.API.endpoints.csrf, {
                method: 'GET',
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                this.csrfToken = data.token;
                appState.csrfToken = data.token;
            } else {
                throw new Error(data.message || 'Failed to get CSRF token');
            }
        } catch (error) {
            console.error('Failed to refresh CSRF token:', error);
            uiManager.showNotification('Security token refresh failed. Please reload the page.', 'error');
        }
    }

    setupEventListeners() {
        const commentForm = document.getElementById('comment-form');
        if (commentForm) {
            commentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCommentSubmit(e.target);
            });
        }

        const calendarDays = document.querySelectorAll('.calendar-day');
        calendarDays.forEach(day => {
            day.addEventListener('click', (e) => {
                this.handleDayClick(e.target);
            });
        });
    }

    async handleCommentSubmit(form) {
        const formData = new FormData(form);
        
        // Add CSRF token
        formData.append('csrf_token', this.csrfToken);
        
        try {
            const response = await fetch(CONFIG.API.endpoints.addComment, {
                method: 'POST',
                body: formData,
                credentials: 'same-origin'
            });
            
            const data = await response.json();
            
            if (data.success) {
                uiManager.showNotification('Comment added successfully!', 'success');
                form.reset();
                await this.loadComments(formData.get('date'));
            } else {
                throw new Error(data.message || 'Failed to add comment');
            }
        } catch (error) {
            console.error('Comment submission failed:', error);
            uiManager.showNotification('Failed to add comment. Please try again.', 'error');
            
            // Refresh CSRF token on failure
            await this.refreshCSRFToken();
        }
    }

    async loadComments(date) {
        try {
            const response = await fetch(`${CONFIG.API.endpoints.getComments}?date=${encodeURIComponent(date)}`, {
                credentials: 'same-origin'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                this.renderComments(data.comments, date);
            } else {
                throw new Error(data.message || 'Failed to load comments');
            }
        } catch (error) {
            console.error('Failed to load comments:', error);
            uiManager.showNotification('Failed to load comments for this date.', 'error');
        }
    }

    renderComments(comments, date) {
        const container = document.getElementById('comments-container');
        if (!container) return;

        container.innerHTML = '';

        if (comments.length === 0) {
            container.innerHTML = '<p class="text-gray-500">No comments for this date.</p>';
            return;
        }

        const commentsList = document.createElement('div');
        commentsList.className = 'comments-list space-y-4';

        comments.forEach(comment => {
            const commentElement = this.createCommentElement(comment);
            commentsList.appendChild(commentElement);
        });

        container.appendChild(commentsList);
    }

    createCommentElement(comment) {
        const element = document.createElement('div');
        element.className = 'comment bg-gray-800 p-4 rounded-lg';
        
        const sanitizedName = this.escapeHtml(comment.name);
        const sanitizedText = this.escapeHtml(comment.text);
        const formattedDate = new Date(comment.created_at).toLocaleString('pl-PL');
        
        element.innerHTML = `
            <div class="comment-header flex justify-between items-center mb-2">
                <span class="comment-author font-semibold text-amber-400">${sanitizedName}</span>
                <span class="comment-date text-sm text-gray-400">${formattedDate}</span>
            </div>
            <div class="comment-text text-gray-200">${sanitizedText}</div>
        `;
        
        return element;
    }

    handleDayClick(dayElement) {
        const date = dayElement.dataset.date;
        if (date) {
            this.loadComments(date);
            this.highlightSelectedDay(dayElement);
        }
    }

    highlightSelectedDay(selectedDay) {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });
        
        // Add selection to clicked day
        selectedDay.classList.add('selected');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Supabase Integration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// It's assumed the Supabase client library is loaded globally, e.g. via a script tag.
// In a module-based environment, you would use: import { createClient } from '@supabase/supabase-js'
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getPlayableUrl(storagePath) {
    if (!storagePath) return null;
    const [bucket, ...rest] = storagePath.split("/");
    const path = rest.join("/");

    const { data, error } = await supabaseClient
        .storage
        .from(bucket)
        .createSignedUrl(path, 3600); // URL valid for 1 hour

    if (error) {
        console.error(`Error creating signed URL for ${storagePath}:`, error);
        return null;
    }
    return data.signedUrl;
}

async function fetchPlaylistFromSupabase(slug) {
    const { data, error } = await supabaseClient.rpc("get_playlist", { p_slug: slug });
    if (error) {
        console.error(`Error fetching playlist '${slug}':`, error);
        throw error;
    }

    const enriched = await Promise.all(
        data.map(async (item) => ({
            ...item,
            url: item.storage_path
                ? await getPlayableUrl(item.storage_path)
                : item.stream_url,
        }))
    );
    return enriched;
}


// Playlist Management
class PlaylistManager {
    constructor() {
        this.playlists = {}; // Will be populated from Supabase
        this.isLoaded = false;
        this.availablePlaylists = []; // Holds { slug, name }
    }

    async initialize() {
        if (this.isLoaded) return;

        try {
            await this.loadPlaylists();
            this.setupPlaylistUI();
            this.isLoaded = true;
            console.log('Playlist manager initialized with Supabase data');
        } catch (error) {
            console.error('Failed to initialize playlist manager:', error);
            uiManager.showNotification('Could not load playlists from database.', 'error');
        }
    }

    async loadPlaylists() {
        console.log('Loading playlists from Supabase...');
        const { data, error } = await supabaseClient
            .from('playlists')
            .select('slug, title')
            .eq('is_public', true)
            .order('title');

        if (error) {
            console.error('Error fetching playlist definitions:', error);
            throw error;
        }

        this.availablePlaylists = data.map(p => ({ slug: p.slug, name: p.title }));

        // Load the first playlist by default or a default one
        const defaultPlaylistSlug = appState.currentPlaylist || this.availablePlaylists[0]?.slug || 'analizy';
        await this.loadSpecificPlaylist(defaultPlaylistSlug);
        
        // Update app state with all available playlists
        appState.playlists = this.playlists;
    }

    async loadSpecificPlaylist(slug) {
        if (this.playlists[slug]) {
             console.log(`Playlist '${slug}' already loaded.`);
             return;
        }
        console.log(`Fetching playlist '${slug}'...`);
        try {
            const playlistTracks = await fetchPlaylistFromSupabase(slug);
            this.playlists[slug] = playlistTracks;
            appState.updateState('currentPlaylist', slug);
            console.log(`Playlist '${slug}' loaded with ${playlistTracks.length} tracks.`);
        } catch (error) {
            console.error(`Failed to load specific playlist '${slug}':`, error);
            uiManager.showNotification(`Failed to load playlist: ${slug}`, 'error');
        }
    }

    setupPlaylistUI() {
        const select = document.getElementById('playlist-select');
        if (!select) return;

        select.innerHTML = '';

        this.availablePlaylists.forEach(playlist => {
            const option = document.createElement('option');
            option.value = playlist.slug;
            option.textContent = playlist.name;
            select.appendChild(option);
        });

        // Set current selection from state
        if (appState.currentPlaylist && this.availablePlaylists.some(p => p.slug === appState.currentPlaylist)) {
            select.value = appState.currentPlaylist;
        }

        // Add event listener to load on change
        select.addEventListener('change', async (e) => {
            const newSlug = e.target.value;
            await this.loadSpecificPlaylist(newSlug);
        });
    }

    getCurrentPlaylist() {
        return this.playlists[appState.currentPlaylist] || [];
    }

    getTrack(index = appState.currentTrackIndex) {
        const playlist = this.getCurrentPlaylist();
        return playlist[index] || null;
    }
}

// Initialize application
const appState = new AppState();
const audioEngine = new AudioEngine();
const uiManager = new UIManager();
const commentSystem = new CommentSystem();
const playlistManager = new PlaylistManager();

// Application initialization
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Radio Adamowo - Comprehensive Version Loading...');
    
    // Load saved state
    appState.loadFromStorage();
    
    // Initialize components
    uiManager.initialize();
    await commentSystem.initialize();
    await playlistManager.initialize();
    
    // Set up loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            gsap.to(loadingScreen, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    loadingScreen.style.display = 'none';
                }
            });
        }
    }, CONFIG.UI.loadingDelay);

    // Set up start button
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', async () => {
            startBtn.style.display = 'none';
            await audioEngine.initialize();
            console.log('Application ready for user interaction');
        });
    }

    // Service Worker registration
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('ServiceWorker registered:', registration.scope);
        } catch (error) {
            console.warn('ServiceWorker registration failed:', error);
        }
    }

    console.log('Radio Adamowo - Comprehensive Version Initialized ✅');
});

// Export for debugging (development only)
if (process.env.NODE_ENV === 'development') {
    window.RadioAdamowo = {
        appState,
        audioEngine,
        uiManager,
        commentSystem,
        playlistManager,
        CONFIG
    };
}