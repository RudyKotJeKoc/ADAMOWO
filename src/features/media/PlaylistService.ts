/**
 * Playlist Management Service
 *
 * Handles:
 * - Playlist loading and parsing
 * - Queue management with shuffle
 * - Playback history tracking
 * - Track availability detection (online/cached/downloaded)
 * - Playlist synchronization with Supabase (optional)
 */

import type {
  AudioTrack,
  Playlist,
  PlaylistQueue,
  PlaybackHistory,
  MediaAvailability,
} from './media.schema';

// ============================================================================
// PLAYLIST LOADING
// ============================================================================

/**
 * Load playlist from URL (JSON file)
 */
export async function loadPlaylistFromUrl(url: string): Promise<AudioTrack[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch playlist: ${response.statusText}`);
    }

    const data = await response.json();

    // Validate playlist format
    if (!Array.isArray(data)) {
      throw new Error('Invalid playlist format: expected array');
    }

    return data.map((track, index) => ({
      id: track.id || `track-${index}`,
      title: track.title || 'Unknown Title',
      artist: track.artist || 'Unknown Artist',
      url: track.url,
      album: track.album,
      coverUrl: track.coverUrl,
      duration: track.duration,
      genre: track.genre,
      category: track.category,
      mood: track.mood || [],
      therapeuticTags: track.therapeuticTags || [],
      educationalContext: track.educationalContext,
      accessibility: track.accessibility,
    }));
  } catch (error) {
    console.error('Failed to load playlist:', error);
    throw error;
  }
}

/**
 * Load playlist from Supabase (if configured)
 */
export async function loadPlaylistFromSupabase(): Promise<AudioTrack[]> {
  // TODO: Implement Supabase integration
  // This would query the 'tracks' or 'playlists' table
  throw new Error('Supabase playlist loading not yet implemented');
}

/**
 * Load default playlist
 */
export async function loadDefaultPlaylist(): Promise<AudioTrack[]> {
  const defaultUrls = [
    '/music/playlist.json',
    '/public/music/playlist.json',
    '/data/playlist.json',
  ];

  for (const url of defaultUrls) {
    try {
      return await loadPlaylistFromUrl(url);
    } catch (error) {
      console.warn(`Failed to load from ${url}, trying next...`);
    }
  }

  // Return empty playlist if all attempts fail
  console.error('Failed to load default playlist from all locations');
  return [];
}

// ============================================================================
// QUEUE MANAGEMENT
// ============================================================================

/**
 * Shuffle array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Create a new queue from tracks
 */
export function createQueue(
  tracks: AudioTrack[],
  options: { shuffle?: boolean; startIndex?: number } = {}
): PlaylistQueue {
  const { shuffle = false, startIndex = 0 } = options;

  const queueTracks = shuffle ? shuffleArray(tracks) : tracks;

  return {
    currentIndex: startIndex,
    tracks: queueTracks,
    history: [],
    shuffle,
    repeat: 'none',
  };
}

/**
 * Add track to queue
 */
export function addToQueue(queue: PlaylistQueue, track: AudioTrack): PlaylistQueue {
  return {
    ...queue,
    tracks: [...queue.tracks, track],
  };
}

/**
 * Remove track from queue by ID
 */
export function removeFromQueue(queue: PlaylistQueue, trackId: string): PlaylistQueue {
  const newTracks = queue.tracks.filter((t) => t.id !== trackId);
  const removedIndex = queue.tracks.findIndex((t) => t.id === trackId);

  // Adjust current index if needed
  let newIndex = queue.currentIndex;
  if (removedIndex !== -1 && removedIndex <= queue.currentIndex) {
    newIndex = Math.max(0, queue.currentIndex - 1);
  }

  return {
    ...queue,
    tracks: newTracks,
    currentIndex: newIndex,
  };
}

/**
 * Move track in queue
 */
export function moveTrackInQueue(
  queue: PlaylistQueue,
  fromIndex: number,
  toIndex: number
): PlaylistQueue {
  const newTracks = [...queue.tracks];
  const [removed] = newTracks.splice(fromIndex, 1);
  newTracks.splice(toIndex, 0, removed);

  // Adjust current index if needed
  let newIndex = queue.currentIndex;
  if (fromIndex === queue.currentIndex) {
    newIndex = toIndex;
  } else if (fromIndex < queue.currentIndex && toIndex >= queue.currentIndex) {
    newIndex--;
  } else if (fromIndex > queue.currentIndex && toIndex <= queue.currentIndex) {
    newIndex++;
  }

  return {
    ...queue,
    tracks: newTracks,
    currentIndex: newIndex,
  };
}

/**
 * Get next track in queue
 */
export function getNextTrack(queue: PlaylistQueue): AudioTrack | null {
  const { currentIndex, tracks, repeat } = queue;

  if (tracks.length === 0) return null;

  if (repeat === 'one') {
    return tracks[currentIndex] || null;
  }

  if (currentIndex < tracks.length - 1) {
    return tracks[currentIndex + 1];
  }

  if (repeat === 'all') {
    return tracks[0];
  }

  return null; // End of queue
}

/**
 * Get previous track in queue
 */
export function getPreviousTrack(queue: PlaylistQueue): AudioTrack | null {
  const { currentIndex, tracks, repeat } = queue;

  if (tracks.length === 0) return null;

  if (currentIndex > 0) {
    return tracks[currentIndex - 1];
  }

  if (repeat === 'all') {
    return tracks[tracks.length - 1];
  }

  return null; // Beginning of queue
}

// ============================================================================
// PLAYBACK HISTORY
// ============================================================================

const HISTORY_STORAGE_KEY = 'adamowo-playback-history';
const MAX_HISTORY_ENTRIES = 100;

/**
 * Save playback history to localStorage
 */
export function savePlaybackHistory(history: PlaybackHistory[]): void {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save playback history:', error);
  }
}

/**
 * Load playback history from localStorage
 */
export function loadPlaybackHistory(): PlaybackHistory[] {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) return [];

    const history = JSON.parse(stored);
    return Array.isArray(history) ? history : [];
  } catch (error) {
    console.error('Failed to load playback history:', error);
    return [];
  }
}

/**
 * Add entry to playback history
 */
export function addToHistory(entry: PlaybackHistory): PlaybackHistory[] {
  const history = loadPlaybackHistory();

  const newHistory = [entry, ...history].slice(0, MAX_HISTORY_ENTRIES);

  savePlaybackHistory(newHistory);
  return newHistory;
}

/**
 * Clear playback history
 */
export function clearHistory(): void {
  localStorage.removeItem(HISTORY_STORAGE_KEY);
}

/**
 * Get recently played tracks
 */
export function getRecentlyPlayed(limit: number = 10): PlaybackHistory[] {
  const history = loadPlaybackHistory();
  return history.slice(0, limit);
}

/**
 * Get most played tracks
 */
export function getMostPlayed(limit: number = 10): Array<{ trackId: string; count: number }> {
  const history = loadPlaybackHistory();

  const playCount = history.reduce(
    (acc, entry) => {
      acc[entry.trackId] = (acc[entry.trackId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(playCount)
    .map(([trackId, count]) => ({ trackId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// ============================================================================
// TRACK AVAILABILITY DETECTION
// ============================================================================

/**
 * Check if track URL is accessible
 */
export async function checkTrackAvailability(track: AudioTrack): Promise<MediaAvailability> {
  const availability: MediaAvailability = {
    trackId: track.id,
    isOnline: false,
    isCached: false,
    isDownloaded: false,
    cacheStatus: 'none',
  };

  try {
    // Check if online
    const response = await fetch(track.url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
    availability.isOnline = response.ok;

    // Check if cached (in service worker cache)
    if ('caches' in window) {
      const cache = await caches.open('adamowo-media-v1');
      const cached = await cache.match(track.url);
      availability.isCached = !!cached;
    }

    // Determine cache status
    if (availability.isCached) {
      availability.cacheStatus = 'complete';
    } else if (availability.isOnline) {
      availability.cacheStatus = 'none';
    } else {
      availability.cacheStatus = 'none';
    }
  } catch (error) {
    console.warn(`Failed to check availability for track ${track.id}:`, error);
  }

  return availability;
}

/**
 * Check availability for all tracks in playlist
 */
export async function checkPlaylistAvailability(tracks: AudioTrack[]): Promise<MediaAvailability[]> {
  const checks = tracks.map((track) => checkTrackAvailability(track));
  return Promise.all(checks);
}

/**
 * Filter tracks by availability
 */
export function filterAvailableTracks(
  tracks: AudioTrack[],
  availabilities: MediaAvailability[]
): AudioTrack[] {
  return tracks.filter((track, index) => {
    const availability = availabilities[index];
    return availability && (availability.isOnline || availability.isCached);
  });
}

// ============================================================================
// SEARCH & FILTER
// ============================================================================

/**
 * Search tracks by query
 */
export function searchTracks(tracks: AudioTrack[], query: string): AudioTrack[] {
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) return tracks;

  return tracks.filter((track) => {
    return (
      track.title.toLowerCase().includes(lowerQuery) ||
      track.artist.toLowerCase().includes(lowerQuery) ||
      track.album?.toLowerCase().includes(lowerQuery) ||
      track.genre?.toLowerCase().includes(lowerQuery) ||
      track.category?.toLowerCase().includes(lowerQuery) ||
      track.mood?.some((m) => m.toLowerCase().includes(lowerQuery)) ||
      track.therapeuticTags?.some((t) => t.toLowerCase().includes(lowerQuery))
    );
  });
}

/**
 * Filter tracks by criteria
 */
export function filterTracks(
  tracks: AudioTrack[],
  filters: {
    genre?: string;
    category?: string;
    mood?: string;
    therapeuticTag?: string;
  }
): AudioTrack[] {
  return tracks.filter((track) => {
    if (filters.genre && track.genre !== filters.genre) return false;
    if (filters.category && track.category !== filters.category) return false;
    if (filters.mood && !track.mood?.includes(filters.mood)) return false;
    if (filters.therapeuticTag && !track.therapeuticTags?.includes(filters.therapeuticTag)) {
      return false;
    }
    return true;
  });
}

/**
 * Sort tracks by criteria
 */
export function sortTracks(
  tracks: AudioTrack[],
  sortBy: 'title' | 'artist' | 'album' | 'duration',
  order: 'asc' | 'desc' = 'asc'
): AudioTrack[] {
  const sorted = [...tracks].sort((a, b) => {
    let aValue: string | number = '';
    let bValue: string | number = '';

    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'artist':
        aValue = a.artist.toLowerCase();
        bValue = b.artist.toLowerCase();
        break;
      case 'album':
        aValue = a.album?.toLowerCase() || '';
        bValue = b.album?.toLowerCase() || '';
        break;
      case 'duration':
        aValue = a.duration || 0;
        bValue = b.duration || 0;
        break;
    }

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}

// ============================================================================
// PLAYLIST PERSISTENCE
// ============================================================================

const PLAYLISTS_STORAGE_KEY = 'adamowo-playlists';

/**
 * Save custom playlists to localStorage
 */
export function savePlaylists(playlists: Playlist[]): void {
  try {
    localStorage.setItem(PLAYLISTS_STORAGE_KEY, JSON.stringify(playlists));
  } catch (error) {
    console.error('Failed to save playlists:', error);
  }
}

/**
 * Load custom playlists from localStorage
 */
export function loadPlaylists(): Playlist[] {
  try {
    const stored = localStorage.getItem(PLAYLISTS_STORAGE_KEY);
    if (!stored) return [];

    const playlists = JSON.parse(stored);
    return Array.isArray(playlists) ? playlists : [];
  } catch (error) {
    console.error('Failed to load playlists:', error);
    return [];
  }
}

/**
 * Create a new custom playlist
 */
export function createPlaylist(name: string, tracks: AudioTrack[]): Playlist {
  const now = new Date().toISOString();

  return {
    id: `playlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    tracks,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Update existing playlist
 */
export function updatePlaylist(
  playlists: Playlist[],
  playlistId: string,
  updates: Partial<Omit<Playlist, 'id' | 'createdAt'>>
): Playlist[] {
  return playlists.map((playlist) =>
    playlist.id === playlistId
      ? {
          ...playlist,
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      : playlist
  );
}

/**
 * Delete playlist
 */
export function deletePlaylist(playlists: Playlist[], playlistId: string): Playlist[] {
  return playlists.filter((p) => p.id !== playlistId);
}
