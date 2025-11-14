import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

import { getSupabaseClient } from '../lib/supabaseClient';
import type { NowPlaying } from './types';

/**
 * Internal database row type for now_playing table.
 * Supports both snake_case and camelCase property names for flexibility.
 *
 * @internal
 */
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

/**
 * Fallback now playing data used when database is unavailable or returns no data.
 * Provides default Radio Adamowo branding.
 */
export const FALLBACK_NOW_PLAYING: NowPlaying = {
  title: 'Radio Adamowo',
  artist: 'Live',
  track: undefined,
  coverUrl: '/images/Icon.jpg',
  startedAt: '2024-01-01T00:00:00Z',
  duration: undefined
};

/**
 * Maps a database row to a NowPlaying object.
 * Handles both snake_case and camelCase property names.
 * Trims whitespace from string fields and provides fallback values.
 *
 * @param row - Database row to map, can be null or undefined
 * @returns Mapped NowPlaying object with fallback values if row is empty
 *
 * @internal
 */
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

/**
 * Loads mock now playing data from a JSON file.
 * Used when Supabase client is not available (e.g., in development or offline mode).
 *
 * @returns Promise resolving to mock NowPlaying data
 *
 * @internal
 */
async function loadMockNowPlaying(): Promise<NowPlaying> {
  const module = await import('../assets/data/nowPlaying.mock.json');
  const data = module.default as NowPlayingRow;
  return mapNowPlayingRow(data);
}

/**
 * Fetches the currently playing track information.
 * Attempts to fetch from Supabase database, falls back to mock data if unavailable.
 * Returns the most recent now_playing record from the database.
 *
 * @returns Promise resolving to the current NowPlaying information
 * @throws Error if database query fails (when Supabase is available)
 *
 * @example
 * ```typescript
 * const nowPlaying = await getNowPlaying();
 * console.log(`Now playing: ${nowPlaying.title} by ${nowPlaying.artist}`);
 * ```
 */
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

/**
 * Callback function type for now playing subscriptions.
 *
 * @param payload - Updated NowPlaying data
 */
type SubscribeCallback = (payload: NowPlaying) => void;

/**
 * Supabase realtime payload type for now_playing table changes.
 *
 * @internal
 */
type RealtimePayload = RealtimePostgresChangesPayload<NowPlayingRow>;

/**
 * Subscribes to real-time updates of the now playing information.
 * Uses Supabase realtime channels to listen for database changes.
 * Returns a no-op unsubscribe function if Supabase client is unavailable.
 *
 * @param callback - Function to call when now playing data changes
 * @returns Unsubscribe function to stop listening for updates
 *
 * @example
 * ```typescript
 * const unsubscribe = subscribeNowPlaying((nowPlaying) => {
 *   console.log(`Track changed: ${nowPlaying.title}`);
 * });
 *
 * // Later, to stop listening:
 * unsubscribe();
 * ```
 */
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
