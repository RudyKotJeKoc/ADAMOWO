# Implementing HLS Streaming with Hls.js and Native Fallback

This guide details how to implement HTTP Live Streaming (HLS) in a vanilla JavaScript application using the `hls.js` library. It covers feature detection, initialization of `hls.js`, and the fallback procedure for browsers with native HLS support, such as Safari.

HLS.js is a JavaScript library that enables HLS playback in browsers that support Media Source Extensions (MSE) [ref: 0-1]. It functions by reading HLS manifest files (with an `.m3u8` extension) and transmuxing MPEG-2 Transport Stream and AAC/MP3 streams into ISO BMFF (MP4) fragments, which are then fed into a standard HTML5 `<video>` or `<audio>` element [ref: 0-1, ref: 0-3].

### 1. Integrating Hls.js into a JavaScript Application

To play an `.m3u8` stream, you must integrate the `hls.js` library and use its API to manage the stream.

**Steps for Integration:**
1.  **Include the Library:** Add the `hls.js` script to your HTML file.
    ```html
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    ```
2.  **Instantiate Hls.js:** Create a new `Hls` object in your JavaScript file [ref: 0-2].
3.  **Load the Source:** Use the `loadSource()` method to pass your `.m3u8` stream URL to the Hls.js instance [ref: 0-2].
4.  **Attach to Media Element:** Link the Hls.js instance to your HTML `<audio>` element using the `attachMedia()` method [ref: 0-2].
5.  **Start Playback:** You can optionally listen for the `MANIFEST_PARSED` event to begin playback automatically once the stream manifest is successfully loaded [ref: 0-2].

### 2. Feature Detection with `Hls.isSupported()`

Before initializing Hls.js, it is crucial to check if the user's browser supports the necessary technologies. Hls.js relies on Media Source Extensions (MSE) to function [ref: 0-2].

The `Hls.isSupported()` static method is the correct way to perform this check [ref: 0-0]. It returns `true` if MSE is available, indicating that Hls.js can be used.

```javascript
if (Hls.isSupported()) {
  // Browser supports Hls.js
  // Proceed with Hls.js initialization
} else {
  // Hls.js is not supported
  // Implement a fallback
}
```

### 3. Fallback to Native HLS Playback

Some browsers, most notably Safari on macOS and iOS, provide native support for HLS streaming and do not require a JavaScript library like Hls.js [ref: 0-4]. For these browsers, `Hls.isSupported()` will return `false`.

The standard fallback procedure is to detect native HLS capability and set the media element's `src` attribute directly to the `.m3u8` URL [ref: 0-4].

You can detect native support by checking the return value of the `canPlayType()` method on the media element [ref: 0-0].

| Browser | Native HLS Playback Support |
|---|---|
| Safari (macOS/iOS) | Supported |
| Chrome (desktop) | Not Supported |
| Firefox | Not Supported |
| Edge | Not Supported |
| Android Chrome | Device-dependent |

*Table data sourced from [ref: 0-4]*

The check for native support can be implemented as follows:
```javascript
const audio = document.getElementById('audio-player');
if (audio.canPlayType('application/vnd.apple.mpegurl')) {
  // Browser has native HLS support
  audio.src = 'https://your-stream-url.m3u8';
}
```

### 4. Complete Code Example for "Radio Adamowo"

The following complete example demonstrates the conditional logic required for a robust HLS implementation. It first checks for Hls.js compatibility and initializes it if supported. If not, it falls back to checking for native HLS support. This code is designed for an HTML `<audio>` element as specified.

**HTML (`index.html`)**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Radio Adamowo HLS Player</title>
</head>
<body>
    <h1>Radio Adamowo</h1>
    <audio id="radio-player" controls></audio>

    <!-- Include Hls.js library -->
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <!-- Include your application script -->
    <script src="app.js"></script>
</body>
</html>
```

**JavaScript (`app.js`)**
```javascript
document.addEventListener('DOMContentLoaded', function () {
  const streamUrl = 'https://your-radio-stream.m3u8'; // Replace with your HLS stream URL
  const audio = document.getElementById('radio-player');

  // Check if Hls.js is supported by the browser
  if (Hls.isSupported()) {
    console.log("Hls.js is supported. Initializing HLS player.");
    const hls = new Hls();
    // Load the HLS stream source
    hls.loadSource(streamUrl);
    // Attach Hls.js to the audio element
    hls.attachMedia(audio);
    // When the manifest is parsed, start playback
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      console.log("Manifest parsed. Playing audio.");
      audio.play();
    });
    // Optional: Add error handling
    hls.on(Hls.Events.ERROR, function (event, data) {
      if (data.fatal) {
        console.error('Fatal HLS error:', data.type);
        // Attempt to recover from media errors
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          // Destroy Hls.js on other fatal errors
          hls.destroy();
        }
      }
    });
  } 
  // Fallback for browsers with native HLS support (e.g., Safari)
  else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
    console.log("Hls.js not supported, but native HLS playback is available.");
    // Set the audio source directly to the HLS stream URL
    audio.src = streamUrl;
    audio.addEventListener('loadedmetadata', function() {
      console.log("Metadata loaded. Playing audio via native HLS.");
      audio.play();
    });
  } 
  // Handle cases where HLS is not supported at all
  else {
    console.error("Sorry, your browser does not support HLS streaming.");
    // Optionally, display a message to the user
    const message = document.createElement('p');
    message.innerText = "Your browser does not support live streaming.";
    audio.parentElement.insertBefore(message, audio.nextSibling);
  }
});
```
*This code structure combines information and patterns from multiple sources [ref: 0-0, ref: 0-2, ref: 0-4].*