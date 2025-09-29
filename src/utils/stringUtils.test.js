import { describe, expect, it } from 'vitest';
import { createTitleFromFilename, escapeHTML } from './stringUtils.js';

describe('stringUtils', () => {
  describe('createTitleFromFilename', () => {
    it('konwertuje nazwę pliku na czytelny tytuł', () => {
      expect(createTitleFromFilename('music/Utwor (5).mp3')).toBe('Utwór 5');
    });

    it('zwraca domyślny tytuł dla nieprawidłowej ścieżki', () => {
      expect(createTitleFromFilename(null)).toBe('Utwór bez tytułu');
    });
  });

  describe('escapeHTML', () => {
    it('ucieka znaczniki HTML', () => {
      expect(escapeHTML('<script>alert("x")</script>')).toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
    });

    it('zwraca pusty ciąg znaków dla wartości innych niż string', () => {
      expect(escapeHTML(undefined)).toBe('');
    });
  });
});
