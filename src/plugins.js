/**
 * Radio Adamowo - Plugin System
 * Modular architecture for extensible functionality
 */

class PluginManager {
    constructor() {
        this.plugins = new Map();
        this.hooks = new Map();
        this.apiUrl = '/api/v1';
        this.init();
    }

    async init() {
        await this.loadCorePlugins();
        await this.loadUserPlugins();
        this.executeHook('system.ready');
    }

    /**
     * Register a plugin with the system
     */
    register(name, plugin) {
        if (this.plugins.has(name)) {
            console.warn(`Plugin ${name} is already registered`);
            return false;
        }

        // Validate plugin structure
        if (!this.validatePlugin(plugin)) {
            console.error(`Invalid plugin structure for ${name}`);
            return false;
        }

        // Initialize plugin
        try {
            if (typeof plugin.init === 'function') {
                plugin.init(this);
            }

            this.plugins.set(name, plugin);
            console.log(`Plugin ${name} registered successfully`);
            
            this.executeHook('plugin.registered', { name, plugin });
            return true;
        } catch (error) {
            console.error(`Failed to initialize plugin ${name}:`, error);
            return false;
        }
    }

    /**
     * Unregister a plugin
     */
    unregister(name) {
        const plugin = this.plugins.get(name);
        if (!plugin) {
            return false;
        }

        try {
            if (typeof plugin.destroy === 'function') {
                plugin.destroy();
            }

            this.plugins.delete(name);
            console.log(`Plugin ${name} unregistered successfully`);
            
            this.executeHook('plugin.unregistered', { name });
            return true;
        } catch (error) {
            console.error(`Failed to unregister plugin ${name}:`, error);
            return false;
        }
    }

    /**
     * Get a plugin by name
     */
    getPlugin(name) {
        return this.plugins.get(name);
    }

    /**
     * Get all registered plugins
     */
    getAllPlugins() {
        return Array.from(this.plugins.entries()).map(([name, plugin]) => ({
            name,
            version: plugin.version || '1.0.0',
            description: plugin.description || '',
            enabled: plugin.enabled !== false
        }));
    }

    /**
     * Add a hook listener
     */
    addHook(hookName, callback, priority = 10) {
        if (!this.hooks.has(hookName)) {
            this.hooks.set(hookName, []);
        }

        const hook = { callback, priority };
        this.hooks.get(hookName).push(hook);
        
        // Sort by priority (lower number = higher priority)
        this.hooks.get(hookName).sort((a, b) => a.priority - b.priority);
    }

    /**
     * Remove a hook listener
     */
    removeHook(hookName, callback) {
        if (!this.hooks.has(hookName)) {
            return false;
        }

        const hooks = this.hooks.get(hookName);
        const index = hooks.findIndex(hook => hook.callback === callback);
        
        if (index !== -1) {
            hooks.splice(index, 1);
            return true;
        }
        
        return false;
    }

    /**
     * Execute all listeners for a hook
     */
    executeHook(hookName, data = null) {
        if (!this.hooks.has(hookName)) {
            return data;
        }

        let result = data;
        const hooks = this.hooks.get(hookName);
        
        for (const hook of hooks) {
            try {
                const hookResult = hook.callback(result, hookName);
                if (hookResult !== undefined) {
                    result = hookResult;
                }
            } catch (error) {
                console.error(`Error in hook ${hookName}:`, error);
            }
        }

        return result;
    }

    /**
     * Validate plugin structure
     */
    validatePlugin(plugin) {
        if (!plugin || typeof plugin !== 'object') {
            return false;
        }

        const required = ['name', 'version'];
        for (const prop of required) {
            if (!plugin[prop]) {
                console.error(`Plugin missing required property: ${prop}`);
                return false;
            }
        }

        return true;
    }

    /**
     * Load core system plugins
     */
    async loadCorePlugins() {
        const corePlugins = [
            new AudioVisualizerPlugin(),
            new AnalyticsPlugin(),
            new NotificationPlugin(),
            new KeyboardShortcutsPlugin(),
            new ThemeManagerPlugin()
        ];

        for (const plugin of corePlugins) {
            this.register(plugin.name, plugin);
        }
    }

    /**
     * Load user-installed plugins
     */
    async loadUserPlugins() {
        try {
            const response = await fetch(`${this.apiUrl}/plugins/list`);
            if (response.ok) {
                const data = await response.json();
                
                for (const pluginData of data.plugins || []) {
                    if (pluginData.enabled) {
                        await this.loadExternalPlugin(pluginData);
                    }
                }
            }
        } catch (error) {
            console.warn('Could not load user plugins:', error);
        }
    }

