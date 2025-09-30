import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import en from '../../../i18n/en.json';
import { renderWithI18n } from '../../../test/utils';
import { StudioSection } from '../StudioSection';

vi.mock('../useRecentEpisodes', () => ({
  useRecentEpisodes: () => ({ episodes: [], isLoading: false, error: null })
}));

describe('StudioSection', () => {
  it('renders all studio program cards with working links', async () => {
    await renderWithI18n(
      <MemoryRouter>
        <StudioSection />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 3, name: en.studio.team.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: en.studio.heart.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: en.studio.psych.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: en.studio.welcome.title })).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: `Open the ${en.studio.team.title} program` })
    ).toHaveAttribute('href', '/studio/team');
    expect(
      screen.getByRole('link', { name: `Open the ${en.studio.heart.title} program` })
    ).toHaveAttribute('href', '/studio/heart');
    expect(
      screen.getByRole('link', { name: `Open the ${en.studio.psych.title} program` })
    ).toHaveAttribute('href', '/studio/psych');
    expect(
      screen.getByRole('link', { name: `Open the ${en.studio.welcome.title} program` })
    ).toHaveAttribute('href', '/studio/welcome');
  });
});
