import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { EpisodeQueryResult as BaseEpisodeQueryResult } from '../../../data/types';
import type { EpisodeQueryResult } from '../data.schema';

vi.mock('../../../data/episodes', () => ({
  getEpisodes: vi.fn(),
  getLocalEpisodes: vi.fn()
}));

type EpisodesModule = typeof import('../../../data/episodes');
let episodesModule: vi.Mocked<EpisodesModule>;

describe('analysis-archive/api', () => {
  beforeEach(async () => {
    episodesModule = vi.mocked(await import('../../../data/episodes'));
    episodesModule.getEpisodes.mockReset();
    episodesModule.getLocalEpisodes.mockReset();
  });

  it('adapts supabase results to the feature schema', async () => {
    const response: BaseEpisodeQueryResult = {
      episodes: [
        {
          id: 'episode-1',
          title: 'Episode 1',
          category: 'AktDarowania',
          tags: ['a'],
          description: 'desc',
          durationSec: 120,
          audioUrl: 'https://example.com/audio.mp3',
          publishedAt: '2024-01-01T00:00:00.000Z',
          coverUrl: undefined,
          slug: undefined,
          chapters: [],
          resources: []
        },
        {
          id: 'episode-2',
          title: 'Episode 2',
          category: 'Unknown',
          tags: [],
          description: 'desc',
          durationSec: 60,
          audioUrl: 'https://example.com/2.mp3',
          publishedAt: '2024-02-01T00:00:00.000Z'
        }
      ],
      total: 1,
      page: 1,
      pageSize: 10,
      metadata: {
        categories: [
          { value: 'AktDarowania', count: 5 },
          { value: 'Unknown', count: 2 }
        ],
        tags: [{ value: 'a', count: 1 }]
      }
    };

    episodesModule.getEpisodes.mockResolvedValue(response);

    const { getEpisodes } = await import('../api');
    const result = await getEpisodes({ categories: ['AktDarowania'] });

    expect(episodesModule.getEpisodes).toHaveBeenCalledWith({ categories: ['AktDarowania'] });
    expect(result).toEqual<EpisodeQueryResult>({
      episodes: [
        {
          id: 'episode-1',
          title: 'Episode 1',
          category: 'AktDarowania',
          tags: ['a'],
          description: 'desc',
          durationSec: 120,
          audioUrl: 'https://example.com/audio.mp3',
          publishedAt: '2024-01-01T00:00:00.000Z',
          coverUrl: undefined,
          slug: 'episode-1',
          chapters: [],
          resources: []
        }
      ],
      total: 1,
      page: 1,
      pageSize: 10,
      metadata: {
        categories: [{ value: 'AktDarowania', count: 5 }],
        tags: [{ value: 'a', count: 1 }]
      }
    });
  });

  it('falls back to the local dataset when remote loading fails', async () => {
    const fallback: BaseEpisodeQueryResult = {
      episodes: [
        {
          id: 'episode-3',
          title: 'Episode 3',
          category: 'SłużebnośćUwiązania',
          tags: [],
          description: 'desc',
          durationSec: 180,
          audioUrl: 'https://example.com/3.mp3',
          publishedAt: '2024-03-01T00:00:00.000Z'
        }
      ],
      total: 1,
      page: 1,
      pageSize: 10,
      metadata: {
        categories: [{ value: 'SłużebnośćUwiązania', count: 1 }],
        tags: []
      }
    };

    episodesModule.getEpisodes.mockRejectedValue(new Error('network error'));
    episodesModule.getLocalEpisodes.mockResolvedValue(fallback);

    const { getEpisodes } = await import('../api');
    const result = await getEpisodes();

    expect(episodesModule.getEpisodes).toHaveBeenCalled();
    expect(episodesModule.getLocalEpisodes).toHaveBeenCalled();
    expect(result.episodes[0]).toMatchObject({ id: 'episode-3', slug: 'episode-3' });
  });
});
