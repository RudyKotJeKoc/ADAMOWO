import { beforeEach, describe, expect, it, vi } from 'vitest';

import { usePlaylistQueueStore } from './media';
import type { AudioTrack } from '../features/media/media.schema';

const buildTrack = (id: string): AudioTrack => ({
  id,
  title: `Track ${id}`,
  artist: 'Test Artist',
  url: `/music/${id}.mp3`,
});

describe('state/media playlist queue', () => {
  beforeEach(() => {
    usePlaylistQueueStore.setState({
      queue: {
        currentIndex: 0,
        tracks: [],
        history: [],
        shuffle: false,
        repeat: 'none',
      },
    });
    usePlaylistQueueStore.persist.clearStorage();
    vi.restoreAllMocks();
  });

  it('uses all tracks once in shuffle mode before repeating', () => {
    const tracks = [buildTrack('1'), buildTrack('2'), buildTrack('3')];

    usePlaylistQueueStore.getState().setQueue(tracks);
    usePlaylistQueueStore.getState().toggleShuffle();

    usePlaylistQueueStore.getState().addToHistory(tracks[0]);

    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);

    usePlaylistQueueStore.getState().next();
    expect(usePlaylistQueueStore.getState().queue.currentIndex).toBe(1);

    usePlaylistQueueStore.getState().addToHistory(tracks[1]);
    usePlaylistQueueStore.getState().next();
    expect(usePlaylistQueueStore.getState().queue.currentIndex).toBe(2);

    usePlaylistQueueStore.getState().addToHistory(tracks[2]);
    usePlaylistQueueStore.getState().next();

    const queueAfterCycle = usePlaylistQueueStore.getState().queue;
    expect(queueAfterCycle.history).toEqual([]);
    expect(queueAfterCycle.currentIndex).toBe(0);

    randomSpy.mockRestore();
  });

  it('keeps history capacity aligned with playlist size instead of fixed 50', () => {
    const tracks = [buildTrack('1'), buildTrack('2'), buildTrack('3')];

    usePlaylistQueueStore.getState().setQueue(tracks);

    usePlaylistQueueStore.getState().addToHistory(tracks[0]);
    usePlaylistQueueStore.getState().addToHistory(tracks[1]);
    usePlaylistQueueStore.getState().addToHistory(tracks[2]);
    usePlaylistQueueStore.getState().addToHistory(tracks[0]);

    const history = usePlaylistQueueStore.getState().queue.history;

    expect(history).toHaveLength(3);
    expect(history.map((track) => track.id)).toEqual(['1', '3', '2']);
  });
});
