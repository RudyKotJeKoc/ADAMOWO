import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Sitemap from '../Sitemap';
import { renderWithI18n } from '../../test/utils';
import { MemoryRouter } from 'react-router-dom';

describe('Sitemap page', () => {
  it('lists key navigation links and contact details', async () => {
    await renderWithI18n(
      <MemoryRouter>
        <Sitemap />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: /find everything in one place/i })
    ).toBeInTheDocument();

    const contactEmail = screen.getByRole('link', { name: /kontakt@radioadamowo.pl/i });
    expect(contactEmail).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /media/i })).toHaveAttribute('href', '/media');
    expect(screen.getByRole('link', { name: /about us/i }).getAttribute('href')).toContain(
      '#about-team'
    );
  });
});
