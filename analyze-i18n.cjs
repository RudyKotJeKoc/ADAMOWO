#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Funkcja do ekstrakcji wszystkich kluczy z zagnieżdżonych obiektów
function extractKeys(obj, prefix = '') {
  const keys = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // Rekurencyjnie dla zagnieżdżonych obiektów
      keys.push(fullKey);
      keys.push(...extractKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

// Funkcja do porównania dwóch zestawów kluczy
function findMissingKeys(reference, target) {
  const refKeys = new Set(reference);
  const targetKeys = new Set(target);
  const missing = [];

  for (const key of refKeys) {
    if (!targetKeys.has(key)) {
      missing.push(key);
    }
  }

  return missing.sort();
}

// Ścieżki do plików
const baseDir = '/home/user/ADAMOWO/src/i18n';
const files = {
  pl: path.join(baseDir, 'pl.json'),
  en: path.join(baseDir, 'en.json'),
  nl: path.join(baseDir, 'nl.json')
};

try {
  // Wczytaj wszystkie pliki
  const translations = {};
  const allKeys = {};

  for (const [lang, filePath] of Object.entries(files)) {
    const content = fs.readFileSync(filePath, 'utf8');
    translations[lang] = JSON.parse(content);
    allKeys[lang] = extractKeys(translations[lang]);
    console.log(`[${lang.toUpperCase()}] Total keys: ${allKeys[lang].length}`);
  }

  console.log('\n=== MISSING KEYS IN EN ===');
  const missingInEn = findMissingKeys(allKeys.pl, allKeys.en);
  console.log(`Count: ${missingInEn.length}`);
  missingInEn.forEach(key => console.log(`  - ${key}`));

  console.log('\n=== MISSING KEYS IN NL ===');
  const missingInNl = findMissingKeys(allKeys.pl, allKeys.nl);
  console.log(`Count: ${missingInNl.length}`);
  missingInNl.forEach(key => console.log(`  - ${key}`));

  console.log('\n=== EXTRA KEYS IN EN (not in PL) ===');
  const extraInEn = findMissingKeys(allKeys.en, allKeys.pl);
  console.log(`Count: ${extraInEn.length}`);
  extraInEn.forEach(key => console.log(`  - ${key}`));

  console.log('\n=== EXTRA KEYS IN NL (not in PL) ===');
  const extraInNl = findMissingKeys(allKeys.nl, allKeys.pl);
  console.log(`Count: ${extraInNl.length}`);
  extraInNl.forEach(key => console.log(`  - ${key}`));

  // Zapisz wyniki do pliku JSON
  const results = {
    summary: {
      pl_total: allKeys.pl.length,
      en_total: allKeys.en.length,
      nl_total: allKeys.nl.length,
      missing_in_en: missingInEn.length,
      missing_in_nl: missingInNl.length,
      extra_in_en: extraInEn.length,
      extra_in_nl: extraInNl.length
    },
    missing_in_en: missingInEn,
    missing_in_nl: missingInNl,
    extra_in_en: extraInEn,
    extra_in_nl: extraInNl
  };

  fs.writeFileSync(
    '/home/user/ADAMOWO/i18n-analysis-results.json',
    JSON.stringify(results, null, 2)
  );

  console.log('\n=== SUMMARY ===');
  console.log(`PL keys: ${allKeys.pl.length}`);
  console.log(`EN keys: ${allKeys.en.length} (missing: ${missingInEn.length})`);
  console.log(`NL keys: ${allKeys.nl.length} (missing: ${missingInNl.length})`);
  console.log('\nResults saved to: i18n-analysis-results.json');

} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
