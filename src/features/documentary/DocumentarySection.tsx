import { useMemo } from 'react';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { documentaryMeta } from './doc.data';
import type { DocResource } from './doc.schema';
import { VideoPlayer } from './VideoPlayer';
import type { VideoChapter } from './VideoPlayer';

const resourceTypeIcon: Record<DocResource['type'], string> = {
  pdf: '📄',
  article: '📰',
  audio: '🎧',
  guide: '🧭',
  video: '🎬'
};

export function DocumentarySection(): ReactElement {
  const { t } = useTranslation();

  const hlsSource = import.meta.env.VITE_DOC_VIDEO_HLS as string | undefined;
  const mp4Source = import.meta.env.VITE_DOC_VIDEO_MP4 as string | undefined;
  const subtitlesSrc = import.meta.env.VITE_DOC_SUBTITLES_VTT as string | undefined;

  const resources = useMemo(
    () =>
      documentaryMeta.resources.map((resource) => ({
        ...resource,
        title: t(resource.titleKey),
        description: t(resource.descriptionKey),
        typeLabel: t(`documentary.resourceTypes.${resource.type}`)
      })),
    [t]
  );

  const chapters = useMemo(
    () =>
      documentaryMeta.chapters.map((chapter) => ({
        ...chapter,
        title: t(chapter.titleKey),
        summary: chapter.summaryKey ? (t(chapter.summaryKey) as string) : undefined
      })),
    [t]
  );

  const subtitleTracks = useMemo(() => {
    if (!subtitlesSrc) {
      return undefined;
    }

    return [
      {
        id: 'primary-subtitles',
        label: t('documentary.subtitles.primaryLabel'),
        src: subtitlesSrc,
        srclang: t('documentary.subtitles.primaryCode'),
        kind: 'subtitles' as const,
        default: true
      }
    ];
  }, [subtitlesSrc, t]);

  const statusMessages = useMemo(
    () => ({
      loading: t('documentary.player.status.loading'),
      error: t('documentary.player.status.error'),
      noSource: t('documentary.player.status.noSource')
    }),
    [t]
  );

  const labels = useMemo(
    () => ({
      controlsGroup: t('documentary.player.controlsGroup'),
      play: t('documentary.player.play'),
      pause: t('documentary.player.pause'),
      mute: t('documentary.player.mute'),
      unmute: t('documentary.player.unmute'),
      subtitlesOn: t('documentary.player.subtitlesOn'),
      subtitlesOff: t('documentary.player.subtitlesOff'),
      subtitlesUnavailable: t('documentary.player.subtitlesUnavailable'),
      enterFullscreen: t('documentary.player.enterFullscreen'),
      exitFullscreen: t('documentary.player.exitFullscreen'),
      progress: t('documentary.player.progress'),
      volume: t('documentary.player.volume'),
      volumeIndicator: (value: number) =>
        t('documentary.player.volumeIndicator', { value: Math.round(value * 100) }),
      chapterHeading: t('documentary.player.chaptersHeading'),
      chapterCurrent: t('documentary.player.chapterCurrent'),
      getChapterAriaLabel: (chapter: VideoChapter, formattedTime: string) =>
        t('documentary.player.chapterAriaLabel', {
          title: chapter.title,
          time: formattedTime
        })
    }),
    [t]
  );

  const noSourceConfigured = !hlsSource && !mp4Source;

  return (
    <section
      role="region"
      aria-labelledby="documentary-heading"
      className="rounded-3xl border border-base-800/70 bg-base-950/60 px-4 py-8 shadow-[0_30px_80px_rgba(10,14,39,0.45)] backdrop-blur-lg sm:px-6 lg:px-10"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-4 text-base-100">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-accent-300">
            {t('documentary.sectionLabel')}
          </p>
          <h2 id="documentary-heading" className="text-3xl font-semibold text-base-50 sm:text-4xl">
            {t(documentaryMeta.titleKey)}
          </h2>
          <p className="max-w-3xl text-base-200">{t(documentaryMeta.descriptionKey)}</p>
          {noSourceConfigured ? (
            <p className="max-w-2xl rounded-lg border border-dashed border-accent-500/60 bg-accent-500/10 p-4 text-sm text-accent-200">
              {t('documentary.player.status.configurationHint')}
            </p>
          ) : null}
        </header>

        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <VideoPlayer
              title={t(documentaryMeta.titleKey)}
              hlsSrc={hlsSource}
              mp4Src={mp4Source}
              poster={documentaryMeta.poster}
              chapters={chapters}
              subtitleTracks={subtitleTracks}
              statusMessages={statusMessages}
              labels={labels}
            />
          </div>

          <aside
            className="space-y-4 rounded-2xl border border-base-800/70 bg-base-950/40 p-6"
            aria-labelledby="documentary-materials"
          >
            <div className="space-y-2">
              <h3 id="documentary-materials" className="text-lg font-semibold text-base-50">
                {t('documentary.resources.heading')}
              </h3>
              <p className="text-sm text-base-300">{t('documentary.resources.description')}</p>
            </div>

            <ul className="space-y-4">
              {resources.map((resource) => (
                <li key={resource.id} className="rounded-xl border border-base-800/60 bg-base-900/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-semibold text-base-100">
                        <a
                          href={resource.url}
                          className="inline-flex items-center gap-2 text-base-100 underline decoration-accent-500 decoration-2 underline-offset-4 transition hover:text-accent-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${resource.title} – ${resource.typeLabel}`}
                        >
                          <span aria-hidden="true">{resourceTypeIcon[resource.type]}</span>
                          <span>{resource.title}</span>
                        </a>
                      </h4>
                      <p className="mt-1 text-sm text-base-300">{resource.description}</p>
                    </div>
                    <span className="rounded-full border border-accent-500/40 bg-accent-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-accent-200">
                      {resource.typeLabel}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
