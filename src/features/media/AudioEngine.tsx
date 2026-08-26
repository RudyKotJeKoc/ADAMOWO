/**
 * AudioEngine Component
 *
 * Advanced audio playback engine with Web Audio API
 * Features:
 * - Crossfade transitions between tracks
 * - Audio buffer caching for performance
 * - Pre-loading of next track
 * - Real-time audio analysis for visualization
 * - Error handling and retry logic
 */

import { useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { useAudioEngineStore, usePlaylistQueueStore } from '../../state/media';
import type { AudioTrack, AudioCache, AudioEngineEvent, AudioAnalysisData } from './media.schema';

interface AudioEngineProps {
  onEvent?: (event: AudioEngineEvent) => void;
  onAnalysisUpdate?: (data: AudioAnalysisData) => void;
}

export function AudioEngine({ onEvent, onAnalysisUpdate }: AudioEngineProps): null {
  // ============================================================================
  // STATE & REFS
  // ============================================================================

  const {
    config,
    status,
    currentTrack,
    volume,
    muted,
    setStatus,
    setCurrentTrack,
    setNextTrack,
    setCurrentTime,
    setDuration,
    setError,
    setTransitioning,
  } = useAudioEngineStore();

  const { queue, next: nextInQueue, addToHistory } = usePlaylistQueueStore();

  // Web Audio API context and nodes
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const nextSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const currentGainRef = useRef<GainNode | null>(null);
  const nextGainRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Cache management
  const cacheRef = useRef<Map<string, AudioCache>>(new Map());
  const preloadAbortRef = useRef<AbortController | null>(null);

  // Playback state
  const startTimeRef = useRef<number>(0);
  const pauseTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const crossfadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Invalidates in-flight playback requests. play()/crossfadeToTrack() each
  // bump this and capture the new value before their first await; stop()
  // bumps it without starting new work. Aborting the in-flight fetch is a
  // best-effort optimization (decodeAudioData can't be aborted, and may
  // already be running once the network request completes), so every
  // request also re-checks this counter after its own await points —
  // "am I still the current request?" — before touching the audio graph
  // or playback state. See the loading/currentTrack race caught in review.
  const requestGenerationRef = useRef(0);
  const activeLoadAbortRef = useRef<AbortController | null>(null);

  const beginPlaybackRequest = useCallback((): {
    generation: number;
    signal: AbortSignal;
  } => {
    activeLoadAbortRef.current?.abort();
    const controller = new AbortController();
    activeLoadAbortRef.current = controller;
    const generation = requestGenerationRef.current + 1;
    requestGenerationRef.current = generation;
    return { generation, signal: controller.signal };
  }, []);

  // Refs holding the latest versions of callbacks whose own identities
  // change on nearly every playback state transition (they depend on
  // status/currentTrack/queue/onEvent). Call sites below invoke these
  // through the ref instead of listing the callback itself as a
  // dependency, so calling one doesn't make the *caller's* identity (or a
  // caller effect's dependency check) change too — which would risk
  // re-triggering that caller and double-invoking play()/crossfadeToTrack()
  // for the same track while the first call is still in flight.
  const handleTrackEndRef = useRef<() => void>(() => {});
  const preloadNextRef = useRef<() => void>(() => {});
  const startTimeUpdatesRef = useRef<() => void>(() => {});
  const stopRef = useRef<() => void>(() => {});
  const stopTimeUpdatesRef = useRef<() => void>(() => {});
  const playRef = useRef<(track: AudioTrack) => Promise<void>>(async () => {});
  const crossfadeToTrackRef = useRef<(track: AudioTrack) => Promise<void>>(async () => {});

  // Latest status/currentTrack/crossfadeDuration for the QUEUE CHANGES effect
  // below to read without depending on them: play() itself calls
  // setStatus('loading') synchronously, before currentTrack is updated, so
  // if that effect depended on `status` directly it would re-fire on that
  // transition — while the track it just started is still loading, with the
  // guard still true (currentTrack hasn't caught up yet) — and call play()
  // a second time for the same track. Populated below by the single
  // "LATEST REFS SYNC" useLayoutEffect, not assigned inline during render.
  const statusRef = useRef(status);
  const currentTrackIdRef = useRef(currentTrack?.id);
  const crossfadeDurationRef = useRef(config.crossfadeDuration);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  const initializeAudioContext = useCallback(() => {
    if (audioContextRef.current) return audioContextRef.current;

    const AudioContextClass =
      window.AudioContext ||
      ((window as unknown as Record<string, unknown>).webkitAudioContext as typeof AudioContext);
    if (!AudioContextClass) {
      setError('Web Audio API not supported');
      return null;
    }

    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;

    // Create analyser node for visualization
    const analyser = ctx.createAnalyser();
    analyser.fftSize = config.enableVisualization ? 256 : 32;
    analyser.smoothingTimeConstant = 0.8;
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.connect(ctx.destination);
    analyserRef.current = analyser;

    return ctx;
  }, [config.enableVisualization, setError]);

  // ============================================================================
  // CACHE MANAGEMENT
  // ============================================================================

  const getCachedBuffer = useCallback((trackId: string): AudioBuffer | null => {
    const cached = cacheRef.current.get(trackId);
    if (cached) {
      cached.lastAccessed = Date.now();
      cached.accessCount++;
      return cached.buffer;
    }
    return null;
  }, []);

  const addToCache = useCallback(
    (trackId: string, buffer: AudioBuffer) => {
      const cache = cacheRef.current;

      // Remove oldest entries if cache is full
      if (cache.size >= config.cacheSize) {
        const sortedEntries = Array.from(cache.entries()).sort(
          ([, a], [, b]) => a.lastAccessed - b.lastAccessed
        );
        cache.delete(sortedEntries[0][0]);
      }

      cache.set(trackId, {
        trackId,
        buffer,
        cachedAt: Date.now(),
        accessCount: 1,
        lastAccessed: Date.now(),
      });
    },
    [config.cacheSize]
  );

  // ============================================================================
  // AUDIO LOADING
  // ============================================================================

  const loadAudioBuffer = useCallback(
    async (track: AudioTrack, signal?: AbortSignal): Promise<AudioBuffer> => {
      // Check cache first
      if (config.enableCaching) {
        const cached = getCachedBuffer(track.id);
        if (cached) return cached;
      }

      // Fetch and decode audio
      const response = await fetch(track.url, { signal });
      if (!response.ok) throw new Error(`Failed to fetch audio: ${response.statusText}`);

      const arrayBuffer = await response.arrayBuffer();
      const ctx = audioContextRef.current;
      if (!ctx) throw new Error('Audio context not initialized');

      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      // Add to cache
      if (config.enableCaching) {
        addToCache(track.id, audioBuffer);
      }

      return audioBuffer;
    },
    [config.enableCaching, getCachedBuffer, addToCache]
  );

  // ============================================================================
  // PLAYBACK CONTROL
  // ============================================================================

  const createSource = useCallback(
    (buffer: AudioBuffer, gainNode: GainNode): AudioBufferSourceNode => {
      const ctx = audioContextRef.current;
      if (!ctx) throw new Error('Audio context not initialized');

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(analyserRef.current!);

      return source;
    },
    []
  );

  const play = useCallback(
    async (track: AudioTrack) => {
      const { generation, signal } = beginPlaybackRequest();

      try {
        setStatus('loading');
        setError(null);
        // A plain play() starting always means "not crossfading anymore" —
        // reset unconditionally rather than trying to reason about
        // generation ordering against a crossfade this call may have just
        // superseded (whose own bail-out paths intentionally don't touch
        // this flag, to avoid clobbering a *newer* crossfade's true value).
        setTransitioning(false);

        const ctx = initializeAudioContext();
        if (!ctx) return;

        // Resume context if suspended (browser autoplay policy)
        if (ctx.state === 'suspended') {
          await ctx.resume();
          if (requestGenerationRef.current !== generation) return;
        }

        // Load audio buffer
        const buffer = await loadAudioBuffer(track, signal);

        // A newer play()/crossfadeToTrack()/stop() call superseded this one
        // while the buffer was loading (decodeAudioData can't be aborted,
        // so this is the only guard once fetch has already completed) —
        // abandon silently rather than create a source, start it, or
        // overwrite currentTrack/status for a track nothing wants anymore.
        if (requestGenerationRef.current !== generation) return;

        // Create gain node for volume control
        const gainNode = ctx.createGain();
        gainNode.gain.value = muted ? 0 : volume;
        currentGainRef.current = gainNode;

        // Create and start source
        const source = createSource(buffer, gainNode);
        currentSourceRef.current = source;

        // Handle track end
        source.onended = () => {
          if (currentSourceRef.current === source) {
            onEvent?.({ type: 'trackEnd', track });
            addToHistory(track);
            handleTrackEndRef.current();
          }
        };

        // Start playback
        source.start(0);
        startTimeRef.current = ctx.currentTime;
        pauseTimeRef.current = 0;

        setCurrentTrack(track);
        setDuration(buffer.duration);
        setStatus('playing');

        onEvent?.({ type: 'trackStart', track });
        onEvent?.({ type: 'play' });

        // Start time updates
        startTimeUpdatesRef.current();

        // Preload next track
        if (config.preloadNextTrack) {
          preloadNextRef.current();
        }
      } catch (error) {
        // A superseding call aborts this one's fetch (or invalidates the
        // generation outright) — that's not this call's error to report.
        if (requestGenerationRef.current !== generation) return;

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
        setStatus('error');
        onEvent?.({ type: 'error', error: error as Error, track });
      }
    },
    [
      beginPlaybackRequest,
      initializeAudioContext,
      loadAudioBuffer,
      createSource,
      volume,
      muted,
      config.preloadNextTrack,
      setStatus,
      setError,
      setTransitioning,
      setCurrentTrack,
      setDuration,
      onEvent,
      addToHistory,
    ]
  );

  const stop = useCallback(() => {
    // Invalidate any in-flight play()/crossfadeToTrack() request — stopping
    // must not let a load that was already underway create a source and
    // start playback right after this call returns.
    activeLoadAbortRef.current?.abort();
    requestGenerationRef.current += 1;

    const source = currentSourceRef.current;
    if (source) {
      source.stop();
      currentSourceRef.current = null;
    }

    // A crossfade may already have started nextSource — without this, it
    // keeps playing (and its pending timeout still fires crossfadeEnd/
    // trackChange later) even though stop() was just called.
    if (crossfadeTimeoutRef.current) {
      clearTimeout(crossfadeTimeoutRef.current);
      crossfadeTimeoutRef.current = null;
    }
    const nextSource = nextSourceRef.current;
    if (nextSource) {
      nextSource.stop();
      nextSourceRef.current = null;
    }
    nextGainRef.current = null;
    setTransitioning(false);

    // stopTimeUpdates is declared further down (in the TIME UPDATES section)
    // and is stable, but referencing it directly here would need it in this
    // callback's deps, which — since it's declared after `stop` in source
    // order — would hit its temporal dead zone when the deps array below is
    // evaluated. Going through the ref sidesteps the ordering issue.
    stopTimeUpdatesRef.current();
    setStatus('idle');
    setCurrentTrack(null);
    setCurrentTime(0);
    onEvent?.({ type: 'stop' });
  }, [setStatus, setCurrentTrack, setCurrentTime, setTransitioning, onEvent]);

  // ============================================================================
  // CROSSFADE TRANSITION
  // ============================================================================

  const crossfadeToTrack = useCallback(
    async (newTrack: AudioTrack) => {
      const { generation, signal } = beginPlaybackRequest();

      try {
        const ctx = audioContextRef.current;
        if (!ctx) return;

        setTransitioning(true);
        onEvent?.({ type: 'crossfadeStart', from: currentTrack!, to: newTrack });

        // Load next track buffer
        const buffer = await loadAudioBuffer(newTrack, signal);

        // Superseded while loading — abandon before creating any nodes or
        // touching the audio graph/store for a track nothing wants anymore.
        // Do NOT touch setTransitioning here: a newer play()/crossfadeToTrack()
        // may already own the transitioning flag (e.g. set it to true for its
        // own crossfade), and this stale branch clearing it would clobber that.
        if (requestGenerationRef.current !== generation) {
          return;
        }

        // Create gain node for new track
        const nextGainNode = ctx.createGain();
        nextGainNode.gain.value = 0; // Start at 0
        nextGainRef.current = nextGainNode;

        // Create and start new source
        const nextSource = createSource(buffer, nextGainNode);
        nextSourceRef.current = nextSource;

        nextSource.onended = () => {
          if (nextSourceRef.current === nextSource) {
            onEvent?.({ type: 'trackEnd', track: newTrack });
            addToHistory(newTrack);
            handleTrackEndRef.current();
          }
        };

        nextSource.start(0);

        // Crossfade: fade out current, fade in next
        const fadeTime = config.crossfadeDuration / 1000;
        const now = ctx.currentTime;

        if (currentGainRef.current) {
          currentGainRef.current.gain.linearRampToValueAtTime(0, now + fadeTime);
        }
        nextGainNode.gain.linearRampToValueAtTime(muted ? 0 : volume, now + fadeTime);

        // Wait for crossfade to complete
        crossfadeTimeoutRef.current = setTimeout(() => {
          if (requestGenerationRef.current !== generation) {
            // Superseded while the fade was in progress — a newer request
            // already owns currentSourceRef/currentGainRef by now; stop
            // this generation's source instead of leaving it playing
            // underneath whatever superseded it.
            nextSource.stop();
            return;
          }

          // Stop old source
          if (currentSourceRef.current) {
            currentSourceRef.current.stop();
          }

          // Swap references
          currentSourceRef.current = nextSource;
          currentGainRef.current = nextGainNode;
          nextSourceRef.current = null;
          nextGainRef.current = null;

          startTimeRef.current = ctx.currentTime;
          pauseTimeRef.current = 0;

          setCurrentTrack(newTrack);
          setNextTrack(null);
          setDuration(buffer.duration);
          setTransitioning(false);

          onEvent?.({ type: 'crossfadeEnd', track: newTrack });
          onEvent?.({ type: 'trackChange', from: currentTrack, to: newTrack });

          // Preload next
          if (config.preloadNextTrack) {
            preloadNextRef.current();
          }
        }, config.crossfadeDuration);
      } catch (error) {
        // A superseding call aborts this one's fetch (or invalidates the
        // generation outright) — that's not this call's error to report.
        if (requestGenerationRef.current !== generation) return;

        setTransitioning(false);
        setError(error instanceof Error ? error.message : 'Crossfade failed');
      }
    },
    [
      beginPlaybackRequest,
      currentTrack,
      volume,
      muted,
      config.crossfadeDuration,
      config.preloadNextTrack,
      loadAudioBuffer,
      createSource,
      setTransitioning,
      setCurrentTrack,
      setNextTrack,
      setDuration,
      setError,
      onEvent,
      addToHistory,
    ]
  );

  // ============================================================================
  // TRACK NAVIGATION
  // ============================================================================

  const handleTrackEnd = useCallback(() => {
    nextInQueue();
    // The queue will update, triggering effect to play next track
  }, [nextInQueue]);

  const preloadNext = useCallback(() => {
    const nextQueueTrack = queue.tracks[queue.currentIndex + 1];
    if (!nextQueueTrack || !config.preloadNextTrack) return;

    // Cancel previous preload
    if (preloadAbortRef.current) {
      preloadAbortRef.current.abort();
    }

    const controller = new AbortController();
    preloadAbortRef.current = controller;

    loadAudioBuffer(nextQueueTrack, controller.signal)
      .then(() => {
        setNextTrack(nextQueueTrack);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.warn('Failed to preload next track:', error);
        }
      });
  }, [queue, config.preloadNextTrack, loadAudioBuffer, setNextTrack]);

  // ============================================================================
  // TIME UPDATES & ANALYSIS
  // ============================================================================

  const startTimeUpdates = useCallback(() => {
    const updateTime = () => {
      const ctx = audioContextRef.current;
      const analyser = analyserRef.current;

      if (ctx && status === 'playing') {
        const elapsed = ctx.currentTime - startTimeRef.current;
        setCurrentTime(elapsed);

        onEvent?.({
          type: 'timeUpdate',
          currentTime: elapsed,
          duration: currentTrack?.duration || 0,
        });

        // Audio analysis for visualization
        if (analyser && config.enableVisualization && onAnalysisUpdate) {
          const frequencyData = new Uint8Array(analyser.frequencyBinCount);
          const timeDomainData = new Uint8Array(analyser.fftSize);

          analyser.getByteFrequencyData(frequencyData);
          analyser.getByteTimeDomainData(timeDomainData);

          // Calculate levels
          const bassEnd = Math.floor(frequencyData.length * 0.1);
          const midEnd = Math.floor(frequencyData.length * 0.5);

          const bassLevel =
            frequencyData.slice(0, bassEnd).reduce((sum, val) => sum + val, 0) / (bassEnd * 255);
          const midLevel =
            frequencyData.slice(bassEnd, midEnd).reduce((sum, val) => sum + val, 0) /
            ((midEnd - bassEnd) * 255);
          const trebleLevel =
            frequencyData.slice(midEnd).reduce((sum, val) => sum + val, 0) /
            ((frequencyData.length - midEnd) * 255);

          const averageFrequency =
            frequencyData.reduce((sum, val) => sum + val, 0) / frequencyData.length;
          const peakFrequency = Math.max(...frequencyData);

          onAnalysisUpdate({
            frequencyData,
            timeDomainData,
            averageFrequency,
            peakFrequency,
            bassLevel,
            midLevel,
            trebleLevel,
          });
        }

        animationFrameRef.current = requestAnimationFrame(updateTime);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateTime);
  }, [status, currentTrack, config.enableVisualization, setCurrentTime, onEvent, onAnalysisUpdate]);

  const stopTimeUpdates = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  // ============================================================================
  // LATEST REFS SYNC
  // ============================================================================
  // Assigning `ref.current = value` directly in the render body is a
  // commonly-used React escape hatch (harmless as long as nothing reads the
  // ref during that same render), but it does mutate during render, which a
  // discarded/uncommitted render pass could in principle leak. Using
  // useLayoutEffect instead means these refs are only ever written for a
  // render that actually committed, synchronously before any other effect
  // (layout or passive) in this component can read them.
  useLayoutEffect(() => {
    statusRef.current = status;
    currentTrackIdRef.current = currentTrack?.id;
    crossfadeDurationRef.current = config.crossfadeDuration;
    playRef.current = play;
    stopRef.current = stop;
    crossfadeToTrackRef.current = crossfadeToTrack;
    handleTrackEndRef.current = handleTrackEnd;
    preloadNextRef.current = preloadNext;
    startTimeUpdatesRef.current = startTimeUpdates;
    stopTimeUpdatesRef.current = stopTimeUpdates;
  });

  // ============================================================================
  // VOLUME CONTROL
  // ============================================================================

  useEffect(() => {
    const gainNode = currentGainRef.current;
    if (gainNode) {
      gainNode.gain.value = muted ? 0 : volume;
      onEvent?.({ type: 'volumeChange', volume: muted ? 0 : volume });
    }
  }, [volume, muted, onEvent]);

  // ============================================================================
  // QUEUE CHANGES
  // ============================================================================

  useEffect(() => {
    const currentQueueTrack = queue.tracks[queue.currentIndex];

    // status/currentTrack/config.crossfadeDuration are read through refs,
    // not the reactive values in scope: this effect must fire only on an
    // actual queue change. play() itself calls setStatus('loading')
    // synchronously, before currentTrack updates, so depending on `status`
    // directly would re-run this effect mid-flight — while the track it
    // just started is still loading and the guard below is still true
    // (currentTrack hasn't caught up yet) — firing a second, overlapping
    // play for the same track. See the P1 fix that caught this in review.
    if (currentQueueTrack && currentQueueTrack.id !== currentTrackIdRef.current) {
      if (statusRef.current === 'playing' && crossfadeDurationRef.current > 0) {
        crossfadeToTrackRef.current(currentQueueTrack);
      } else {
        playRef.current(currentQueueTrack);
      }
    }
  }, [queue.currentIndex, queue.tracks]);

  // ============================================================================
  // CLEANUP
  // ============================================================================

  useEffect(() => {
    return () => {
      // This must run only on unmount (empty dep array), not whenever stop
      // or stopTimeUpdates are recreated — going through the refs lets it
      // call the latest versions without adding them as dependencies.
      stopRef.current();
      stopTimeUpdatesRef.current();
      if (crossfadeTimeoutRef.current) {
        clearTimeout(crossfadeTimeoutRef.current);
      }
      if (preloadAbortRef.current) {
        preloadAbortRef.current.abort();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // ============================================================================
  // PUBLIC API (exposed through store)
  // ============================================================================

  // Expose play/pause/stop methods through a custom hook or context if needed
  // For now, control is via the store

  return null; // Headless component
}

export default AudioEngine;
