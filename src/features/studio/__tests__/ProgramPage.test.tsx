import { screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, beforeEach, vi } from 'vitest';

import en from '../../../i18n/en.json';
import type { Episode } from '../../analysis-archive/data.schema';
import { renderWithI18n } from '../../../test/utils';
import { ProgramPage } from '../ProgramPage';
import type { ProgramId } from '../studio.schema';

const mockUseRecentEpisodes = vi.fn();

vi.mock('../useRecentEpisodes', () => ({
  useRecentEpisodes: (programId: ProgramId | null, options?: { limit?: number }) =>
    mockUseRecentEpisodes(programId, options)
}));

vi.mock('../../analysis-archive/AnalysisPlayer', () => ({
  AnalysisPlayer: ({ episode }: { episode: Episode | null }) => (
    <div data-testid="analysis-player">{episode?.title ?? 'none'}</div>
  )
}));

const sampleEpisodes: Episode[] = [
  {
    id: 'heart-ep-1',
    title: 'Letter from the Square',
    slug: 'letter-from-the-square',
    category: 'AktDarowania',
    tags: ['support'],
    description: 'Stories of mutual aid.',
    durationSec: 1800,
    audioUrl: 'https://example.com/audio.mp3',
    coverUrl: undefined,
    publishedAt: '2024-02-10T10:00:00.000Z',
    programId: 'heart'
  }
];

describe('ProgramPage', () => {
beforeEach(() => {
  mockUseRecentEpisodes.mockClear();
  mockUseRecentEpisodes.mockReturnValue({ episodes: sampleEpisodes, isLoading: false, error: null });
});

  it('renders program details with hosts, schedule and recent episodes', async () => {
    await renderWithI18n(
      <MemoryRouter>
        <ProgramPage programId={'heart'} />
      </MemoryRouter>
    );

    expect(mockUseRecentEpisodes).toHaveBeenCalledWith('heart', { limit: 5 });
    expect(screen.getByRole('heading', { level: 1, name: en.studio.heart.title })).toBeInTheDocument();
    expect(screen.getByText(en.studio.heart.description['0'])).toBeInTheDocument();
    expect(screen.getByText(en.studio.heart.hosts.nadia.name)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: en.studio.schedule.title })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: en.studio.program.viewArchive })).toHaveAttribute('href', '/analysis');
    expect(screen.getByText(sampleEpisodes[0].title)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('analysis-player')).toHaveTextContent(sampleEpisodes[0].title);
    });
  });

  it('shows not found state for unknown program id', async () => {
    await renderWithI18n(
      <MemoryRouter>
        <ProgramPage programId={'unknown' as ProgramId} />
      </MemoryRouter>
    );

    expect(screen.getByText(en.studio.notFound.title)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: en.studio.notFound.back })).toHaveAttribute('href', '/studio');
  });
});
