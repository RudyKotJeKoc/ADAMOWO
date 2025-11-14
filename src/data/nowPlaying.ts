import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

import { getSupabaseClient } from '../lib/supabaseClient';
import type { NowPlaying } from './types';

/**
 * Raw database row structure from Supabase now_playing table.
 * Supports both snake_case and camelCase field names for compatibility.
 * @typedef {Object} NowPlayingRow
 * @private
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
 * Default "Now Playing" data used when no active track is available
 * or when Supabase is not configured.
 * @constant {NowPlaying}
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
 * Maps a database row to the NowPlaying type with fallback values.
 * Handles null/undefined fields and field name variations (snake_case vs camelCase).
 * @param {NowPlayingRow} [row] - Raw database row
 * @returns {NowPlaying} Mapped now playing data with fallbacks applied
 * @private
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
 * Loads mock "now playing" data from JSON file.
 * Used as fallback when Supabase is not available.
 * @returns {Promise<NowPlaying>} Mock now playing data
 * @private
 */
async function loadMockNowPlaying(): Promise<NowPlaying> {
  const module = await import('../assets/data/nowPlaying.mock.json');
  const data = module.default as NowPlayingRow;
  return mapNowPlayingRow(data);
}

/**
 * Fetches the most recent "now playing" record from Supabase.
 * Falls back to mock data if Supabase is not available.
 * Returns the most recently started track based on started_at timestamp.
 * @returns {Promise<NowPlaying>} Current now playing information
 * @throws {Error} If Supabase query fails (when Supabase is available)
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
 * Callback function type for now playing subscription updates.
 * @callback SubscribeCallback
 * @param {NowPlaying} payload - Updated now playing data
 * @private
 */
type SubscribeCallback = (payload: NowPlaying) => void;

type RealtimePayload = RealtimePostgresChangesPayload<NowPlayingRow>;

/**
 * Sets up a real-time subscription to now_playing table changes via Supabase Realtime.
 * Listens for INSERT, UPDATE, and DELETE events on the now_playing table.
 * Returns a no-op unsubscribe function if Supabase is not available.
 *
 * @param {SubscribeCallback} callback - Function called when now playing data changes
 * @returns {Function} Unsubscribe function to clean up the subscription
 *
 * @example
 * const unsubscribe = subscribeNowPlaying((nowPlaying) => {
 *   console.log('Now playing:', nowPlaying.title);
 * });
 *
 * // Later: clean up
 * unsubscribe();
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
