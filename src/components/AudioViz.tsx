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
          analyser.fftSize = 64;
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

      const draw = (): void => {
        if (!isMounted) {
          return;
        }

        analyser.getByteFrequencyData(dataArray);

        const { width, height } = canvas;
        canvasContext.clearRect(0, 0, width, height);

        const barWidth = width / bufferLength;
        for (let i = 0; i < bufferLength; i += 1) {
          const value = dataArray[i] / 255;
          const barHeight = value * height;
          const x = i * barWidth;
          canvasContext.fillStyle = '#ff6b35';
          canvasContext.fillRect(x, height - barHeight, barWidth * 0.7, barHeight);
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
      className="h-20 w-full rounded-lg bg-base-900/60"
      role="img"
      aria-label={ariaLabel}
    />
  );
}