    /**
     * Load external plugin from URL or script
     */
    async loadExternalPlugin(pluginData) {
        try {
            // Load plugin script dynamically
            const script = document.createElement('script');
            script.src = pluginData.script_url || `/plugins/${pluginData.name}/plugin.js`;
            
            return new Promise((resolve, reject) => {
                script.onload = () => {
                    // Plugin should auto-register itself
                    resolve();
                };
                script.onerror = reject;
                document.head.appendChild(script);
            });
        } catch (error) {
            console.error(`Failed to load plugin ${pluginData.name}:`, error);
        }
    }

    /**
     * Enable/disable a plugin
     */
    async setPluginEnabled(name, enabled) {
        const plugin = this.plugins.get(name);
        if (!plugin) {
            return false;
        }

        try {
            if (enabled && !plugin.enabled) {
                if (typeof plugin.enable === 'function') {
                    await plugin.enable();
                }
                plugin.enabled = true;
            } else if (!enabled && plugin.enabled !== false) {
                if (typeof plugin.disable === 'function') {
                    await plugin.disable();
                }
                plugin.enabled = false;
            }

            this.executeHook('plugin.toggled', { name, enabled });
            return true;
        } catch (error) {
            console.error(`Failed to toggle plugin ${name}:`, error);
            return false;
        }
    }
}

/**
 * Base Plugin Class
 */
class BasePlugin {
    constructor(name, version = '1.0.0') {
        this.name = name;
        this.version = version;
        this.enabled = true;
        this.description = '';
        this.pluginManager = null;
    }

    init(pluginManager) {
        this.pluginManager = pluginManager;
        this.onInit();
    }

    destroy() {
        this.onDestroy();
    }

    enable() {
        this.enabled = true;
        this.onEnable();
    }

    disable() {
        this.enabled = false;
        this.onDisable();
    }

    // Override in subclasses
    onInit() {}
    onDestroy() {}
    onEnable() {}
    onDisable() {}

    // Utility methods
    addHook(hookName, callback, priority = 10) {
        if (this.pluginManager) {
            this.pluginManager.addHook(hookName, callback, priority);
        }
    }

    executeHook(hookName, data = null) {
        if (this.pluginManager) {
            return this.pluginManager.executeHook(hookName, data);
        }
        return data;
    }
}

/**
 * Audio Visualizer Plugin
 */
class AudioVisualizerPlugin extends BasePlugin {
    constructor() {
        super('audio-visualizer', '2.0.0');
        this.description = 'Advanced audio visualization with multiple modes';
        this.canvas = null;
        this.ctx = null;
        this.audioContext = null;
        this.analyser = null;
        this.animationId = null;
    }

    onInit() {
        this.addHook('audio.play', this.startVisualization.bind(this), 5);
        this.addHook('audio.pause', this.pauseVisualization.bind(this));
        this.addHook('audio.stop', this.stopVisualization.bind(this));
        
        this.createCanvas();
    }

    onDestroy() {
        this.stopVisualization();
        if (this.canvas) {
            this.canvas.remove();
        }
    }

    createCanvas() {
        this.canvas = document.getElementById('audio-visualizer') || document.createElement('canvas');
        if (!this.canvas.id) {
            this.canvas.id = 'audio-visualizer';
            this.canvas.className = 'fixed bottom-0 left-0 w-full pointer-events-none z-10';
            document.body.appendChild(this.canvas);
        }

        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = 150;
    }

