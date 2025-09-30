import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi, beforeEach, afterAll } from 'vitest';

import { VideoPlayer } from './VideoPlayer';
import type { PlayerLabels } from './VideoPlayer';

const playMock = vi.fn().mockImplementation(function (this: HTMLVideoElement) {
  fireEvent(this, new Event('play'));
  return Promise.resolve();
});

const pauseMock = vi.fn().mockImplementation(function (this: HTMLVideoElement) {
  fireEvent(this, new Event('pause'));
});

const originalPlay = HTMLMediaElement.prototype.play;
const originalPause = HTMLMediaElement.prototype.pause;

vi.mock('hls.js', () => {
  class MockHls {
    static Events = { MEDIA_ATTACHED: 'MEDIA_ATTACHED', ERROR: 'ERROR' } as const;

    static isSupported(): boolean {
      return true;
    }

    attachMedia(): void {}

    loadSource(): void {}

    on(event: string, handler: () => void): void {
      if (event === MockHls.Events.MEDIA_ATTACHED) {
        handler();
      }
    }

    destroy(): void {}
  }

  return { default: MockHls };
});

const statusMessages = {
  loading: 'Loading',
  error: 'Error',
  noSource: 'No source'
};

const labels: PlayerLabels = {
  controlsGroup: 'Video controls',
  play: 'Play video',
  pause: 'Pause video',
  mute: 'Mute',
  unmute: 'Unmute',
  subtitlesOn: 'Enable subtitles',
  subtitlesOff: 'Disable subtitles',
  subtitlesUnavailable: 'Subtitles unavailable',
  enterFullscreen: 'Enter fullscreen',
  exitFullscreen: 'Exit fullscreen',
  progress: 'Seek video',
  volume: 'Adjust volume',
  volumeIndicator: (value) => `Volume ${Math.round(value * 100)}%`,
  chapterHeading: 'Chapters',
  chapterCurrent: 'Current chapter',
  getChapterAriaLabel: (chapter, time) => `${chapter.title} (${time})`
};

beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    writable: true,
    value: playMock
  });
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    writable: true,
    value: pauseMock
  });
});

afterAll(() => {
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    writable: true,
    value: originalPlay
  });
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    writable: true,
    value: originalPause
  });
});

describe('VideoPlayer', () => {
  test('toggles playback on button click', async () => {
    const user = userEvent.setup();

    renderPlayer();

    const playButton = screen.getByRole('button', { name: /play video/i });
    await user.click(playButton);
    expect(playMock).toHaveBeenCalledTimes(1);

    const pauseButton = screen.getByRole('button', { name: /pause video/i });
    await user.click(pauseButton);
    expect(pauseMock).toHaveBeenCalledTimes(1);
  });

  test('shows message when no source is provided', () => {
    renderPlayer({ hlsSrc: undefined, mp4Src: undefined });

    expect(screen.getByText('No source')).toBeInTheDocument();
  });

  test('seeks to chapter time when selected', async () => {
    const user = userEvent.setup();

    renderPlayer({ chapters: [{ id: 'intro', title: 'Intro', time: 120 }] });

    const video = screen.getByTestId('documentary-video') as HTMLVideoElement;
    fireEvent(video, new Event('loadedmetadata'));
    fireEvent(video, new Event('canplay'));

    const chapterButton = screen.getByRole('button', { name: /intro \(2:00\)/i });
    await user.click(chapterButton);

    expect(video.currentTime).toBe(120);
  });
});

function renderPlayer(
  overrides: Partial<{ hlsSrc?: string; mp4Src?: string; chapters: Array<{ id: string; title: string; time: number }> }> = {}
) {
  const { hlsSrc = 'https://example.com/doc.m3u8', mp4Src = 'https://example.com/doc.mp4', chapters = [] } = overrides;

  return render(<VideoPlayer title="Documentary" hlsSrc={hlsSrc} mp4Src={mp4Src} chapters={chapters} statusMessages={statusMessages} labels={labels} />);
}
