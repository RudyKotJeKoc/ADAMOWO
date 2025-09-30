import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

import { getSupabaseClient } from '../lib/supabaseClient';
import type { NowPlaying } from './types';

type NowPlayingRow = {
  title?: string | null;
  artist?: string | null;
  track?: string | null;
  cover_url?: string | null;
  coverUrl?: string | null;
  started_at?: string | null;
  startedAt?: string | null;
  duration?: number | null;
};

export const FALLBACK_NOW_PLAYING: NowPlaying = {
  title: 'Radio Adamowo',
  artist: 'Live',
  track: undefined,
  coverUrl: '/images/Icon.jpg',
  startedAt: '2024-01-01T00:00:00Z',
  duration: undefined
};

function mapNowPlayingRow(row?: NowPlayingRow | null): NowPlaying {
  if (!row) {
    return FALLBACK_NOW_PLAYING;
  }

  return {
    title: row.title?.trim() || FALLBACK_NOW_PLAYING.title,
    artist: row.artist?.trim() || undefined,
    track: row.track?.trim() || undefined,
    coverUrl: row.cover_url?.trim() || row.coverUrl?.trim() || FALLBACK_NOW_PLAYING.coverUrl,
    startedAt: row.started_at ?? row.startedAt ?? FALLBACK_NOW_PLAYING.startedAt,
    duration: typeof row.duration === 'number' ? row.duration : undefined
  };
}

async function loadMockNowPlaying(): Promise<NowPlaying> {
  const module = await import('../assets/data/nowPlaying.mock.json');
  const data = module.default as NowPlayingRow;
  return mapNowPlayingRow(data);
}

export async function getNowPlaying(): Promise<NowPlaying> {
  const client = getSupabaseClient();

  if (!client) {
    return loadMockNowPlaying();
  }

  const { data, error } = await client
    .from('now_playing')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(1);

  if (error) {
    throw error;
  }

  const record = Array.isArray(data) && data.length > 0 ? (data[0] as NowPlayingRow) : null;
  return mapNowPlayingRow(record);
}

type SubscribeCallback = (payload: NowPlaying) => void;

type RealtimePayload = RealtimePostgresChangesPayload<NowPlayingRow>;

export function subscribeNowPlaying(callback: SubscribeCallback): () => void {
  const client = getSupabaseClient();

  if (!client) {
    return () => undefined;
  }

  const channel = client
    .channel('now-playing')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'now_playing' }, (payload: RealtimePayload) => {
      const next = mapNowPlayingRow((payload.new as NowPlayingRow) ?? (payload.old as NowPlayingRow));
      callback(next);
    });

  void channel.subscribe();

  return () => {
    void client.removeChannel(channel);
  };
}