    startVisualization(audioElement) {
        if (!audioElement || !this.ctx) return;

        try {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.analyser = this.audioContext.createAnalyser();
                const source = this.audioContext.createMediaElementSource(audioElement);
                source.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);
                
                this.analyser.fftSize = 256;
            }

            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            this.animate();
        } catch (error) {
            console.error('Visualization error:', error);
        }
    }

    animate() {
        if (!this.analyser || !this.ctx) return;

        this.animationId = requestAnimationFrame(this.animate.bind(this));

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const barWidth = this.canvas.width / bufferLength * 2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = dataArray[i] / 255 * this.canvas.height;
            
            const r = Math.floor(245 + (dataArray[i] / 255) * 10);
            const g = Math.floor(158 + (dataArray[i] / 255) * 100);
            const b = Math.floor(11 + (dataArray[i] / 255) * 50);
            
            this.ctx.fillStyle = `rgb(${r},${g},${b})`;
            this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
            
            x += barWidth + 1;
        }
    }

    pauseVisualization() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    stopVisualization() {
        this.pauseVisualization();
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

/**
 * Analytics Plugin
 */
class AnalyticsPlugin extends BasePlugin {
    constructor() {
        super('analytics', '1.5.0');
        this.description = 'Advanced user behavior and stream analytics';
        this.sessionData = {};
        this.eventQueue = [];
    }

    onInit() {
        this.addHook('audio.play', this.trackPlay.bind(this));
        this.addHook('audio.pause', this.trackPause.bind(this));
        this.addHook('audio.skip', this.trackSkip.bind(this));
        this.addHook('comment.added', this.trackComment.bind(this));
        
        this.startSession();
        this.setupPeriodicSync();
    }

    startSession() {
        this.sessionData = {
            id: this.generateSessionId(),
            startTime: Date.now(),
            events: [],
            deviceInfo: this.getDeviceInfo()
        };

        this.trackEvent('session.start', this.sessionData.deviceInfo);
    }

    trackEvent(eventType, data = {}) {
        const event = {
            type: eventType,
            timestamp: Date.now(),
            data: data,
            sessionId: this.sessionData.id
        };

        this.eventQueue.push(event);
        this.executeHook('analytics.event', event);
    }

    trackPlay(audioData) {
        this.trackEvent('audio.play', {
            track: audioData?.title || 'Unknown',
            category: audioData?.category || 'unknown'
        });
    }

    trackPause(audioData) {
        this.trackEvent('audio.pause', {
            track: audioData?.title || 'Unknown',
            position: audioData?.currentTime || 0
        });
    }

    trackSkip(audioData) {
        this.trackEvent('audio.skip', {
            track: audioData?.title || 'Unknown',
            position: audioData?.currentTime || 0,
            duration: audioData?.duration || 0
        });
    }

    trackComment(commentData) {
        this.trackEvent('comment.added', {
            date: commentData.date,
            length: commentData.text?.length || 0
        });
    }

    async syncEvents() {
        if (this.eventQueue.length === 0) return;

        try {
            const events = [...this.eventQueue];
            this.eventQueue = [];

            const response = await fetch('/api/v1/analytics/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ events })
            });

            if (!response.ok) {
                // Re-add events to queue if sync failed
                this.eventQueue.unshift(...events);
            }
        } catch (error) {
            console.error('Analytics sync failed:', error);
        }
    }

    setupPeriodicSync() {
        setInterval(() => {
            this.syncEvents();
        }, 30000); // Sync every 30 seconds
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            screen: {
                width: screen.width,
                height: screen.height
            }
        };
    }
}

/**
 * Notification Plugin
 */
class NotificationPlugin extends BasePlugin {
    constructor() {
        super('notifications', '1.3.0');
        this.description = 'Web push notifications and in-app messaging';
        this.permission = null;
        this.registration = null;
    }

    onInit() {
        this.addHook('system.ready', this.checkPermission.bind(this));
        this.addHook('comment.added', this.showCommentNotification.bind(this));
        
        this.setupServiceWorker();
    }

    async checkPermission() {
        if ('Notification' in window) {
            this.permission = Notification.permission;
            
            if (this.permission === 'default') {
                this.requestPermission();
            } else if (this.permission === 'granted') {
                this.subscribeToPush();
            }
        }
    }

    async requestPermission() {
        try {
            this.permission = await Notification.requestPermission();
            if (this.permission === 'granted') {
                this.subscribeToPush();
            }
        } catch (error) {
            console.error('Notification permission error:', error);
        }
    }

    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                this.registration = await navigator.serviceWorker.register('/sw-comprehensive.js');
                console.log('Service Worker registered for notifications');
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    async subscribeToPush() {
        if (!this.registration || this.permission !== 'granted') return;

        try {
            const response = await fetch('/api/v1/notifications/push');
            const { public_key } = await response.json();

            const subscription = await this.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(public_key)
            });

