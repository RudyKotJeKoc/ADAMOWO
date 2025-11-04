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

import { useEffect, useRef, useCallback, useMemo } from 'react';
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
    nextTrack,
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

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  const initializeAudioContext = useCallback(() => {
    if (audioContextRef.current) return audioContextRef.current;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
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

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

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
      try {
        setStatus('loading');
        setError(null);

        const ctx = initializeAudioContext();
        if (!ctx) return;

        // Resume context if suspended (browser autoplay policy)
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        // Load audio buffer
        const buffer = await loadAudioBuffer(track);

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
            handleTrackEnd();
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
        startTimeUpdates();

        // Preload next track
        if (config.preloadNextTrack) {
          preloadNext();
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setError(errorMessage);
        setStatus('error');
        onEvent?.({ type: 'error', error: error as Error, track });
      }
    },
    [
      initializeAudioContext,
      loadAudioBuffer,
      createSource,
      volume,
      muted,
      config.preloadNextTrack,
      setStatus,
      setError,
      setCurrentTrack,
      setDuration,
      onEvent,
      addToHistory,
    ]
  );

  const pause = useCallback(() => {
    const ctx = audioContextRef.current;
    const source = currentSourceRef.current;

    if (ctx && source) {
      pauseTimeRef.current = ctx.currentTime - startTimeRef.current;
      source.stop();
      currentSourceRef.current = null;
      setStatus('paused');
      stopTimeUpdates();
      onEvent?.({ type: 'pause' });
    }
  }, [setStatus, onEvent]);

  const resume = useCallback(() => {
    if (!currentTrack) return;

    const ctx = audioContextRef.current;
    if (!ctx) return;

    const cached = getCachedBuffer(currentTrack.id);
    if (!cached) {
      play(currentTrack);
      return;
    }

    const gainNode = ctx.createGain();
    gainNode.gain.value = muted ? 0 : volume;
    currentGainRef.current = gainNode;

    const source = createSource(cached, gainNode);
    currentSourceRef.current = source;

    source.onended = () => {
      if (currentSourceRef.current === source) {
        onEvent?.({ type: 'trackEnd', track: currentTrack });
        addToHistory(currentTrack);
        handleTrackEnd();
      }
    };

    source.start(0, pauseTimeRef.current);
    startTimeRef.current = ctx.currentTime - pauseTimeRef.current;

    setStatus('playing');
    startTimeUpdates();
    onEvent?.({ type: 'play' });
  }, [currentTrack, volume, muted, getCachedBuffer, createSource, play, setStatus, onEvent, addToHistory]);

  const stop = useCallback(() => {
    const source = currentSourceRef.current;
    if (source) {
      source.stop();
      currentSourceRef.current = null;
    }

    stopTimeUpdates();
    setStatus('idle');
    setCurrentTrack(null);
    setCurrentTime(0);
    onEvent?.({ type: 'stop' });
  }, [setStatus, setCurrentTrack, setCurrentTime, onEvent]);

  // ============================================================================
  // CROSSFADE TRANSITION
  // ============================================================================

  const crossfadeToTrack = useCallback(
    async (newTrack: AudioTrack) => {
      try {
        const ctx = audioContextRef.current;
        if (!ctx) return;

        setTransitioning(true);
        onEvent?.({ type: 'crossfadeStart', from: currentTrack!, to: newTrack });

        // Load next track buffer
        const buffer = await loadAudioBuffer(newTrack);

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
            handleTrackEnd();
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
            preloadNext();
          }
        }, config.crossfadeDuration);
      } catch (error) {
        setTransitioning(false);
        setError(error instanceof Error ? error.message : 'Crossfade failed');
      }
    },
    [
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

          const averageFrequency = frequencyData.reduce((sum, val) => sum + val, 0) / frequencyData.length;
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

    if (currentQueueTrack && currentQueueTrack.id !== currentTrack?.id) {
      if (status === 'playing' && config.crossfadeDuration > 0) {
        crossfadeToTrack(currentQueueTrack);
      } else {
        play(currentQueueTrack);
      }
    }
  }, [queue.currentIndex, queue.tracks]);

  // ============================================================================
  // CLEANUP
  // ============================================================================

  useEffect(() => {
    return () => {
      stop();
      stopTimeUpdates();
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
