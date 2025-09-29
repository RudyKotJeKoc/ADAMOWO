const HTML_ESCAPE_LOOKUP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

/**
 * Escapes a user controlled string before injecting it into the DOM.
 * Using a lightweight replacement map keeps the function framework agnostic
 * and avoids touching the global document object in unit tests.
 */
export function escapeHTML(rawValue) {
  if (typeof rawValue !== 'string') {
    return '';
  }

  return rawValue.replace(/[&<>"']/g, (character) => HTML_ESCAPE_LOOKUP[character] || character);
}

/**
 * Derives a readable title from a playlist file path. The implementation mirrors
 * the historical behaviour of the legacy code while guarding against unexpected
 * input types.
 */
export function createTitleFromFilename(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    return 'Utwór bez tytułu';
  }

  const filename = filePath.split('/').pop();
  if (!filename) {
    return 'Utwór bez tytułu';
  }

  const baseTitle = filename
    .replace(/\.mp3$/i, '')
    .replace(/Utwor\s*\((\d+)\)/i, 'Utwór $1')
    .replace(/_/g, ' ')
    .replace(/utwor/gi, 'utwór');

  const lowerCased = baseTitle.toLocaleLowerCase('pl-PL');

  const titleCased = lowerCased.replace(/(^|\s)(\p{L})/gu, (match) => match.toLocaleUpperCase('pl-PL'));

  return titleCased.trim() || 'Utwór bez tytułu';
}