            await fetch('/api/v1/notifications/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    endpoint: subscription.endpoint,
                    p256dh_key: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')))),
                    auth_key: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth'))))
                })
            });

            console.log('Push subscription created');
        } catch (error) {
            console.error('Push subscription failed:', error);
        }
    }

    showCommentNotification(commentData) {
        if (this.permission === 'granted') {
            new Notification('Nowy komentarz w Radio Adamowo', {
                body: `${commentData.name} dodał komentarz na ${commentData.date}`,
                icon: '/favicon.ico',
                badge: '/favicon.ico'
            });
        }
    }

    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
}

/**
 * Keyboard Shortcuts Plugin
 */
class KeyboardShortcutsPlugin extends BasePlugin {
    constructor() {
        super('keyboard-shortcuts', '1.2.0');
        this.description = 'Customizable keyboard shortcuts for radio control';
        this.shortcuts = new Map();
        this.defaultShortcuts = {
            'Space': 'audio.toggle',
            'ArrowLeft': 'audio.seek-backward',
            'ArrowRight': 'audio.seek-forward',
            'ArrowUp': 'audio.volume-up',
            'ArrowDown': 'audio.volume-down',
            'KeyM': 'audio.mute',
            'KeyF': 'ui.fullscreen',
            'Escape': 'ui.escape'
        };
    }

    onInit() {
        this.loadShortcuts();
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        this.addHook('settings.shortcuts-updated', this.loadShortcuts.bind(this));
    }

    onDestroy() {
        document.removeEventListener('keydown', this.handleKeydown);
    }

    loadShortcuts() {
        const saved = localStorage.getItem('radio-shortcuts');
        const shortcuts = saved ? JSON.parse(saved) : this.defaultShortcuts;
        
        this.shortcuts.clear();
        Object.entries(shortcuts).forEach(([key, action]) => {
            this.shortcuts.set(key, action);
        });
    }

    handleKeydown(event) {
        // Don't handle shortcuts when typing in inputs
        if (event.target.matches('input, textarea, [contenteditable]')) {
            return;
        }

        const action = this.shortcuts.get(event.code);
        if (action) {
            event.preventDefault();
            this.executeShortcut(action);
        }
    }

    executeShortcut(action) {
        this.executeHook(`shortcut.${action}`, { action, timestamp: Date.now() });
        
        // Default implementations
        switch (action) {
            case 'audio.toggle':
                this.executeHook('audio.toggle');
                break;
            case 'audio.volume-up':
                this.executeHook('audio.volume', { change: 0.1 });
                break;
            case 'audio.volume-down':
                this.executeHook('audio.volume', { change: -0.1 });
                break;
            // Add more default implementations
        }
    }
}

/**
 * Theme Manager Plugin
 */
class ThemeManagerPlugin extends BasePlugin {
    constructor() {
        super('theme-manager', '1.1.0');
        this.description = 'Advanced theme and appearance management';
        this.currentTheme = 'dark';
        this.themes = {
            dark: {
                name: 'Ciemny',
                colors: {
                    primary: '#f59e0b',
                    background: '#121212',
                    surface: '#1f1f1f',
                    text: '#ffffff'
                }
            },
            light: {
                name: 'Jasny',
                colors: {
                    primary: '#dc2626',
                    background: '#ffffff',
                    surface: '#f5f5f5',
                    text: '#000000'
                }
            }
        };
    }

    onInit() {
        this.loadTheme();
        this.addHook('theme.change', this.applyTheme.bind(this));
        
        // Auto theme based on time
        this.setupAutoTheme();
    }

    loadTheme() {
        const saved = localStorage.getItem('radio-theme') || 'dark';
        this.applyTheme(saved);
    }

    applyTheme(themeName) {
        const theme = this.themes[themeName];
        if (!theme) return;

        this.currentTheme = themeName;
        
        // Apply CSS custom properties
        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([property, value]) => {
            root.style.setProperty(`--color-${property}`, value);
        });

        // Update body classes
        document.body.className = document.body.className.replace(/theme-\w+/, '');
        document.body.classList.add(`theme-${themeName}`);

        localStorage.setItem('radio-theme', themeName);
        this.executeHook('theme.applied', { theme: themeName });
    }

    setupAutoTheme() {
        const hour = new Date().getHours();
        const isDayTime = hour >= 6 && hour < 20;
        
        if (!localStorage.getItem('radio-theme')) {
            this.applyTheme(isDayTime ? 'light' : 'dark');
        }
    }
}

// Initialize plugin manager
window.addEventListener('DOMContentLoaded', () => {
    window.pluginManager = new PluginManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PluginManager, BasePlugin };
}