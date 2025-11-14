import type { PlaylistItem } from './types';
import { getSupabaseClient } from '../lib/supabaseClient';

/**
 * Raw database row structure from Supabase playlist table.
 * Supports both snake_case and camelCase field names for compatibility.
 * @typedef {Object} PlaylistRow
 * @private
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
 * Maps a database row to the PlaylistItem type.
 * Handles null values and field name variations (snake_case vs camelCase).
 * @param {PlaylistRow} row - Raw database row
 * @returns {PlaylistItem} Mapped playlist item
 * @private
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
 * Loads and parses the mock playlist data from JSON file.
 * Used as fallback when Supabase is not available.
 * @returns {Promise<PlaylistItem[]>} Sorted array of playlist items
 * @private
 */
async function loadMockPlaylist(): Promise<PlaylistItem[]> {
  const module = await import('../assets/data/playlist.mock.json');
  const items = (module.default as PlaylistRow[]).map(mapPlaylistRow);
  return items.sort((a, b) => a.position - b.position);
}

/**
 * Fetches the music playlist from Supabase or falls back to local mock data.
 * Results are sorted by position in ascending order.
 * @returns {Promise<PlaylistItem[]>} Array of playlist items sorted by position
 * @throws {Error} If Supabase query fails (when Supabase is available)
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
