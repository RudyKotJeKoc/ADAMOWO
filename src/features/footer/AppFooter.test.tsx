import { screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { AppFooter } from './AppFooter';
import { renderWithI18n } from '../../test/utils';

describe('AppFooter', () => {
  test('renders footer navigation and copyright', async () => {
    await renderWithI18n(<AppFooter />);

    expect(screen.getByRole('link', { name: 'Documentation' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Privacy & cookies' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Methodology & sources' })).toBeInTheDocument();
    expect(screen.getByText('© 2025 Radio Adamowo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back to top' })).toHaveAttribute('href', '#main-content');
  });
});
