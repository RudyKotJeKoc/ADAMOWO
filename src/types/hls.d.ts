declare module 'hls.js' {
  export default class Hls {
    static Events: {
      MEDIA_ATTACHED: string;
      MANIFEST_PARSED: string;
      LEVEL_LOADED: string;
      ERROR: string;
    };
    static ErrorTypes: {
      NETWORK_ERROR: string;
      MEDIA_ERROR: string;
      OTHER_ERROR: string;
    };
    static isSupported(): boolean;
    constructor(config?: unknown);
    attachMedia(media: HTMLMediaElement): void;
    loadSource(source: string): void;
    on(event: string, handler: (event: string, data: any) => void): void;
    stopLoad(): void;
    detachMedia(): void;
    recoverMediaError(): void;
    destroy(): void;
  }
}
