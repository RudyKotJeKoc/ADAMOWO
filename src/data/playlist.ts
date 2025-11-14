import type { PlaylistItem } from './types';
import { getSupabaseClient } from '../lib/supabaseClient';

/**
 * Internal database row type for playlist table.
 * Supports both snake_case and camelCase property names for flexibility.
 *
 * @internal
 */
type PlaylistRow = {
  id: string;
  title: string;
  artist?: string | null;
  url: string;
  cover_url?: string | null;
  coverUrl?: string | null;
  position: number;
};

/**
 * Maps a database playlist row to a PlaylistItem object.
 * Handles both snake_case and camelCase property names.
 * Ensures position is a valid finite number.
 *
 * @param row - Database row to map
 * @returns Mapped PlaylistItem object
 *
 * @internal
 */
function mapPlaylistRow(row: PlaylistRow): PlaylistItem {
  return {
    id: row.id,
    title: row.title,
    artist: row.artist ?? undefined,
    url: row.url,
    coverUrl: row.cover_url ?? row.coverUrl ?? undefined,
    position: Number.isFinite(row.position) ? row.position : 0
  };
}

/**
 * Loads mock playlist data from a JSON file.
 * Used when Supabase client is not available (e.g., in development or offline mode).
 * Automatically sorts items by position.
 *
 * @returns Promise resolving to sorted array of PlaylistItem objects
 *
 * @internal
 */
async function loadMockPlaylist(): Promise<PlaylistItem[]> {
  const module = await import('../assets/data/playlist.mock.json');
  const items = (module.default as PlaylistRow[]).map(mapPlaylistRow);
  return items.sort((a, b) => a.position - b.position);
}

/**
 * Fetches the complete playlist.
 * Attempts to fetch from Supabase database, falls back to mock data if unavailable.
 * Returns items sorted by position in ascending order.
 *
 * @returns Promise resolving to array of PlaylistItem objects sorted by position
 * @throws Error if database query fails (when Supabase is available)
 *
 * @example
 * ```typescript
 * const playlist = await getPlaylist();
 * console.log(`Playlist has ${playlist.length} tracks`);
 * playlist.forEach(item => {
 *   console.log(`${item.position}: ${item.title} by ${item.artist}`);
 * });
 * ```
 */
export async function getPlaylist(): Promise<PlaylistItem[]> {
  const client = getSupabaseClient();

  if (!client) {
    return loadMockPlaylist();
  }

  const { data, error } = await client
    .from('playlist')
    .select('*')
    .order('position', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapPlaylistRow);
}
