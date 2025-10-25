import { useEffect, useRef } from 'react';

interface AudioVizProps {
  audio: HTMLAudioElement | null;
  active: boolean;
  ariaLabel: string;
}

export function AudioViz({ audio, active, ariaLabel }: AudioVizProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const previousDataRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth * dpr;
    const height = canvas.clientHeight * dpr;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !audio || !active) {
      if (!active && audioContextRef.current?.state === 'running') {
        void audioContextRef.current.suspend().catch(() => undefined);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
      return;
    }

    let isMounted = true;

    const ensureContext = async (): Promise<void> => {
      if (!audioContextRef.current) {
        try {
          const context = new AudioContext();
          const source = context.createMediaElementSource(audio);
          const analyser = context.createAnalyser();
          analyser.fftSize = 128;
          analyser.smoothingTimeConstant = 0.8;
          source.connect(analyser);
          analyser.connect(context.destination);
          audioContextRef.current = context;
          analyserRef.current = analyser;
          sourceRef.current = source;
        } catch (error) {
          console.warn('Audio visualizer could not initialise', error);
          return;
        }
      }

      const context = audioContextRef.current;
      const analyser = analyserRef.current;

      if (!context || !analyser) {
        return;
      }

      if (context.state === 'suspended') {
        try {
          await context.resume();
        } catch (error) {
          console.warn('AudioContext resume failed', error);
        }
      }

      const canvasContext = canvas.getContext('2d');
      if (!canvasContext) {
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      previousDataRef.current = new Uint8Array(bufferLength);

      const draw = (): void => {
        if (!isMounted) {
          return;
        }

        analyser.getByteFrequencyData(dataArray);

        const { width, height } = canvas;
        canvasContext.clearRect(0, 0, width, height);

        const barCount = 48;
        const barWidth = width / barCount;
        const gap = barWidth * 0.3;

        for (let i = 0; i < barCount; i += 1) {
          const index = Math.floor((i / barCount) * bufferLength);
          const value = dataArray[index] / 255;
          const previousValue = previousDataRef.current![index] / 255;

          const smoothValue = previousValue + (value - previousValue) * 0.3;
          previousDataRef.current![index] = smoothValue * 255;

          const barHeight = smoothValue * height * 0.85;
          const x = i * barWidth;
          const y = height - barHeight;

          const gradient = canvasContext.createLinearGradient(0, y, 0, height);
          const hue = 15 + smoothValue * 10;
          gradient.addColorStop(0, `hsla(${hue}, 100%, 65%, 0.9)`);
          gradient.addColorStop(0.5, `hsla(${hue}, 100%, 55%, 0.8)`);
          gradient.addColorStop(1, `hsla(${hue}, 100%, 45%, 0.95)`);

          canvasContext.fillStyle = gradient;
          canvasContext.fillRect(x + gap / 2, y, barWidth - gap, barHeight);

          if (smoothValue > 0.1) {
            const glowGradient = canvasContext.createRadialGradient(
              x + barWidth / 2,
              y,
              0,
              x + barWidth / 2,
              y,
              barWidth * 2
            );
            glowGradient.addColorStop(0, `hsla(${hue}, 100%, 60%, 0.4)`);
            glowGradient.addColorStop(1, 'hsla(15, 100%, 60%, 0)');
            canvasContext.fillStyle = glowGradient;
            canvasContext.fillRect(x, y - 10, barWidth, 10);
          }
        }

        animationRef.current = requestAnimationFrame(draw);
      };

      draw();
    };

    void ensureContext();

    return () => {
      isMounted = false;
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };
  }, [active, audio]);

  useEffect(() => () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }

    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-20 w-full rounded-lg bg-base-900/60 shadow-inner"
      role="img"
      aria-label={ariaLabel}
    />
  );
}
