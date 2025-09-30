import { screen } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { DocumentarySection } from './DocumentarySection';
import { renderWithI18n } from '../../test/utils';

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

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('DocumentarySection', () => {
  test('renders documentary player with resources when HLS is configured', async () => {
    vi.stubEnv('VITE_DOC_VIDEO_HLS', 'https://example.com/doc.m3u8');
    vi.stubEnv('VITE_DOC_VIDEO_MP4', 'https://example.com/doc.mp4');
    vi.stubEnv('VITE_DOC_SUBTITLES_VTT', '/subs/pl.vtt');

    await renderWithI18n(<DocumentarySection />);

    expect(
      screen.getByRole('heading', { name: 'The Adamowo Case: Autopsy of a Family War' })
    ).toBeInTheDocument();
    expect(screen.getByText('Loading documentary…')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Case timeline/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Disable subtitles' })).toBeInTheDocument();
  });

  test('renders fallback MP4 without configuration warning', async () => {
    vi.stubEnv('VITE_DOC_VIDEO_MP4', 'https://example.com/doc.mp4');

    await renderWithI18n(<DocumentarySection />);

    expect(
      screen.queryByText(
        'Configure environment variables VITE_DOC_VIDEO_HLS or VITE_DOC_VIDEO_MP4 to publish the stream.'
      )
    ).not.toBeInTheDocument();
  });

  test('shows configuration hint when no sources are provided', async () => {
    await renderWithI18n(<DocumentarySection />);

    expect(
      screen.getByText(
        'Configure environment variables VITE_DOC_VIDEO_HLS or VITE_DOC_VIDEO_MP4 to publish the stream.'
      )
    ).toBeInTheDocument();
  });
});
