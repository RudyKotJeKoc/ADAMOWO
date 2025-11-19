/**
 * Represents an audio track with metadata.
 * @interface Track
 * @property {string} id - Unique track identifier
 * @property {string} title - Track title
 * @property {string} artist - Artist name
 * @property {string} url - URL to the audio file
 * @property {string} [coverUrl] - Optional URL to the cover image
 * @property {number} [duration] - Optional track duration in seconds
 */
export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverUrl?: string;
  duration?: number;
}

/**
 * Configuration options for the local audio client.
 * @interface LocalAudioClientOptions
 * @property {Function} [onReady] - Called when a track is ready to play
 * @property {Function} [onError] - Called when an error occurs with error message
 * @property {Function} [onTrackChange] - Called when the current track changes
 * @property {Function} [onPlaylistLoaded] - Called when the playlist is successfully loaded
 * @property {boolean} [shuffle] - Whether to shuffle the playlist on load (default: false)
 */
interface LocalAudioClientOptions {
  onReady?: () => void;
  onError?: (message: string) => void;
  onTrackChange?: (track: Track) => void;
  onPlaylistLoaded?: (tracks: Track[]) => void;
  shuffle?: boolean;
}

/**
 * Public API interface for controlling the local audio player.
 * @interface LocalAudioClient
 * @property {Function} destroy - Cleans up event listeners and stops playback
 * @property {Function} retry - Retries loading the current track
 * @property {Function} nextTrack - Advances to the next track in the playlist
 * @property {Function} previousTrack - Goes back to the previous track
 * @property {Function} getCurrentTrack - Returns the currently loaded track
 * @property {Function} getPlaylist - Returns a copy of the current playlist array
 */
export interface LocalAudioClient {
  destroy: () => void;
  retry: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  getCurrentTrack: () => Track | null;
  getPlaylist: () => Track[];
}

/**
 * Creates a local audio client that manages playlist loading, track navigation,
 * and event handling for an HTMLAudioElement.
 *
 * Features:
 * - Automatic playlist loading from JSON
 * - Track navigation (next, previous)
 * - Optional shuffle mode
 * - Automatic track advancement on track end
 * - Error handling with specific error messages
 * - Event callbacks for ready, error, track change, and playlist loaded
 *
 * @param {HTMLAudioElement} audio - The HTML5 audio element to control
 * @param {string} [playlistUrl='/music/playlist.json'] - URL to fetch the playlist JSON from
 * @param {LocalAudioClientOptions} [options={}] - Configuration options with callbacks
 * @returns {LocalAudioClient} Client instance with methods to control playback
 *
 * @example
 * const audio = new Audio();
 * const client = createLocalAudioClient(audio, '/music/playlist.json', {
 *   onReady: () => console.log('Ready to play'),
 *   onTrackChange: (track) => console.log('Now playing:', track.title),
 *   shuffle: true
 * });
 *
 * // Later: clean up
 * client.destroy();
 */
