/**
 * Radio Adamowo - Internationalization Module
 * Simple i18n support for multiple languages
 */

class I18nManager {
    constructor() {
        this.currentLanguage = 'pl';
        this.translations = {};
        this.fallbackLanguage = 'pl';
        this.supportedLanguages = ['pl', 'en', 'nl'];
        this.initialized = false;
    }

    /**
     * Initialize i18n with language detection
     */
    async initialize() {
        if (this.initialized) return;

        // Detect language from various sources
        this.currentLanguage = this.detectLanguage();
        
        try {
            await this.loadTranslations(this.currentLanguage);
            this.initialized = true;
            console.log(`i18n initialized with language: ${this.currentLanguage}`);
        } catch (error) {
            console.warn(`Failed to load ${this.currentLanguage}, falling back to ${this.fallbackLanguage}`);
            await this.loadTranslations(this.fallbackLanguage);
            this.currentLanguage = this.fallbackLanguage;
            this.initialized = true;
        }
    }

    /**
     * Detect user's preferred language
     */
    detectLanguage() {
        // 1. Check localStorage
        const storedLang = localStorage.getItem('radio-adamowo-language');
        if (storedLang && this.supportedLanguages.includes(storedLang)) {
            return storedLang;
        }

        // 2. Check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && this.supportedLanguages.includes(urlLang)) {
            return urlLang;
        }

        // 3. Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0].toLowerCase();
        if (this.supportedLanguages.includes(langCode)) {
            return langCode;
        }

        // 4. Default fallback
        return this.fallbackLanguage;
    }

    /**
     * Load translations for specified language
     */
    async loadTranslations(language) {
        if (!this.supportedLanguages.includes(language)) {
            throw new Error(`Unsupported language: ${language}`);
        }

        try {
            const response = await fetch(`./lang/${language}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load language file: ${response.status}`);
            }
            
            this.translations = await response.json();
            return this.translations;
        } catch (error) {
            console.error(`Error loading translations for ${language}:`, error);
            throw error;
        }
    }

    /**
     * Get translated text by key path
     */
    t(keyPath, variables = {}) {
        if (!this.initialized) {
            console.warn('i18n not initialized, returning key');
            return keyPath;
        }

        const keys = keyPath.split('.');
        let value = this.translations;

        // Navigate through nested object
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                console.warn(`Translation key not found: ${keyPath}`);
                return keyPath;
            }
        }

        // Handle variable substitution
        if (typeof value === 'string' && Object.keys(variables).length > 0) {
            return value.replace(/\{\{(\w+)\}\}/g, (match, variable) => {
                return variables[variable] || match;
            });
        }

        return value;
    }

    /**
     * Change current language
     */
    async setLanguage(language) {
        if (!this.supportedLanguages.includes(language)) {
            throw new Error(`Unsupported language: ${language}`);
        }

        try {
            await this.loadTranslations(language);
            this.currentLanguage = language;
            localStorage.setItem('radio-adamowo-language', language);
            
            // Trigger language change event
            window.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language, translations: this.translations }
            }));
            
            console.log(`Language changed to: ${language}`);
        } catch (error) {
            console.error(`Failed to change language to ${language}:`, error);
            throw error;
        }
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get supported languages
     */
    getSupportedLanguages() {
        return [...this.supportedLanguages];
    }

    /**
     * Check if language is supported
     */
    isLanguageSupported(language) {
        return this.supportedLanguages.includes(language);
    }

    /**
     * Get language metadata
     */
    getLanguageInfo(language = this.currentLanguage) {
        return this.translations?.meta || {
            language: language,
            name: language.toUpperCase(),
            version: '1.0.0'
        };
    }
}

// Create global instance
const i18n = new I18nManager();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        i18n.initialize().catch(console.error);
    });
} else {
    i18n.initialize().catch(console.error);
}

// Export for use in other modules
window.i18n = i18n;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18nManager;
}