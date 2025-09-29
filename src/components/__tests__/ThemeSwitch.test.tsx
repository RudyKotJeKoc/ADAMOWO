import { fireEvent, render, screen } from '@testing-library/react';

import { I18nextProvider } from 'react-i18next';

import i18n from '../../i18n';
import { ThemeProvider } from '../../state/theme';
import { ThemeSwitch } from '../ThemeSwitch';

describe('ThemeSwitch', () => {
  beforeEach(() => {
    document.documentElement.className = '';
    document.documentElement.removeAttribute('data-theme');
    window.localStorage.clear();
  });

  it('toggles between dark and light themes', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider initialTheme="dark">
          <ThemeSwitch />
        </ThemeProvider>
      </I18nextProvider>
    );

    const button = screen.getByRole('button');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    fireEvent.click(button);

    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(window.localStorage.getItem('radio-adamowo-theme')).toBe('light');
  });
});
