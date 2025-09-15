# Integrating the Media Session API for Web Radio

The Media Session API enables a web application to customize media notifications and interact with platform-level media controls, such as those on a device's lock screen, in the notification shade, or via hardware media keys [ref: 0-0, 0-4]. This allows users to control playback without having the web page in the foreground [ref: 0-0]. This guide details how to implement the API for a web radio application.

The API primarily uses two interfaces:
1.  **`MediaSession`**: Accessed via `navigator.mediaSession`, this interface is used to set action handlers and control the playback state [ref: 0-0, 0-2].
2.  **`MediaMetadata`**: This interface is used to provide the browser with information about the media currently playing, such as title, artist, and artwork [ref: 0-0].

## 1. Setting Media Metadata

To display information about the current track in the device's UI, you must provide media metadata. This is accomplished by assigning a new `MediaMetadata` object to `navigator.mediaSession.metadata` [ref: 0-2].

The `MediaMetadata` constructor accepts an object with properties for the track's details [ref: 0-0]. Key properties include:
*   `title`: The name of the track.
*   `artist`: The name of the artist.
*   `album`: The name of the album or collection (for a radio, this could be the station name).
*   `artwork`: An array of images for the track [ref: 0-1].

It is important to update the metadata whenever the media source changes to ensure the information displayed in the notification remains accurate [ref: 0-4].

**Example:**
```javascript
navigator.mediaSession.metadata = new MediaMetadata({
  title: "Unforgettable",
  artist: "Nat King Cole",
  album: "The Ultimate Collection (Remastered)",
  artwork: [
    // Artwork array details below
  ]
});
```
[ref: 0-1]

## 2. Artwork Format

The `artwork` property must be an array of objects, where each object defines an image source with its size and type [ref: 0-1]. Providing multiple sizes allows the user agent to select the most appropriate image for the specific device and display context (e.g., lock screen vs. notification) [ref: 0-4].

Each object in the `artwork` array should contain the following properties:
*   `src`: A URL to the image file.
*   `sizes`: A string representing the image dimensions (e.g., `'96x96'`, `'512x512'`).
*   `type`: The MIME type of the image (e.g., `'image/png'`, `'image/jpeg'`).

**Example `artwork` array:**
```javascript
artwork: [
  { src: 'path/to/icon-96x96.png', sizes: '96x96', type: 'image/png' },
  { src: 'path/to/icon-128x128.png', sizes: '128x128', type: 'image/png' },
  { src: 'path/to/icon-192x192.png', sizes: '192x192', type: 'image/png' },
  { src: 'path/to/icon-256x256.png', sizes: '256x256', type: 'image/png' },
  { src: 'path/to/icon-384x384.png', sizes: '384x384', type: 'image/png' },
  { src: 'path/to/icon-512x512.png', sizes: '512x512', type: 'image/png' },
]
```
[ref: 0-1]

## 3. Defining Action Handlers

Action handlers allow your application to respond when a user interacts with media controls [ref: 0-1]. You define them using the `navigator.mediaSession.setActionHandler()` method [ref: 0-1]. Setting a handler for a specific action signals to the browser that your application supports it, which will cause the corresponding control to appear in the UI [ref: 0-4].

### Syntax
The method takes two arguments: an action `type` and a `callback` function [ref: 0-1].
`navigator.mediaSession.setActionHandler(type, callback);`

The primary action types for a radio application are:
| Action Type | Description |
|---|---|
| `play` | Begins or resumes media playback [ref: 0-1]. |
| `pause` | Pauses media playback [ref: 0-1]. |
| `previoustrack` | Moves to the previous track in the playlist [ref: 0-1]. |
| `nexttrack` | Advances playback to the next track [ref: 0-1]. |
| `stop` | Halts playback entirely [ref: 0-1]. |

The `callback` is the function that will execute when the action is triggered [ref: 0-1]. Inside this function, you should control your `<audio>` or `<video>` element and update the session's playback state to keep the UI synchronized [ref: 0-4].

To remove an action handler, you can call `setActionHandler()` again for the same action, but with `null` as the callback [ref: 0-1]. It is also recommended to wrap `setActionHandler` calls in a `try...catch` block, as some actions may not be supported by all browsers [ref: 0-4].

## 4. Comprehensive Code Example for `app.js`

The following example demonstrates a complete implementation for a web radio application. It includes feature detection, setting metadata, and defining handlers for essential playback actions.

```javascript
// app.js for Radio Adamowo

// Assume you have an <audio> element in your HTML
// <audio id="player"></audio>
const audioPlayer = document.getElementById('player');

// A sample playlist of tracks for the radio
const playlist = [
  {
    title: "Morning Mood",
    artist: "Edvard Grieg",
    album: "Radio Adamowo",
    src: "path/to/track1.mp3",
    artwork: [
      { src: 'path/to/art1-96.png',   sizes: '96x96',   type: 'image/png' },
      { src: 'path/to/art1-512.png', sizes: '512x512', type: 'image/png' },
    ]
  },
  {
    title: "Clair de Lune",
    artist: "Claude Debussy",
    album: "Radio Adamowo",
    src: "path/to/track2.mp3",
    artwork: [
      { src: 'path/to/art2-96.png',   sizes: '96x96',   type: 'image/png' },
      { src: 'path/to/art2-512.png', sizes: '512x512', type: 'image/png' },
    ]
  }
];
let currentTrackIndex = 0;

// Function to update the media session with the current track's info
function updateMediaSession() {
  const track = playlist[currentTrackIndex];

  // Set the metadata for the notification and media UI
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: track.artist,
    album: track.album,
    artwork: track.artwork
  });
}

// Function to handle playing the next track
function playNextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  playCurrentTrack();
}

// Function to handle playing the previous track
function playPreviousTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  playCurrentTrack();
}

// Function to load and play the current track
function playCurrentTrack() {
    const track = playlist[currentTrackIndex];
    audioPlayer.src = track.src;
    updateMediaSession();
    audioPlayer.play().catch(e => console.error("Playback failed:", e));
}


// First, check if the Media Session API is available
if ('mediaSession' in navigator) {

  console.log("Media Session API is available.");

  // Load the first track without playing it, so metadata is ready
  audioPlayer.src = playlist[currentTrackIndex].src;
  updateMediaSession();

  // --- Define Action Handlers ---

  try {
    // Play Action Handler
    navigator.mediaSession.setActionHandler('play', async () => {
      console.log('User clicked play');
      await audioPlayer.play();
      // Sync the playback state for the OS UI
      navigator.mediaSession.playbackState = 'playing';
    });

    // Pause Action Handler
    navigator.mediaSession.setActionHandler('pause', () => {
      console.log('User clicked pause');
      audioPlayer.pause();
      // Sync the playback state for the OS UI
      navigator.mediaSession.playbackState = 'paused';
    });

    // Next Track Action Handler
    navigator.mediaSession.setActionHandler('nexttrack', () => {
      console.log('User clicked next track');
      playNextTrack();
    });

    // Previous Track Action Handler
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      console.log('User clicked previous track');
      playPreviousTrack();
    });

  } catch (error) {
    console.log(`The media session action is not supported: ${error}`);
  }

  // Listen for the 'ended' event on the audio element to automatically play the next track
  audioPlayer.addEventListener('ended', playNextTrack);
  
  // Update playback state when the audio element's state changes
  audioPlayer.addEventListener('play', () => {
    navigator.mediaSession.playbackState = 'playing';
  });
  
  audioPlayer.addEventListener('pause', () => {
    navigator.mediaSession.playbackState = 'paused';
  });

} else {
  console.log("Media Session API is not available in this browser.");
}
```