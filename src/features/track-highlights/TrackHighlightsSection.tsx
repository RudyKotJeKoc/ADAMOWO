import clsx from 'clsx';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

type TrackHighlight = {
  id: string;
  icon: string;
  accent: string;
  layout: string;
  kickerKey: string;
  titleKey: string;
  descriptionKey: string;
};

const trackHighlights: TrackHighlight[] = [
  {
    id: 'forest',
    icon: '🌲',
    accent: 'from-emerald-500/40 via-emerald-400/10 to-teal-500/10',
    layout: 'md:col-span-3 lg:col-span-5 lg:row-span-2',
    kickerKey: 'trackHighlights.cards.forest.kicker',
    titleKey: 'trackHighlights.cards.forest.title',
    descriptionKey: 'trackHighlights.cards.forest.description'
  },
  {
    id: 'rooftop',
    icon: '🏙️',
    accent: 'from-indigo-500/40 via-blue-400/10 to-sky-500/10',
    layout: 'md:col-span-3 lg:col-span-4',
    kickerKey: 'trackHighlights.cards.rooftop.kicker',
    titleKey: 'trackHighlights.cards.rooftop.title',
    descriptionKey: 'trackHighlights.cards.rooftop.description'
  },
  {
    id: 'neon',
    icon: '💡',
    accent: 'from-pink-500/40 via-fuchsia-400/10 to-purple-500/10',
    layout: 'md:col-span-3 lg:col-span-3',
    kickerKey: 'trackHighlights.cards.neon.kicker',
    titleKey: 'trackHighlights.cards.neon.title',
    descriptionKey: 'trackHighlights.cards.neon.description'
  },
  {
    id: 'river',
    icon: '🌊',
    accent: 'from-cyan-500/40 via-cyan-400/10 to-blue-500/10',
    layout: 'md:col-span-3 lg:col-span-4',
    kickerKey: 'trackHighlights.cards.river.kicker',
    titleKey: 'trackHighlights.cards.river.title',
    descriptionKey: 'trackHighlights.cards.river.description'
  },
  {
    id: 'attic',
    icon: '🕯️',
    accent: 'from-amber-500/40 via-amber-400/10 to-orange-500/10',
    layout: 'md:col-span-3 lg:col-span-4 lg:row-span-2',
    kickerKey: 'trackHighlights.cards.attic.kicker',
    titleKey: 'trackHighlights.cards.attic.title',
    descriptionKey: 'trackHighlights.cards.attic.description'
  },
  {
    id: 'garden',
    icon: '🌸',
    accent: 'from-rose-500/40 via-rose-400/10 to-emerald-400/10',
    layout: 'md:col-span-6 lg:col-span-3',
    kickerKey: 'trackHighlights.cards.garden.kicker',
    titleKey: 'trackHighlights.cards.garden.title',
    descriptionKey: 'trackHighlights.cards.garden.description'
  }
];

export function TrackHighlightsSection(): ReactElement {
  const { t } = useTranslation();

  return (
    <section
      role="region"
      aria-labelledby="track-highlights-heading"
      className="rounded-3xl border border-base-800/70 bg-base-950/60 px-4 py-8 shadow-[0_30px_80px_rgba(10,14,39,0.45)] backdrop-blur-lg sm:px-6 lg:px-10"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-4 text-base-100">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-accent-300">
            {t('trackHighlights.sectionLabel')}
          </p>
          <h2
            id="track-highlights-heading"
            className="text-3xl font-semibold text-base-50 sm:text-4xl"
          >
            {t('trackHighlights.title')}
          </h2>
          <p className="max-w-3xl text-base-200">{t('trackHighlights.description')}</p>
        </header>

        <div
          role="list"
          className="grid auto-rows-[minmax(170px,auto)] gap-5 md:grid-cols-6 lg:grid-cols-12"
        >
          {trackHighlights.map((highlight) => (
            <article
              key={highlight.id}
              role="listitem"
              aria-labelledby={`${highlight.id}-title`}
              className={clsx(
                'group relative isolate overflow-hidden rounded-3xl border border-base-800/60 bg-base-950/70 p-6 text-base-100 shadow-[0_25px_60px_rgba(8,10,30,0.35)] transition duration-500 hover:-translate-y-1 hover:border-accent-400/60 hover:shadow-[0_35px_90px_rgba(14,20,45,0.55)] focus-within:-translate-y-1 focus-within:border-accent-400/70 focus-within:shadow-[0_35px_90px_rgba(14,20,45,0.6)]',
                highlight.layout
              )}
            >
              <div
                aria-hidden="true"
                className={clsx(
                  'pointer-events-none absolute inset-0 -z-10 opacity-80 transition duration-500 group-hover:opacity-100 group-focus-within:opacity-100',
                  'bg-gradient-to-br',
                  highlight.accent
                )}
              />

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-base-950/80 text-2xl">
                    {highlight.icon}
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-200">
                    {t(highlight.kickerKey)}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3
                    id={`${highlight.id}-title`}
                    className="text-2xl font-semibold text-base-50"
                  >
                    {t(highlight.titleKey)}
                  </h3>
                  <p className="text-sm text-base-200">{t(highlight.descriptionKey)}</p>
                </div>

                <div className="mt-auto flex items-center gap-2 text-sm text-accent-200">
                  <span aria-hidden="true" className="text-lg">
                    ♪
                  </span>
                  <span>{t('trackHighlights.placeholderCta')}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
