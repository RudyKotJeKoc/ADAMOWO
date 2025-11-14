import { MusicPlayer } from '../features/music/MusicPlayer';

/**
 * Lab page component featuring the music player.
 *
 * Displays the interactive music player interface for the ADAMOWO project.
 * This page serves as a dedicated space for audio experimentation and playback
 * of project-related content.
 *
 * @component
 * @returns {JSX.Element} The lab page with music player
 */
export default function Lab(): JSX.Element {
  return (
    <section>
      <MusicPlayer />
    </section>
  );
}
