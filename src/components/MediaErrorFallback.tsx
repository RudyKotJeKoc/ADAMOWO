/**
 * MediaErrorFallback - Enhanced error messages and fallbacks for audio/video players
 *
 * Provides helpful error messages, troubleshooting tips, and alternative
 * content formats when media fails to load.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import './MediaErrorFallback.css';

export interface MediaErrorFallbackProps {
  /** Type of media that failed */
  mediaType: 'audio' | 'video';

  /** Error message or code */
  error?: string | Error | MediaError | null;

  /** URL of the media that failed */
  mediaUrl?: string;

  /** Alternative formats available */
  alternativeFormats?: Array<{
    format: string;
    url: string;
    label?: string;
  }>;

  /** Transcript available */
  transcript?: string;

  /** Transcript URL */
  transcriptUrl?: string;

  /** Show troubleshooting tips */
  showTroubleshooting?: boolean;

  /** Retry handler */
  onRetry?: () => void;

  /** Custom CSS class */
  className?: string;
}

export function MediaErrorFallback({
  mediaType,
  error,
  mediaUrl,
  alternativeFormats = [],
  transcript,
  transcriptUrl,
  showTroubleshooting = true,
  onRetry,
  className = '',
}: MediaErrorFallbackProps) {
  const { t } = useTranslation();

  const errorMessage = getErrorMessage(error, mediaType, t);
  const errorCode = getErrorCode(error);

  return (
    <div
      className={`media-error-fallback media-error-fallback--${mediaType} ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="media-error-fallback__header">
        <span className="media-error-fallback__icon" aria-hidden="true">
          {mediaType === 'audio' ? '🔇' : '📹'}
        </span>
        <h3 className="media-error-fallback__title">
          {t(
            `media.error.${mediaType}.title`,
            mediaType === 'audio'
              ? 'Nie udało się załadować audio'
              : 'Nie udało się załadować wideo'
          )}
        </h3>
      </div>

      <div className="media-error-fallback__content">
        <p className="media-error-fallback__message">{errorMessage}</p>

        {errorCode && (
          <p className="media-error-fallback__code">
            <strong>{t('media.error.code', 'Kod błędu:')}</strong> {errorCode}
          </p>
        )}

        {/* Retry button */}
        {onRetry && (
          <button className="media-error-fallback__retry-btn" onClick={onRetry} type="button">
            🔄 {t('media.error.retry', 'Spróbuj ponownie')}
          </button>
        )}

        {/* Alternative formats */}
        {alternativeFormats.length > 0 && (
          <div className="media-error-fallback__alternatives">
            <h4 className="media-error-fallback__subtitle">
              {t('media.error.alternatives', 'Alternatywne formaty:')}
            </h4>
            <ul className="media-error-fallback__alt-list">
              {alternativeFormats.map((alt, index) => (
                <li key={index}>
                  <a
                    href={alt.url}
                    className="media-error-fallback__alt-link"
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📥 {alt.label || `${alt.format.toUpperCase()}`}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Transcript */}
        {(transcript || transcriptUrl) && (
          <div className="media-error-fallback__transcript">
            <h4 className="media-error-fallback__subtitle">
              {t('media.error.transcript', 'Transkrypcja:')}
            </h4>
            {transcript && (
              <div className="media-error-fallback__transcript-content">
                <pre>{transcript}</pre>
              </div>
            )}
            {transcriptUrl && (
              <a
                href={transcriptUrl}
                className="media-error-fallback__transcript-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                📄 {t('media.error.transcript.download', 'Pobierz transkrypcję')}
              </a>
            )}
          </div>
        )}

        {/* Troubleshooting tips */}
        {showTroubleshooting && (
          <details className="media-error-fallback__troubleshooting">
            <summary className="media-error-fallback__troubleshooting-summary">
              {t('media.error.troubleshooting', 'Rozwiązywanie problemów')}
            </summary>
            <ul className="media-error-fallback__tips">
              <li>{t('media.error.tip.refresh', 'Odśwież stronę i spróbuj ponownie')}</li>
              <li>{t('media.error.tip.connection', 'Sprawdź swoje połączenie internetowe')}</li>
              <li>
                {t(
                  'media.error.tip.browser',
                  'Upewnij się, że Twoja przeglądarka jest zaktualizowana'
                )}
              </li>
              <li>
                {t(
                  'media.error.tip.formats',
                  'Niektóre przeglądarki nie obsługują wszystkich formatów — spróbuj alternatywnego formatu powyżej'
                )}
              </li>
              <li>
                {t(
                  'media.error.tip.extensions',
                  'Wyłącz blokery reklam lub rozszerzenia, które mogą blokować multimedia'
                )}
              </li>
              <li>
                {t(
                  'media.error.tip.browser.switch',
                  'Spróbuj innej przeglądarki (Chrome, Firefox, Safari, Edge)'
                )}
              </li>
            </ul>
          </details>
        )}

        {/* Direct media URL for advanced users */}
        {mediaUrl && (
          <details className="media-error-fallback__advanced">
            <summary className="media-error-fallback__advanced-summary">
              {t('media.error.advanced', 'Dla zaawansowanych')}
            </summary>
            <div className="media-error-fallback__url-container">
              <p className="media-error-fallback__url-label">
                {t('media.error.direct.url', 'Bezpośredni link do pliku:')}
              </p>
              <code className="media-error-fallback__url">
                <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
                  {mediaUrl}
                </a>
              </code>
              <button
                className="media-error-fallback__copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(mediaUrl);
                }}
                type="button"
              >
                📋 {t('media.error.copy', 'Kopiuj')}
              </button>
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

// Helper functions

function getErrorMessage(
  error: string | Error | MediaError | null | undefined,
  mediaType: string,
  t: (key: string, defaultValue: string) => string
): string {
  if (!error) {
    return t(
      `media.error.${mediaType}.generic`,
      `Wystąpił problem z załadowaniem ${mediaType === 'audio' ? 'audio' : 'wideo'}. Spróbuj ponownie później.`
    );
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  // MediaError object
  if ('code' in error) {
    switch (error.code) {
      case 1: // MEDIA_ERR_ABORTED
        return t('media.error.aborted', 'Pobieranie zostało przerwane przez użytkownika.');
      case 2: // MEDIA_ERR_NETWORK
        return t('media.error.network', 'Błąd sieci podczas pobierania pliku multimedialnego.');
      case 3: // MEDIA_ERR_DECODE
        return t(
          'media.error.decode',
          'Plik multimedialny jest uszkodzony lub w nieobsługiwanym formacie.'
        );
      case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
        return t(
          'media.error.unsupported',
          'Format pliku nie jest obsługiwany przez Twoją przeglądarkę.'
        );
      default:
        return t('media.error.unknown', 'Nieznany błąd odtwarzania.');
    }
  }

  return t('media.error.generic', 'Wystąpił nieoczekiwany błąd.');
}

function getErrorCode(error: string | Error | MediaError | null | undefined): string | null {
  if (!error) return null;

  if (typeof error === 'string') return null;

  if (error instanceof Error && 'code' in error) {
    return String((error as Error & { code: number | string }).code);
  }

  if ('code' in error) {
    return `MEDIA_ERR_${error.code}`;
  }

  return null;
}

/**
 * Simplified version for inline use
 */
export function SimpleMediaError({
  mediaType,
  onRetry,
}: {
  mediaType: 'audio' | 'video';
  onRetry?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="simple-media-error">
      <span className="simple-media-error__icon">{mediaType === 'audio' ? '🔇' : '📹'}</span>
      <p className="simple-media-error__message">
        {t(
          `media.error.${mediaType}.simple`,
          `Nie można załadować ${mediaType === 'audio' ? 'audio' : 'wideo'}`
        )}
      </p>
      {onRetry && (
        <button className="simple-media-error__retry" onClick={onRetry} type="button">
          {t('media.error.retry', 'Spróbuj ponownie')}
        </button>
      )}
    </div>
  );
}
