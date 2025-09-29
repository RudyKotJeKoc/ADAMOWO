import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';

import App from './App';
import './app.css';
import i18n from './i18n';
import { ThemeProvider } from './state/theme';
import { initTheme } from './utils/theme';

const initialTheme = initTheme();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <ThemeProvider initialTheme={initialTheme}>
        <App />
      </ThemeProvider>
    </I18nextProvider>
  </React.StrictMode>
);
