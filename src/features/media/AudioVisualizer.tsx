/**
 * AudioVisualizer Component
 *
 * Advanced audio visualization with multiple modes:
 * - 2D Canvas: bars, wave, circular
 * - 3D Three.js: bars, wave, particles (requires three.js)
 *
 * Features:
 * - Real-time FFT audio analysis
 * - Smooth animations with requestAnimationFrame
 * - Responsive canvas sizing
 * - Theme-aware colors
 * - Performance optimized
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { useVisualizerStore } from '../../state/media';
import type { AudioAnalysisData, VisualizerMode } from './media.schema';

interface AudioVisualizerProps {
  analysisData?: AudioAnalysisData;
  className?: string;
  width?: number;
  height?: number;
}

export function AudioVisualizer({
  analysisData,
  className = '',
  width,
  height,
}: AudioVisualizerProps): JSX.Element {
  const { config, isActive } = useVisualizerStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: width || 800, height: height || 300 });

  // ============================================================================
  // RESPONSIVE SIZING
  // ============================================================================

  useEffect(() => {
    if (!config.responsive) return;

    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: width || rect.width || 800,
          height: height || rect.height || 300,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [config.responsive, width, height]);

  // ============================================================================
  // 2D VISUALIZER: BARS
  // ============================================================================

  const draw2DBars = useCallback(
    (ctx: CanvasRenderingContext2D, data: Uint8Array) => {
      const { width, height } = ctx.canvas;
      const { colorScheme } = config;

      ctx.clearRect(0, 0, width, height);

      const barCount = data.length;
      const barWidth = width / barCount;
      const barGap = barWidth * 0.1;

      for (let i = 0; i < barCount; i++) {
        const value = data[i];
        const barHeight = (value / 255) * height;
        const x = i * barWidth;
        const y = height - barHeight;

        // Create gradient
        const gradient = ctx.createLinearGradient(x, y, x, height);
        if (colorScheme.gradient && colorScheme.gradient.length > 0) {
          colorScheme.gradient.forEach((color, index) => {
            gradient.addColorStop(index / (colorScheme.gradient!.length - 1), color);
          });
        } else {
          gradient.addColorStop(0, colorScheme.primary);
          gradient.addColorStop(1, colorScheme.secondary);
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(x + barGap / 2, y, barWidth - barGap, barHeight);
      }
    },
    [config]
  );

  // ============================================================================
  // 2D VISUALIZER: WAVE
  // ============================================================================

  const draw2DWave = useCallback(
    (ctx: CanvasRenderingContext2D, data: Uint8Array) => {
      const { width, height } = ctx.canvas;
      const { colorScheme } = config;

      ctx.clearRect(0, 0, width, height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = colorScheme.primary;
      ctx.beginPath();

      const sliceWidth = width / data.length;
      let x = 0;

      for (let i = 0; i < data.length; i++) {
        const value = data[i] / 255;
        const y = value * height;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Fill area under wave
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, colorScheme.primary + '80'); // 50% opacity
      gradient.addColorStop(1, colorScheme.background + '00'); // 0% opacity

      ctx.fillStyle = gradient;
      ctx.fill();
    },
    [config]
  );

  // ============================================================================
  // 2D VISUALIZER: CIRCULAR
  // ============================================================================

  const draw2DCircular = useCallback(
    (ctx: CanvasRenderingContext2D, data: Uint8Array) => {
      const { width, height } = ctx.canvas;
      const { colorScheme } = config;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.3;
      const barCount = data.length;

      ctx.save();
      ctx.translate(centerX, centerY);

      for (let i = 0; i < barCount; i++) {
        const value = data[i];
        const barHeight = (value / 255) * radius;
        const angle = (Math.PI * 2 * i) / barCount;

        ctx.save();
        ctx.rotate(angle);

        // Create gradient from center
        const gradient = ctx.createLinearGradient(0, radius, 0, radius + barHeight);
        gradient.addColorStop(0, colorScheme.secondary);
        gradient.addColorStop(1, colorScheme.primary);

        ctx.fillStyle = gradient;
        ctx.fillRect(-2, radius, 4, barHeight);

        ctx.restore();
      }

      ctx.restore();

      // Draw center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = colorScheme.background;
      ctx.fill();
      ctx.strokeStyle = colorScheme.accent;
      ctx.lineWidth = 2;
      ctx.stroke();
    },
    [config]
  );

  // ============================================================================
  // 3D VISUALIZER PLACEHOLDER (requires three.js)
  // ============================================================================

  const draw3DPlaceholder = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const { width, height } = ctx.canvas;
      const { colorScheme } = config;

      ctx.clearRect(0, 0, width, height);

      // Display message about 3D mode
      ctx.fillStyle = colorScheme.primary;
      ctx.font = '16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('3D Visualizer requires Three.js', width / 2, height / 2 - 20);
      ctx.fillText('Install: pnpm add three @types/three', width / 2, height / 2 + 20);

      // Draw decorative elements
      ctx.strokeStyle = colorScheme.accent;
      ctx.lineWidth = 2;
      ctx.strokeRect(width * 0.1, height * 0.1, width * 0.8, height * 0.8);
    },
    [config]
  );

  // ============================================================================
  // MAIN RENDER LOOP
  // ============================================================================

  const renderVisualizer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive || !analysisData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { mode } = config;
    const { frequencyData, timeDomainData } = analysisData;

    try {
      switch (mode) {
        case '2d-bars':
          draw2DBars(ctx, frequencyData);
          break;
        case '2d-wave':
          draw2DWave(ctx, timeDomainData);
          break;
        case '2d-circular':
          draw2DCircular(ctx, frequencyData);
          break;
        case '3d-bars':
        case '3d-wave':
        case '3d-particles':
          draw3DPlaceholder(ctx);
          break;
        default:
          draw2DBars(ctx, frequencyData);
      }
    } catch (error) {
      console.error('Visualizer render error:', error);
    }

    animationFrameRef.current = requestAnimationFrame(renderVisualizer);
  }, [isActive, analysisData, config, draw2DBars, draw2DWave, draw2DCircular, draw3DPlaceholder]);

  // ============================================================================
  // LIFECYCLE
  // ============================================================================

  useEffect(() => {
    if (isActive && analysisData) {
      animationFrameRef.current = requestAnimationFrame(renderVisualizer);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, analysisData, renderVisualizer]);

  // Update canvas dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
    }
  }, [dimensions]);

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!isActive) {
    return (
      <div
        ref={containerRef}
        className={`flex items-center justify-center bg-base-900/50 rounded-lg ${className}`}
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <p className="text-base-400 text-sm">Visualizer disabled</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full rounded-lg bg-base-900/50"
        aria-label="Audio visualizer"
      />
      {!analysisData && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-base-400 text-sm">Waiting for audio data...</p>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// VISUALIZER MODE SWITCHER
// ============================================================================

interface VisualizerModeSwitcherProps {
  className?: string;
}

export function VisualizerModeSwitcher({ className = '' }: VisualizerModeSwitcherProps): JSX.Element {
  const { config, setMode, setActive, isActive } = useVisualizerStore();

  const modes: Array<{ value: VisualizerMode; label: string; available: boolean }> = [
    { value: '2d-bars', label: 'Bars', available: true },
    { value: '2d-wave', label: 'Wave', available: true },
    { value: '2d-circular', label: 'Circular', available: true },
    { value: '3d-bars', label: '3D Bars', available: false },
    { value: '3d-wave', label: '3D Wave', available: false },
    { value: '3d-particles', label: '3D Particles', available: false },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={() => setActive(!isActive)}
        className="px-3 py-2 bg-base-800 hover:bg-base-700 text-accent-400 rounded-lg transition-colors text-sm font-medium"
        aria-label={isActive ? 'Disable visualizer' : 'Enable visualizer'}
      >
        {isActive ? 'Hide' : 'Show'} Visualizer
      </button>

      {isActive && (
        <select
          value={config.mode}
          onChange={(e) => setMode(e.target.value as VisualizerMode)}
          className="px-3 py-2 bg-base-800 hover:bg-base-700 text-base-100 rounded-lg transition-colors text-sm cursor-pointer"
          aria-label="Select visualizer mode"
        >
          {modes.map((mode) => (
            <option key={mode.value} value={mode.value} disabled={!mode.available}>
              {mode.label} {!mode.available && '(requires Three.js)'}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export default AudioVisualizer;
