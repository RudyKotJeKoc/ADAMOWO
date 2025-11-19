import { vi } from 'vitest';

// ----- mock API multimediów (jsdom tego nie ma) -----
Object.defineProperty(global, 'HTMLMediaElement', {
  value: class {},
  writable: true,
});

interface MockHTMLMediaElement {
  load: ReturnType<typeof vi.fn>;
  play: ReturnType<typeof vi.fn>;
  pause: ReturnType<typeof vi.fn>;
}

(HTMLMediaElement.prototype as unknown as MockHTMLMediaElement).load = vi.fn();
(HTMLMediaElement.prototype as unknown as MockHTMLMediaElement).play = vi
  .fn()
  .mockResolvedValue(undefined);
(HTMLMediaElement.prototype as unknown as MockHTMLMediaElement).pause = vi.fn();
Object.defineProperty(HTMLMediaElement.prototype, 'muted', { get: () => false, set: () => {} });

// ----- fetch: w testach kontrolujemy odpowiedzi -----
if (!global.fetch) {
  global.fetch = vi.fn() as unknown as typeof fetch;
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

// ----- mock Blob.text() dla jsdom -----
if (typeof Blob !== 'undefined' && !Blob.prototype.text) {
  Blob.prototype.text = async function (this: Blob): Promise<string> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsText(this);
    });
  };
}

// ----- ułatwienia RTL -----
import '@testing-library/jest-dom';

// ----- mock SVG path metod dla jsdom (po zainicjalizowaniu środowiska) -----
if (typeof globalThis.SVGPathElement !== 'undefined') {
  globalThis.SVGPathElement.prototype.getTotalLength = function (): number {
    return 100;
  };

  globalThis.SVGPathElement.prototype.getPointAtLength = function (distance: number): DOMPoint {
    return {
      x: distance,
      y: 60,
      z: 0,
      w: 1,
      toJSON: () => ({ x: distance, y: 60, z: 0, w: 1 }),
      matrixTransform: () => new DOMPoint(),
    } as DOMPoint;
  };
}
