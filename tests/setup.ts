import { vi } from 'vitest';

// ----- mock API multimediów (jsdom tego nie ma) -----
Object.defineProperty(global, 'HTMLMediaElement', {
  value: class {},
  writable: true,
});
(HTMLMediaElement.prototype as any).load = vi.fn();
(HTMLMediaElement.prototype as any).play = vi.fn().mockResolvedValue(undefined);
(HTMLMediaElement.prototype as any).pause = vi.fn();
Object.defineProperty(HTMLMediaElement.prototype, 'muted', { get: () => false, set: () => {} });

// ----- fetch: w testach kontrolujemy odpowiedzi -----
if (!global.fetch) {
  (global as any).fetch = vi.fn();
}

// ----- minimalny i18n dla testów -----
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
await i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en: { translation: {} } },
  interpolation: { escapeValue: false },
});
export { i18n };

// ----- ułatwienia RTL -----
import '@testing-library/jest-dom';
