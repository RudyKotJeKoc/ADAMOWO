import type { PlaylistItem } from './types';
import { getSupabaseClient } from '../lib/supabaseClient';

type PlaylistRow = {
  id: string;
  title: string;
  artist?: string | null;
  url: string;
  cover_url?: string | null;
  coverUrl?: string | null;
  position: number;
};

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

async function loadMockPlaylist(): Promise<PlaylistItem[]> {
  const module = await import('../assets/data/playlist.mock.json');
  const items = (module.default as PlaylistRow[]).map(mapPlaylistRow);
  return items.sort((a, b) => a.position - b.position);
}

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
