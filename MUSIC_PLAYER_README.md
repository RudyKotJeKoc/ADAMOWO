# Local Music Player

This document describes how the local music player works and how to add your own music files.

## Overview

The music player has been updated to play local audio files from the `/public/music` folder instead of using HLS streaming. This provides a simpler, more reliable audio playback experience.

## Architecture

### Components

1. **Local Audio Client** (`src/lib/localAudioClient.ts`)
   - Manages playlist loading and audio playback
   - Automatically advances to the next track when a track ends
   - Provides error handling and retry functionality

2. **Player State** (`src/state/player.ts`)
   - Zustand store for managing player state
   - Tracks current track, volume, muted state, etc.

3. **Hero Player Component** (`src/components/HeroPlayer.tsx`)
   - Main UI component for the music player
   - Displays current track information and playback controls

## Adding Music Files

### Step 1: Add Audio Files

Place your audio files (MP3, WAV, OGG) in the `/public/music` folder:

```bash
public/music/
  ├── song1.mp3
  ├── song2.mp3
  └── song3.mp3
```

### Step 2: Update Playlist

Edit `/public/music/playlist.json` to include your tracks:

```json
[
  {
    "id": "track-001",
    "title": "Song Title",
    "artist": "Artist Name",
    "url": "/music/song1.mp3",
    "coverUrl": "/images/cover.jpg",
    "duration": 0
  },
  {
    "id": "track-002",
    "title": "Another Song",
    "artist": "Another Artist",
    "url": "/music/song2.mp3",
    "coverUrl": "/images/cover2.jpg",
    "duration": 0
  }
]
```

### Playlist Format

Each track object should have:

- `id` (required): Unique identifier for the track
- `title` (required): Track title
- `artist` (required): Artist name
- `url` (required): Path to the audio file (relative to public folder)
- `coverUrl` (optional): Path to cover art image
- `duration` (optional): Track duration in seconds (0 for auto-detect)

## Features

- **Automatic Playlist Playback**: Tracks play sequentially from the playlist
- **Error Handling**: Graceful error messages for loading failures
- **Retry Functionality**: Ability to retry loading failed tracks
- **Volume Control**: Adjustable volume with mute/unmute
- **Keyboard Shortcuts**:
  - Space: Play/Pause
  - M: Mute/Unmute
  - Arrow Up: Volume +10%
  - Arrow Down: Volume -10%

## Supported Audio Formats

The player supports all audio formats that are natively supported by modern browsers:

- MP3 (recommended for best compatibility)
- WAV
- OGG
- M4A
- AAC

**Note**: MP3 is recommended as it has the widest browser support.

## Configuration

The default playlist URL is `/music/playlist.json`. You can change this by setting the `VITE_PLAYLIST_URL` environment variable in your `.env` file:

```
VITE_PLAYLIST_URL=/custom/path/to/playlist.json
```

## Development

To test the music player in development:

```bash
npm run dev
```

The Vite development server will serve files from the `public` folder, making your music files accessible at `/music/`.

## Build

To build for production:

```bash
npm run build
```

The build process will copy all files from `public/music` to `dist/music`.

## Notes

- **HLS for Video**: While HLS has been removed for audio playback, it's still used for video playback in the documentary section. The `hls.js` package is kept in dependencies for this purpose.
- **File Size**: Be mindful of audio file sizes. Large files will increase build size and loading times.
- **Cross-Origin**: The audio player is configured with `crossOrigin="anonymous"` for compatibility with external resources if needed.

## Troubleshooting

### Audio Won't Play

1. Check that the audio file exists in `/public/music`
2. Verify the path in `playlist.json` is correct
3. Check browser console for error messages
4. Ensure the audio format is supported by your browser

### Playlist Not Loading

1. Verify `/public/music/playlist.json` exists and is valid JSON
2. Check the playlist URL in player state
3. Look for network errors in browser DevTools

### Track Skipping

If tracks skip or don't play:

1. Check that the audio file isn't corrupted
2. Verify the file format is supported
3. Try converting the file to MP3
