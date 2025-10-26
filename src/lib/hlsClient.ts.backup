import Hls from 'hls.js';

interface HlsClientOptions {
  onReady?: () => void;
  onError?: (message: string) => void;
  onReconnectAttempt?: (attempt: number, maxAttempts: number) => void;
  onReconnectSuccess?: () => void;
  maxRetries?: number;
}

export interface HlsClient {
  destroy: () => void;
  retry: () => void;
}

export const MAX_RECONNECT_ATTEMPTS = 5;

export function createHlsClient(
  audio: HTMLAudioElement,
  src: string,
  options: HlsClientOptions = {}
): HlsClient {
  const {
    onReady,
    onError,
    onReconnectAttempt,
    onReconnectSuccess,
    maxRetries = MAX_RECONNECT_ATTEMPTS
  } = options;

  const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
  let destroyed = false;
  let retries = 0;
  let retryTimeout: number | undefined;

  const clearRetryTimeout = (): void => {
    if (retryTimeout) {
      window.clearTimeout(retryTimeout);
      retryTimeout = undefined;
    }
  };

  const attach = (): void => {
    if (destroyed) {
      return;
    }

    if (audio.src) {
      audio.removeAttribute('src');
      audio.load();
    }

    hls.attachMedia(audio);
  };

  const scheduleRetry = (): void => {
    if (destroyed) {
      return;
    }

    if (retries >= maxRetries) {
      onError?.('Maximum reconnect attempts reached');
      return;
    }

    retries += 1;
    onReconnectAttempt?.(retries, maxRetries);

    const delay = Math.min(8000, 1000 * 2 ** (retries - 1));
    clearRetryTimeout();
    retryTimeout = window.setTimeout(() => {
      if (destroyed) {
        return;
      }

      hls.stopLoad();
      hls.detachMedia();
      attach();
    }, delay);
  };

  hls.on(Hls.Events.MEDIA_ATTACHED, () => {
    if (destroyed) {
      return;
    }

    hls.loadSource(src);
  });

  hls.on(Hls.Events.MANIFEST_PARSED, () => {
    if (destroyed) {
      return;
    }

    retries = 0;
    clearRetryTimeout();
    onReady?.();
  });

  hls.on(Hls.Events.LEVEL_LOADED, () => {
    if (destroyed) {
      return;
    }

    if (retries > 0) {
      retries = 0;
      onReconnectSuccess?.();
    }
  });

  hls.on(Hls.Events.ERROR, (_, data) => {
    if (destroyed) {
      return;
    }

    if (data.fatal) {
      switch (data.type) {
        case Hls.ErrorTypes.NETWORK_ERROR:
          scheduleRetry();
          break;
        case Hls.ErrorTypes.MEDIA_ERROR:
          hls.recoverMediaError();
          break;
        default:
          scheduleRetry();
          break;
      }
    } else if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
      scheduleRetry();
    }

    if (data.fatal && retries >= maxRetries) {
      const message = typeof data.error === 'string' ? data.error : data.details;
      onError?.(message ?? 'Unknown HLS error');
    }
  });

  attach();

  return {
    destroy: () => {
      destroyed = true;
      clearRetryTimeout();
      hls.destroy();
    },
    retry: () => {
      if (destroyed) {
        return;
      }

      retries = 0;
      onReconnectAttempt?.(1, maxRetries);
      clearRetryTimeout();
      hls.stopLoad();
      hls.detachMedia();
      attach();
    }
  };
}
