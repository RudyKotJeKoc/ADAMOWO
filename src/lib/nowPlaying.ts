export interface NowPlaying {
  title: string;
  artist: string;
  artwork: string;
  startedAt?: string;
}

const FALLBACK_NOW_PLAYING: NowPlaying = {
  title: 'Radio Adamowo',
  artist: 'Live',
  artwork: '/images/Icon.jpg'
};

const METADATA_URL = import.meta.env.VITE_METADATA_URL as string | undefined;

function parseNowPlaying(candidate: unknown): NowPlaying {
  if (!candidate || typeof candidate !== 'object') {
    return FALLBACK_NOW_PLAYING;
  }

  const record = candidate as Record<string, unknown>;

  const title = typeof record.title === 'string' && record.title.trim()
    ? record.title.trim()
    : FALLBACK_NOW_PLAYING.title;

  const artist = typeof record.artist === 'string' && record.artist.trim()
    ? record.artist.trim()
    : FALLBACK_NOW_PLAYING.artist;

  const artwork = typeof record.artwork === 'string' && record.artwork.trim()
    ? record.artwork.trim()
    : FALLBACK_NOW_PLAYING.artwork;

  const startedAt = typeof record.startedAt === 'string' ? record.startedAt : undefined;

  return {
    title,
    artist,
    artwork,
    startedAt
  };
}

export async function fetchNowPlaying(): Promise<NowPlaying> {
  try {
    if (METADATA_URL) {
      const response = await fetch(METADATA_URL, {
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch metadata: ${response.status}`);
      }

      const data = await response.json();
      return parseNowPlaying(data);
    }

    const module = await import('../assets/data/nowPlaying.mock.json');
    return parseNowPlaying(module.default);
  } catch (error) {
    console.error('Failed to load Now Playing metadata', error);
    return FALLBACK_NOW_PLAYING;
  }
}

export { FALLBACK_NOW_PLAYING };
