import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import nl from './nl.json';
import pl from './pl.json';

void i18n.use(initReactI18next).init({
  lng: 'pl',
  resources: {
    en: { translation: en },
    nl: { translation: nl },
    pl: { translation: pl },
  },
  fallbackLng: 'pl',
  supportedLngs: ['pl', 'nl', 'en'],
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language;
}

export default i18n;
