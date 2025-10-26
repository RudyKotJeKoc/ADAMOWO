export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverUrl?: string;
  duration?: number;
}

interface LocalAudioClientOptions {
  onReady?: () => void;
  onError?: (message: string) => void;
  onTrackChange?: (track: Track) => void;
  onPlaylistLoaded?: (tracks: Track[]) => void;
  shuffle?: boolean;
}

export interface LocalAudioClient {
  destroy: () => void;
  retry: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  getCurrentTrack: () => Track | null;
  getPlaylist: () => Track[];
}

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

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

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

  const handleCanPlay = (): void => {
    if (!destroyed) {
      onReady?.();
    }
  };

  const handleEnded = (): void => {
    if (!destroyed) {
      nextTrack();
    }
  };

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

  const nextTrack = (): void => {
    if (destroyed || playlist.length === 0) {
      return;
    }

    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(nextIndex);
  };

  const previousTrack = (): void => {
    if (destroyed || playlist.length === 0) {
      return;
    }

    const prevIndex = currentTrackIndex === 0
      ? playlist.length - 1
      : currentTrackIndex - 1;
    loadTrack(prevIndex);
  };

  const getCurrentTrack = (): Track | null => {
    if (playlist.length === 0) {
      return null;
    }
    return playlist[currentTrackIndex];
  };

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
    destroy: () => {
      destroyed = true;
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    },
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
