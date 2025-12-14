import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import MediaHub from '../MediaHub';
import { renderWithI18n } from '../../test/utils';
import { MemoryRouter } from 'react-router-dom';

describe('MediaHub page', () => {
  it('renders accessible audio and video players with download fallbacks', async () => {
    await renderWithI18n(
      <MemoryRouter>
        <MediaHub />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /media hub/i })).toBeInTheDocument();

    const audio = screen.getByLabelText(/ai lab podcast player/i) as HTMLAudioElement;
    expect(audio).toBeInTheDocument();
    expect(audio.controls).toBe(true);

    const video = screen.getByLabelText(/video player: violence loop intro/i) as HTMLVideoElement;
    expect(video).toBeInTheDocument();
    expect(video.controls).toBe(true);

    const downloadRegions = screen.getAllByLabelText(/download media file/i);
    expect(downloadRegions).toHaveLength(2);
    downloadRegions.forEach((region) => {
      expect(within(region).getByRole('link')).toBeInTheDocument();
    });
  });
});
