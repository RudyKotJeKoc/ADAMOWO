import { afterEach, describe, expect, it } from 'vitest';

import { getPlaylist } from '../playlist';
import { __setSupabaseClientForTests, type GenericSupabaseClient } from '../../lib/supabaseClient';
import { createQueryBuilderMock, createSupabaseClientMock } from '../__mocks__/supabase';

describe('data/playlist', () => {
  afterEach(() => {
    __setSupabaseClientForTests(null);
  });

  it('returns mock playlist when Supabase client is unavailable', async () => {
    __setSupabaseClientForTests(null);

    const playlist = await getPlaylist();

    expect(playlist.length).toBeGreaterThan(0);
    const positions = playlist.map((item) => item.position);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('maps Supabase rows to playlist items', async () => {
    const builder = createQueryBuilderMock(() => ({
      data: [
        {
          id: 'track-1',
          title: 'Supabase Track',
          artist: null,
          url: 'https://example.com/audio.mp3',
          cover_url: 'https://example.com/cover.jpg',
          position: 1
        }
      ],
      error: null
    }));

    const client = createSupabaseClientMock({ playlist: builder });
    __setSupabaseClientForTests(client as unknown as GenericSupabaseClient);

    const playlist = await getPlaylist();

    expect(client.from).toHaveBeenCalledWith('playlist');
    expect(builder.order).toHaveBeenCalledWith('position', { ascending: true });
    expect(playlist).toEqual([
      {
        id: 'track-1',
        title: 'Supabase Track',
        artist: undefined,
        url: 'https://example.com/audio.mp3',
        coverUrl: 'https://example.com/cover.jpg',
        position: 1
      }
    ]);
  });
});
