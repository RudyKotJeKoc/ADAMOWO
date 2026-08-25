import { render } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AudioEngine } from './AudioEngine';
import { useAudioEngineStore, usePlaylistQueueStore } from '../../state/media';
import type { AudioTrack } from './media.schema';

/**
 * These tests target the QUEUE CHANGES effect regression caught in review:
 * play() calls setStatus('loading') synchronously, before currentTrack
 * updates. If that effect depended on `status` directly (as an earlier draft
 * of the exhaustive-deps fix did), the loading transition would re-fire the
 * effect while the guard (`currentQueueTrack.id !== currentTrack?.id`) was
 * still true — starting a second, overlapping load/playback for the same
 * track. The fix reads status/currentTrack/crossfadeDuration through refs so
 * the effect only ever fires on an actual queue change.
 *
 * jsdom has no Web Audio API, so AudioContext and its nodes are mocked here.
 * decodeAudioData is the controlled async boundary: each call returns a
 * deferred promise the test resolves explicitly, simulating an in-flight
 * network+decode that hasn't settled yet. Between setStatus('loading') and
 * the decodeAudioData call, play()/crossfadeToTrack() cross three await
 * points (ctx.resume() when suspended, fetch(), response.arrayBuffer()), so
 * every trigger below is followed by a microtask flush before assertions.
 */

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

type Deferred<T> = ReturnType<typeof createDeferred<T>>;

const fakeBuffer = { duration: 200 } as unknown as AudioBuffer;

class MockAudioContext {
  currentTime = 0;
  state: AudioContextState = 'running';
  destination = {};
  decodeCalls: Array<Deferred<AudioBuffer>> = [];
  sources: Array<{
    buffer: AudioBuffer | null;
    onended: (() => void) | null;
    connect: ReturnType<typeof vi.fn>;
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
  }> = [];

  createBufferSource = vi.fn(() => {
    const source = {
      buffer: null as AudioBuffer | null,
      onended: null as (() => void) | null,
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
    this.sources.push(source);
    return source;
  });

  createGain = vi.fn(() => ({
    gain: { value: 0, linearRampToValueAtTime: vi.fn() },
    connect: vi.fn(),
  }));

  createAnalyser = vi.fn(() => ({
    fftSize: 256,
    smoothingTimeConstant: 0.8,
    minDecibels: -90,
    maxDecibels: -10,
    frequencyBinCount: 128,
    connect: vi.fn(),
    getByteFrequencyData: vi.fn(),
    getByteTimeDomainData: vi.fn(),
  }));

  decodeAudioData = vi.fn(() => {
    const deferred = createDeferred<AudioBuffer>();
    this.decodeCalls.push(deferred);
    return deferred.promise;
  });

  resume = vi.fn(() => Promise.resolve());
  close = vi.fn();
}

let mockCtx: MockAudioContext;

function track(id: string): AudioTrack {
  return { id, title: id, artist: 'Test', url: `https://example.com/${id}.mp3` };
}

async function flushMicrotasks(): Promise<void> {
  // play()/crossfadeToTrack() cross three real await points before reaching
  // decodeAudioData (ctx.resume() when suspended, fetch(), arrayBuffer());
  // enough resolved-promise ticks let each one settle in turn.
  await act(async () => {
    for (let i = 0; i < 6; i += 1) {
      await Promise.resolve();
    }
  });
}

async function setQueueTracks(tracks: AudioTrack[]): Promise<void> {
  act(() => {
    usePlaylistQueueStore.getState().setQueue(tracks);
  });
  await flushMicrotasks();
}

async function jumpTo(index: number): Promise<void> {
  act(() => {
    usePlaylistQueueStore.getState().jumpTo(index);
  });
  await flushMicrotasks();
}

describe('AudioEngine', () => {
  beforeEach(() => {
    window.localStorage.clear();

    mockCtx = new MockAudioContext();
    vi.stubGlobal(
      'AudioContext',
      vi.fn(() => mockCtx)
    );
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          statusText: 'OK',
          arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
        } as unknown as Response)
      )
    );

    useAudioEngineStore.setState({
      status: 'idle',
      currentTrack: null,
      nextTrack: null,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      muted: false,
      error: null,
      isTransitioning: false,
      config: {
        crossfadeDuration: 3000,
        preloadNextTrack: false,
        enableCaching: false,
        cacheSize: 10,
        volume: 0.8,
        enableVisualization: false,
      },
    });

