import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi, beforeEach, afterAll } from 'vitest';

import { VideoPlayer } from './VideoPlayer';
import type { PlayerLabels } from './VideoPlayer';

// VideoPlayer's toggle button branches on the real `paused` DOM property
// (not React state), so the play/pause mocks below must keep it in sync the
// same way a real browser would, or a second click re-enters the same
// branch instead of toggling.
let mediaPaused = true;

const playMock = vi.fn().mockImplementation(function (this: HTMLVideoElement) {
  mediaPaused = false;
  fireEvent(this, new Event('play'));
  return Promise.resolve();
});

const pauseMock = vi.fn().mockImplementation(function (this: HTMLVideoElement) {
  mediaPaused = true;
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
  noSource: 'No source',
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
  getChapterAriaLabel: (chapter, time) => `${chapter.title} (${time})`,
};

beforeEach(() => {
  vi.clearAllMocks();
  mediaPaused = true;
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    writable: true,
    value: playMock,
  });
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    writable: true,
    value: pauseMock,
  });
  Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
    configurable: true,
    get: () => mediaPaused,
  });
});

afterAll(() => {
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    writable: true,
    value: originalPlay,
  });
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    writable: true,
    value: originalPause,
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

    // The "no source" message renders twice by design: once in the
    // placeholder that replaces the <video> element, and once in the
    // persistent status line below the controls.
    const messages = screen.getAllByText('No source');
    expect(messages.length).toBe(2);
    messages.forEach((message) => expect(message).toBeInTheDocument());
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
  overrides: Partial<{
    hlsSrc?: string;
    mp4Src?: string;
    chapters: Array<{ id: string; title: string; time: number }>;
  }> = {}
) {
  // Destructuring defaults only skip a key that's undefined, which is
  // indistinguishable from "explicitly passed as undefined" — so a caller
  // trying to force the no-source state via { hlsSrc: undefined, mp4Src:
  // undefined } would silently get the defaults back. Checking `in` keeps an
  // explicit override honoured.
  const hlsSrc = 'hlsSrc' in overrides ? overrides.hlsSrc : 'https://example.com/doc.m3u8';
  const mp4Src = 'mp4Src' in overrides ? overrides.mp4Src : 'https://example.com/doc.mp4';
  const chapters = overrides.chapters ?? [];

  return render(
    <VideoPlayer
      title="Documentary"
      hlsSrc={hlsSrc}
      mp4Src={mp4Src}
      chapters={chapters}
      statusMessages={statusMessages}
      labels={labels}
    />
  );
}