export function createLocalAudioClient(
  audio: HTMLAudioElement,
  playlistUrl: string = '/music/playlist.json',
  options: LocalAudioClientOptions = {}
): LocalAudioClient {
  const {
    onReady,
    onError,
    onTrackChange,
    onPlaylistLoaded,
    shuffle = false
  } = options;

  let destroyed = false;
  let playlist: Track[] = [];
  let currentTrackIndex = 0;
  let isLoading = false;

  /**
   * Shuffles an array using the Fisher-Yates algorithm.
   * Creates a new shuffled copy without modifying the original array.
   *
   * @param array - Array to shuffle
   * @returns New shuffled array
   *
   * @internal
   */
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  /**
   * Loads the playlist from the configured URL.
   * Fetches the playlist JSON, optionally shuffles it, and loads the first track.
   * Calls onPlaylistLoaded callback on success or onError callback on failure.
   * Prevents concurrent loading by checking the isLoading flag.
   *
   * @returns Promise that resolves when playlist loading completes
   *
   * @internal
   */
  const loadPlaylist = async (): Promise<void> => {
    if (destroyed || isLoading) {
      return;
    }

    isLoading = true;

    try {
      const response = await fetch(playlistUrl);
      if (!response.ok) {
        throw new Error(`Failed to load playlist: ${response.statusText}`);
      }

      const data = await response.json();
      playlist = shuffle ? shuffleArray(data) : data;

      if (playlist.length === 0) {
        throw new Error('Playlist is empty');
      }

      onPlaylistLoaded?.(playlist);
      loadTrack(0);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error loading playlist';
      onError?.(message);
    } finally {
      isLoading = false;
    }
  };

  /**
   * Loads a specific track from the playlist by index.
   * Sets the audio element's source to the track URL and calls load().
   * Wraps the index using modulo to support circular navigation.
   * Calls onTrackChange callback with the newly loaded track.
   *
   * @param index - Zero-based index of the track to load
   *
   * @internal
   */
  const loadTrack = (index: number): void => {
    if (destroyed || playlist.length === 0) {
      return;
    }

    currentTrackIndex = index % playlist.length;
    const track = playlist[currentTrackIndex];

    audio.src = track.url;
    audio.load();

    onTrackChange?.(track);
  };

  /**
   * Event handler for the 'canplay' audio event.
   * Fires the onReady callback when a track is buffered and ready to play.
   *
   * @internal
   */
  const handleCanPlay = (): void => {
    if (!destroyed) {
      onReady?.();
    }
  };

  /**
   * Event handler for the 'ended' audio event.
   * Automatically advances to the next track when the current track finishes.
   *
   * @internal
   */
  const handleEnded = (): void => {
    if (!destroyed) {
      nextTrack();
    }
  };

  /**
   * Event handler for the 'error' audio event.
   * Translates MediaError codes into user-friendly error messages
   * and calls the onError callback.
   *
   * @internal
   */
  const handleError = (): void => {
    if (destroyed) {
      return;
    }

    const error = audio.error;
    let message = 'Error loading audio';

    if (error) {
      switch (error.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          message = 'Audio loading aborted';
          break;
        case MediaError.MEDIA_ERR_NETWORK:
          message = 'Network error while loading audio';
          break;
        case MediaError.MEDIA_ERR_DECODE:
          message = 'Error decoding audio';
          break;
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          message = 'Audio format not supported';
          break;
      }
    }

    onError?.(message);
  };

  /**
   * Advances to the next track in the playlist.
   * Wraps to the first track when reaching the end.
   * Part of the public LocalAudioClient API.
   *
   * @internal
   */
  const nextTrack = (): void => {
    if (destroyed || playlist.length === 0) {
      return;
    }

    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(nextIndex);
  };

  /**
   * Goes back to the previous track in the playlist.
   * Wraps to the last track when at the beginning.
   * Part of the public LocalAudioClient API.
   *
   * @internal
   */
  const previousTrack = (): void => {
    if (destroyed || playlist.length === 0) {
      return;
    }

    const prevIndex = currentTrackIndex === 0
      ? playlist.length - 1
      : currentTrackIndex - 1;
    loadTrack(prevIndex);
  };

  /**
   * Gets the currently loaded track.
   * Part of the public LocalAudioClient API.
   *
   * @returns Current track object, or null if no tracks are loaded
   *
   * @internal
   */
  const getCurrentTrack = (): Track | null => {
    if (playlist.length === 0) {
      return null;
    }
    return playlist[currentTrackIndex];
  };

  /**
   * Gets a copy of the entire playlist.
   * Returns a new array to prevent external modification.
   * Part of the public LocalAudioClient API.
   *
   * @returns Copy of the playlist array
   *
   * @internal
   */
  const getPlaylist = (): Track[] => {
    return [...playlist];
  };

  // Attach event listeners
  audio.addEventListener('canplay', handleCanPlay);
  audio.addEventListener('ended', handleEnded);
  audio.addEventListener('error', handleError);

  // Initialize playlist
  loadPlaylist();

  return {
    /**
     * Cleans up the audio client by removing event listeners and stopping playback.
     * Should be called when the audio client is no longer needed to prevent memory leaks.
     */
    destroy: () => {
      destroyed = true;
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    },
    /**
     * Retries loading the current track.
     * Useful for recovery after network errors or playback failures.
     */
    retry: () => {
      if (destroyed) {
        return;
      }
      loadTrack(currentTrackIndex);
    },
    nextTrack,
    previousTrack,
    getCurrentTrack,
    getPlaylist
  };
}
