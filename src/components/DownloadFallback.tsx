import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

export interface DownloadFallbackProps {
  /**
   * URL of the media file to download
   */
  downloadUrl: string;
  /**
   * Title/name of the media file
   */
  title: string;
  /**
   * Type of media
   */
  mediaType?: 'audio' | 'video';
  /**
   * File size (optional, for display)
   */
  fileSize?: string;
  /**
   * Format (e.g., "MP3", "MP4")
   */
  format?: string;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Variant style
   */
  variant?: 'default' | 'compact' | 'prominent';
}

/**
 * DownloadFallback component for users who cannot stream media
 * Provides a direct download link as fallback
 */
export function DownloadFallback({
  downloadUrl,
  title,
  mediaType = 'audio',
  fileSize,
  format,
  className = '',
  variant = 'default',
}: DownloadFallbackProps): JSX.Element {
  const { t } = useTranslation();

  const isCompact = variant === 'compact';
  const isProminent = variant === 'prominent';

  return (
    <div
      className={clsx(
        'rounded-xl border shadow-lg',
        isProminent
          ? 'border-accent-700/50 bg-gradient-to-br from-accent-950/30 to-accent-900/20 p-6'
          : isCompact
            ? 'border-base-700/50 bg-base-900/30 p-4'
            : 'border-base-800/50 bg-base-900/50 p-5',
        className
      )}
      role="region"
      aria-label={t('media.download.region', 'Pobierz plik multimedialny')}
    >
      <div className={clsx('flex items-start gap-4', isCompact && 'gap-3')}>
        <div
          className={clsx(
            'flex flex-shrink-0 items-center justify-center rounded-full',
            isProminent
              ? 'h-12 w-12 bg-accent-500/20 text-accent-300'
              : isCompact
                ? 'h-8 w-8 bg-base-700/50 text-base-300'
                : 'h-10 w-10 bg-base-700/50 text-base-300'
          )}
          aria-hidden="true"
        >
          {mediaType === 'video' ? (
            <svg
              className={isCompact ? 'h-4 w-4' : 'h-6 w-6'}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          ) : (
            <svg
              className={isCompact ? 'h-4 w-4' : 'h-6 w-6'}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h3
            className={clsx(
              'font-semibold',
              isProminent
                ? 'text-lg text-accent-200'
                : isCompact
                  ? 'text-sm text-base-200'
                  : 'text-base text-base-200'
            )}
          >
            {isProminent
              ? t('media.download.titleProminent', 'Problemy z odtwarzaniem?')
              : t('media.download.title', 'Pobierz plik')}
          </h3>
          <p
            className={clsx('mt-1', isCompact ? 'text-xs text-base-300' : 'text-sm text-base-300')}
          >
            {isProminent
              ? t(
                  'media.download.descriptionProminent',
                  'Jeśli masz problemy z odtwarzaniem, możesz pobrać plik i odtworzyć go lokalnie.'
                )
              : t(
                  'media.download.description',
                  'Jeśli nie możesz odtworzyć pliku w przeglądarce, pobierz go.'
                )}
          </p>
        </div>
      </div>

      <div className={clsx('mt-4 flex flex-wrap items-center gap-3', isCompact && 'mt-3')}>
        <a
          href={downloadUrl}
          download={title}
          className={clsx(
            'inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold shadow-lg transition',
            isProminent
              ? 'bg-accent-600 text-white hover:bg-accent-500 hover:scale-105'
              : 'bg-base-700 text-base-100 hover:bg-base-600 hover:scale-105',
            isCompact ? 'text-xs' : 'text-sm',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950'
          )}
          aria-label={t('media.download.ariaLabel', 'Pobierz {{title}}', { title })}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          {t('media.download.button', 'Pobierz plik')}
        </a>
        {(format || fileSize) && (
          <div className={clsx('flex items-center gap-2', isCompact ? 'text-xs' : 'text-sm')}>
            {format && (
              <span
                className={clsx(
                  'rounded-full border px-2.5 py-1',
                  isProminent
                    ? 'border-accent-500/50 bg-accent-500/10 text-accent-200'
                    : 'border-base-600 bg-base-800/50 text-base-300'
                )}
              >
                {format}
              </span>
            )}
            {fileSize && (
              <span className={clsx(isProminent ? 'text-accent-300' : 'text-base-400')}>
                {fileSize}
              </span>
            )}
          </div>
        )}
      </div>

      {isProminent && (
        <div className="mt-4 rounded-lg border border-accent-700/30 bg-accent-950/20 p-3">
          <p className="text-xs text-accent-200">
            {t(
              'media.download.browserNote',
              'Uwaga: Niektóre starsze przeglądarki mogą nie obsługiwać odtwarzania streamingu. Po pobraniu pliku możesz go odtworzyć w dowolnym odtwarzaczu multimedialnym.'
            )}
          </p>
        </div>
      )}
    </div>
  );
}
