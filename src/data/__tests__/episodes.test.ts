import { afterEach, describe, expect, it } from 'vitest';

import { getEpisodes, getLocalEpisodes } from '../episodes';
import { __setSupabaseClientForTests, type GenericSupabaseClient } from '../../lib/supabaseClient';
import { createQueryBuilderMock, createSupabaseClientMock } from '../__mocks__/supabase';

describe('data/episodes', () => {
  afterEach(() => {
    __setSupabaseClientForTests(null);
  });

  it('filters local episodes by search query', async () => {
    const result = await getLocalEpisodes({ q: 'cyfrowe', pageSize: 20 });

    expect(result.total).toBeGreaterThan(0);
    expect(result.episodes.every((episode) => episode.title.toLowerCase().includes('cyfrowe'))).toBe(true);
  });

  it('maps Supabase episodes and metadata', async () => {
    const rowsBuilder = createQueryBuilderMock(() => ({
      data: [
        {
          id: 'episode-1',
          title: 'Supabase Episode',
          category: 'AktDarowania',
          tags: ['strategy'],
          description: 'Supabase description',
          duration_sec: 1800,
          audio_url: 'https://example.com/audio.mp3',
          cover_url: 'https://example.com/cover.jpg',
          published_at: '2024-02-02T10:00:00Z',
          chapters: [{ title: 'Intro', start_sec: 0 }],
          resources: [{ label: 'Notes', url: 'https://example.com' }]
        }
      ],
      count: 1,
      error: null
    }));

    const metadataBuilder = createQueryBuilderMock(() => ({
      data: [
        {
          category: 'AktDarowania',
          tags: ['strategy']
        }
      ],
      error: null
    }));

    const builders = [rowsBuilder, metadataBuilder];
    const client = createSupabaseClientMock({
      episodes: () => builders.shift() ?? metadataBuilder
    });

    __setSupabaseClientForTests(client as unknown as GenericSupabaseClient);

    const result = await getEpisodes({ pageSize: 10 });

    expect(client.from).toHaveBeenCalledWith('episodes');
    expect(rowsBuilder.order).toHaveBeenCalledWith('published_at', { ascending: false });
    expect(result.episodes).toEqual([
      {
        id: 'episode-1',
        title: 'Supabase Episode',
        category: 'AktDarowania',
        tags: ['strategy'],
        description: 'Supabase description',
        durationSec: 1800,
        audioUrl: 'https://example.com/audio.mp3',
        coverUrl: 'https://example.com/cover.jpg',
        publishedAt: '2024-02-02T10:00:00Z',
        chapters: [{ title: 'Intro', startSec: 0 }],
        resources: [{ label: 'Notes', url: 'https://example.com' }],
        slug: undefined
      }
    ]);
    expect(result.metadata.categories).toEqual([{ value: 'AktDarowania', count: 1 }]);
  });

  it('throws when Supabase returns an error', async () => {
    const failingBuilder = createQueryBuilderMock(() => ({
      data: null,
      error: new Error('Supabase error'),
      count: null
    }));

    const metadataBuilder = createQueryBuilderMock(() => ({ data: [], error: null }));
    const builders = [failingBuilder, metadataBuilder];
    const client = createSupabaseClientMock({
      episodes: () => builders.shift() ?? metadataBuilder
    });

    __setSupabaseClientForTests(client as unknown as GenericSupabaseClient);

    await expect(getEpisodes()).rejects.toThrow('Supabase error');
  });
});
