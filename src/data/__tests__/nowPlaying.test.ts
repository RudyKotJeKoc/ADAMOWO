import { afterEach, describe, expect, it, vi } from 'vitest';

import { getNowPlaying, subscribeNowPlaying } from '../nowPlaying';
import { __setSupabaseClientForTests, type GenericSupabaseClient } from '../../lib/supabaseClient';
import { createQueryBuilderMock, createRealtimeChannelMock, createSupabaseClientMock } from '../__mocks__/supabase';

describe('data/nowPlaying', () => {
  afterEach(() => {
    __setSupabaseClientForTests(null);
  });

  it('returns mock data when Supabase client is unavailable', async () => {
    __setSupabaseClientForTests(null);

    const result = await getNowPlaying();
    const mock = (await import('../../assets/data/nowPlaying.mock.json')).default;

    expect(result).toEqual(mock);
  });

  it('maps Supabase response to NowPlaying structure', async () => {
    const builder = createQueryBuilderMock(() => ({
      data: [
        {
          title: 'Supabase Live',
          artist: 'DJ Test',
          track: 'Signal',
          cover_url: 'https://example.com/cover.jpg',
          started_at: '2024-03-10T10:00:00Z',
          duration: 320
        }
      ],
      error: null
    }));

    const client = createSupabaseClientMock({ now_playing: builder });
    __setSupabaseClientForTests(client as unknown as GenericSupabaseClient);

    const result = await getNowPlaying();

    expect(client.from).toHaveBeenCalledWith('now_playing');
    expect(result).toEqual({
      title: 'Supabase Live',
      artist: 'DJ Test',
      track: 'Signal',
      coverUrl: 'https://example.com/cover.jpg',
      startedAt: '2024-03-10T10:00:00Z',
      duration: 320
    });
  });

  it('subscribes to realtime updates and cleans up the channel', () => {
    const channel = createRealtimeChannelMock();
    const client = createSupabaseClientMock({ now_playing: createQueryBuilderMock({ data: [], error: null }) });
    client.channel.mockReturnValue(channel);
    __setSupabaseClientForTests(client as unknown as GenericSupabaseClient);

    const callback = vi.fn();
    const unsubscribe = subscribeNowPlaying(callback);

    channel.emit({ new: { title: 'Realtime', cover_url: '/cover.png', started_at: '2024-03-10T10:05:00Z' } });

    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Realtime', coverUrl: '/cover.png', startedAt: '2024-03-10T10:05:00Z' })
    );

    unsubscribe();
    expect(client.removeChannel).toHaveBeenCalledWith(channel);
  });
});
