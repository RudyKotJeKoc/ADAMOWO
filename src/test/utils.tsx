import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import en from '../i18n/en.json';

export async function renderWithI18n(
  ui: ReactElement,
  options?: RenderOptions
) {
  const i18nInstance = i18next.createInstance();
  await i18nInstance.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: { translation: en }
    }
  });

  return render(<I18nextProvider i18n={i18nInstance}>{ui}</I18nextProvider>, options);
}
