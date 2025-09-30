import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';

import type { Episode } from '../../analysis-archive/data.schema';
import { renderWithI18n } from '../../../test/utils';
import type { ProgramId } from '../studio.schema';
import { useRecentEpisodes } from '../useRecentEpisodes';

const mockGetEpisodes = vi.fn();

vi.mock('../../analysis-archive/api', () => ({
  getEpisodes: (...args: unknown[]) => mockGetEpisodes(...args)
}));

function HookTester({ programId }: { programId: ProgramId | null }) {
  const { episodes, isLoading, error } = useRecentEpisodes(programId, { limit: 2 });

  return (
    <div>
      <span data-testid="loading">{isLoading ? 'loading' : 'idle'}</span>
      <span data-testid="count">{episodes.length}</span>
      <span data-testid="error">{error ? 'error' : 'none'}</span>
    </div>
  );
}

const resultTemplate = {
  total: 1,
  page: 1,
  pageSize: 2,
  metadata: { categories: [], tags: [] }
};

const sampleEpisodes: Episode[] = [
  {
    id: 'team-ep',
    title: 'Studio Update',
    slug: 'studio-update',
    category: 'SprawaAdamskich',
    tags: [],
    description: 'Weekly briefing.',
    durationSec: 1200,
    audioUrl: 'https://example.com/audio.mp3',
    publishedAt: '2024-03-01T12:00:00.000Z',
    programId: 'team'
  }
];

describe('useRecentEpisodes', () => {
  beforeEach(() => {
    mockGetEpisodes.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads recent episodes for a program id', async () => {
    mockGetEpisodes.mockResolvedValueOnce({
      episodes: sampleEpisodes,
      ...resultTemplate
    });

    await renderWithI18n(<HookTester programId="team" />);

    expect(mockGetEpisodes).toHaveBeenCalledWith({
      programId: 'team',
      sort: 'newest',
      page: 1,
      pageSize: 2
    });

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('idle');
    });
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('error')).toHaveTextContent('none');
  });

  it('returns empty state when no program id provided', async () => {
    await renderWithI18n(<HookTester programId={null} />);

    expect(mockGetEpisodes).not.toHaveBeenCalled();
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('loading')).toHaveTextContent('idle');
  });

  it('exposes error state when fetching fails', async () => {
    mockGetEpisodes.mockRejectedValueOnce(new Error('boom'));

    await renderWithI18n(<HookTester programId="heart" />);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('error');
      expect(screen.getByTestId('loading')).toHaveTextContent('idle');
    });
    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });
});
