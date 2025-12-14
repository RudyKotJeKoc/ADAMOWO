import { PlayCircleIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

import { DownloadFallback } from '../components/DownloadFallback';

const STREAMING_AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
const STREAMING_VIDEO_URL =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm';

export default function MediaHub(): JSX.Element {
  const { t } = useTranslation();

  return (
    <section className="space-y-10">
      <header className="space-y-3">
        <p className="inline-flex items-center gap-2 rounded-full bg-accent-500/10 px-3 py-1 text-sm font-semibold text-accent-200">
          {t('pages.mediaHub.badge', 'Nowe odtwarzacze')}{' '}
          <PlayCircleIcon className="h-4 w-4" aria-hidden="true" />
        </p>
        <h1 className="text-3xl font-bold text-base-50 sm:text-4xl">
          {t('pages.mediaHub.title', 'Centrum multimediów')}
        </h1>
        <p className="max-w-3xl text-lg leading-relaxed text-base-200">
          {t(
            'pages.mediaHub.lead',
            'Nowoczesne odtwarzacze audio i wideo z pełną obsługą HTML5, transkryptami i możliwością pobrania treści bez komunikatu o braku wsparcia.'
          )}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="space-y-4 rounded-2xl border border-base-800 bg-base-900/70 p-6 shadow-lg shadow-indigo-950/30">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-accent-200">
                {t('pages.mediaHub.audio.label', 'Audycja')} · 8 min
              </p>
              <h2 className="text-2xl font-semibold text-base-50">
                {t('pages.mediaHub.audio.title', 'Laboratorium AI: wprowadzenie')}
              </h2>
              <p className="text-base text-base-300">
                {t(
                  'pages.mediaHub.audio.description',
                  'Pełny odtwarzacz HTML5 z napisem alternatywnym, kontrolą głośności i linkiem do pobrania, aby uniknąć komunikatu „przeglądarka nie obsługuje audio”.'
                )}
              </p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-500/15 text-accent-200">
              <PlayCircleIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>

          <figure className="space-y-3">
            <audio
              controls
              preload="metadata"
              className="w-full"
              aria-label={t(
                'pages.mediaHub.audio.playerLabel',
                'Odtwarzacz podcastu Laboratorium AI'
              )}
            >
              <source src={STREAMING_AUDIO_URL} type="audio/mpeg" />
              <p className="text-sm text-base-200">
                {t(
                  'pages.mediaHub.audio.fallback',
                  'Twoja przeglądarka nie obsługuje elementu audio. Skorzystaj z pobrania poniżej.'
                )}
              </p>
            </audio>
            <figcaption className="space-y-2 text-sm leading-relaxed text-base-300">
              <p>
                {t(
                  'pages.mediaHub.audio.transcript',
                  'Przykładowy odcinek opisuje, w jaki sposób Laboratorium AI pomaga analizować czerwone flagi w rozmowach. Odtwarzacz wspiera klawiaturę i skróty systemowe.'
                )}
              </p>
              <DownloadFallback
                downloadUrl={STREAMING_AUDIO_URL}
                title={t('pages.mediaHub.audio.title', 'Laboratorium AI: wprowadzenie')}
                mediaType="audio"
                format="MP3"
                fileSize={t('pages.mediaHub.audio.downloadDescription', '320 kbps')}
                variant="prominent"
              />
            </figcaption>
          </figure>
        </article>

        <article className="space-y-4 rounded-2xl border border-base-800 bg-base-900/70 p-6 shadow-lg shadow-indigo-950/30">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-accent-200">
                {t('pages.mediaHub.video.label', 'Wideo')} · 2 min
              </p>
              <h2 className="text-2xl font-semibold text-base-50">
                {t('pages.mediaHub.video.title', 'Intro do pętli przemocy')}
              </h2>
              <p className="text-base text-base-300">
                {t(
                  'pages.mediaHub.video.description',
                  'Lekki odtwarzacz HTML5 z podpisem alternatywnym i transkrypcją zapewnia kompatybilność bez komunikatu o braku wsparcia wideo.'
                )}
              </p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent-500/15 text-accent-200">
              <VideoCameraIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>

          <figure className="space-y-3">
            <video
              controls
              preload="metadata"
              poster="https://interactive-examples.mdn.mozilla.net/media/examples/flower.jpg"
              className="w-full rounded-lg border border-base-800"
              aria-label={t(
                'pages.mediaHub.video.playerLabel',
                'Odtwarzacz wideo: Intro do pętli przemocy'
              )}
            >
              <source src={STREAMING_VIDEO_URL} type="video/webm" />
              <p className="text-sm text-base-200">
                {t(
                  'pages.mediaHub.video.fallback',
                  'Twoja przeglądarka nie obsługuje elementu wideo. Użyj linku do pobrania poniżej.'
                )}
              </p>
            </video>
            <figcaption className="space-y-2 text-sm leading-relaxed text-base-300">
              <p>
                {t(
                  'pages.mediaHub.video.transcript',
                  'Wideo demonstruje, jak drobne gesty i daty w kalendarzu mogą eskalować napięcia. Materiał zawiera podpisy osadzone w playerze systemowym.'
                )}
              </p>
              <DownloadFallback
                downloadUrl={STREAMING_VIDEO_URL}
                title={t('pages.mediaHub.video.title', 'Intro do pętli przemocy')}
                mediaType="video"
                format="WEBM"
                fileSize={t('pages.mediaHub.video.downloadDescription', '720p')}
                variant="prominent"
              />
            </figcaption>
          </figure>
        </article>
      </div>
    </section>
  );
}