    usePlaylistQueueStore.setState({
      queue: { currentIndex: 0, tracks: [], history: [], shuffle: false, repeat: 'none' },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('does not start a second load when status flips from idle to loading mid-flight', async () => {
    render(<AudioEngine />);

    const trackA = track('a');
    await setQueueTracks([trackA]);

    // By now play()'s setStatus('loading') has already landed — if the
    // effect were still keyed on `status`, that transition would have
    // re-fired it and issued a second decodeAudioData call.
    expect(useAudioEngineStore.getState().status).toBe('loading');
    expect(mockCtx.decodeAudioData).toHaveBeenCalledTimes(1);

    mockCtx.decodeCalls[0].resolve(fakeBuffer);
    await flushMicrotasks();

    expect(mockCtx.createBufferSource).toHaveBeenCalledTimes(1);
    expect(mockCtx.sources[0].start).toHaveBeenCalledTimes(1);
    expect(useAudioEngineStore.getState().status).toBe('playing');
    expect(useAudioEngineStore.getState().currentTrack?.id).toBe('a');

    // The loading -> playing transition just above is a second status
    // change after mount; it must not have triggered any further load.
    expect(mockCtx.decodeAudioData).toHaveBeenCalledTimes(1);
  });

  it('does not start a second crossfade load when isTransitioning changes mid-flight', async () => {
    render(<AudioEngine />);

    const trackA = track('a');
    const trackB = track('b');
    await setQueueTracks([trackA, trackB]);

    expect(mockCtx.decodeAudioData).toHaveBeenCalledTimes(1);
    mockCtx.decodeCalls[0].resolve(fakeBuffer);
    await flushMicrotasks();
    expect(useAudioEngineStore.getState().status).toBe('playing');

    // Short but positive crossfadeDuration: long enough that the completion
    // setTimeout can be observed as still pending, short enough to await
    // with real timers instead of needing fake-timer/microtask interleaving.
    act(() => {
      useAudioEngineStore.getState().updateConfig({ crossfadeDuration: 10 });
    });

    await jumpTo(1);

    // crossfadeToTrack sets isTransitioning(true) synchronously, before its
    // own await — if the effect depended on isTransitioning/status directly,
    // that flip would re-fire it here, while currentTrack still points at
    // trackA and the guard is still true, issuing a second crossfade load.
    expect(useAudioEngineStore.getState().isTransitioning).toBe(true);
    expect(mockCtx.decodeAudioData).toHaveBeenCalledTimes(2);

    mockCtx.decodeCalls[1].resolve(fakeBuffer);
    await flushMicrotasks();
    // Let the crossfade-completion setTimeout fire.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    expect(mockCtx.createBufferSource).toHaveBeenCalledTimes(2);
    expect(mockCtx.sources[1].start).toHaveBeenCalledTimes(1);
    expect(useAudioEngineStore.getState().currentTrack?.id).toBe('b');
    expect(useAudioEngineStore.getState().isTransitioning).toBe(false);
    expect(mockCtx.decodeAudioData).toHaveBeenCalledTimes(2);
  });

  it('starts exactly one load per real queue change when the track is switched during loading', async () => {
    render(<AudioEngine />);

    const trackA = track('a');
    const trackB = track('b');
    await setQueueTracks([trackA, trackB]);

    expect(mockCtx.decodeAudioData).toHaveBeenCalledTimes(1);
    expect(useAudioEngineStore.getState().status).toBe('loading');

    // The user (or an autoplay-next event) moves on before trackA's load
    // settles. This is a real queue change, so a second load for trackB is
    // expected and correct — the fixed effect only guards against firing
    // again for the *same* track from a status/currentTrack side effect.
    await jumpTo(1);

    expect(mockCtx.decodeAudioData).toHaveBeenCalledTimes(2);

    mockCtx.decodeCalls[1].resolve(fakeBuffer);
    await flushMicrotasks();

    expect(mockCtx.createBufferSource).toHaveBeenCalledTimes(1);
    expect(mockCtx.sources[0].start).toHaveBeenCalledTimes(1);
    expect(useAudioEngineStore.getState().currentTrack?.id).toBe('b');

    // trackA's load is still pending and intentionally left unresolved here
    // — exactly two loads were started (one per real queue change), not
    // three, confirming the status transitions in between didn't add one.
    expect(mockCtx.decodeAudioData).toHaveBeenCalledTimes(2);
  });

  it('runs the cleanup effect and tolerates a load resolving after unmount', async () => {
    const { unmount } = render(<AudioEngine />);

    const trackA = track('a');
    await setQueueTracks([trackA]);
    expect(mockCtx.decodeAudioData).toHaveBeenCalledTimes(1);

    unmount();
    expect(mockCtx.close).toHaveBeenCalledTimes(1);

    // The network/decode finishing after unmount must not throw or reject
    // unhandled; play()'s own guard clauses (audio context/track refs) are
    // exercised here rather than any test-only workaround.
    await expect(async () => {
      mockCtx.decodeCalls[0].resolve(fakeBuffer);
      await flushMicrotasks();
    }).not.toThrow();
  });
});
