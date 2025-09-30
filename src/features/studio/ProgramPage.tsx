import { useEffect, useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { AnalysisPlayer } from '../analysis-archive/AnalysisPlayer';
import { EpisodeCard } from '../analysis-archive/EpisodeCard';
import type { Episode } from '../analysis-archive/data.schema';
import { ScheduleMini } from './ScheduleMini';
import { ProgramHeader } from './ProgramHeader';
import { getProgramMeta } from './studio.data';
import type { ProgramId } from './studio.schema';
import { useRecentEpisodes } from './useRecentEpisodes';

function useProgram(programId: ProgramId | null) {
  return useMemo(() => getProgramMeta(programId), [programId]);
}

type ProgramPageProps = {
  programId: ProgramId | null;
};

export function ProgramPage({ programId }: ProgramPageProps) {
  const { t } = useTranslation();
  const program = useProgram(programId);
  const { episodes, isLoading } = useRecentEpisodes(program?.id ?? null, { limit: 5 });
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const hostsHeadingId = useId();

  useEffect(() => {
    if (!program) {
      setSelectedEpisode(null);
      return;
    }

    setSelectedEpisode((current) => {
      if (current && current.programId === program.id) {
        return current;
      }

      return episodes[0] ?? null;
    });
  }, [program, episodes]);

  if (!program) {
    return (
      <section className="space-y-6 text-base-200">
        <h1 className="text-3xl font-semibold text-base-50">{t('studio.notFound.title')}</h1>
        <p>{t('studio.notFound.description')}</p>
        <Link
          to="/studio"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-accent-400 px-5 py-2 text-sm font-semibold text-accent-200 transition hover:bg-accent-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
        >
          {t('studio.notFound.back')}
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-10">
      <ProgramHeader program={program} />

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]" aria-label={t('studio.program.layoutAria')}>
        <div className="space-y-8">
          <section role="region" aria-labelledby="program-description" className="space-y-4">
            <h2 id="program-description" className="text-2xl font-semibold text-base-100">
              {t('studio.program.descriptionTitle')}
            </h2>
            <div className="space-y-3 text-base-300">
              {program.descriptionKeys.map((key) => (
                <p key={key}>{t(key)}</p>
              ))}
            </div>
          </section>

          <section role="region" aria-labelledby={hostsHeadingId} className="space-y-4">
            <h2 id={hostsHeadingId} className="text-2xl font-semibold text-base-100">
              {t('studio.program.hostsTitle')}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {program.hosts.map((host) => (
                <article
                  key={host.nameKey}
                  className="rounded-2xl border border-base-800 bg-base-925/60 p-4 shadow-inner shadow-black/30"
                  aria-label={t(host.nameKey)}
                >
                  <h3 className="text-lg font-semibold text-base-50">{t(host.nameKey)}</h3>
                  {host.bioKey ? <p className="mt-2 text-sm text-base-300">{t(host.bioKey)}</p> : null}
                </article>
              ))}
            </div>
          </section>

          <ScheduleMini entries={program.schedule} />

          <section role="region" aria-labelledby="program-episodes" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 id="program-episodes" className="text-2xl font-semibold text-base-100">
                {t('studio.program.recentEpisodesTitle')}
              </h2>
              <Link
                to="/analysis"
                className="text-sm font-semibold text-accent-200 hover:text-accent-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
              >
                {t('studio.program.viewArchive')}
              </Link>
            </div>
            <div className="grid gap-4">
              {isLoading
                ? Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-36 animate-pulse rounded-2xl border border-base-850 bg-base-900/40"
                      aria-hidden="true"
                    />
                  ))
                : episodes.map((episode) => (
                    <EpisodeCard
                      key={episode.id}
                      episode={episode}
                      isActive={selectedEpisode?.id === episode.id}
                      onSelect={setSelectedEpisode}
                    />
                  ))}
              {!isLoading && episodes.length === 0 ? (
                <p className="text-sm text-base-400">{t('studio.program.noEpisodes')}</p>
              ) : null}
            </div>
          </section>
        </div>

        <aside className="space-y-4" aria-label={t('studio.program.playerAria')} role="complementary">
          <AnalysisPlayer episode={selectedEpisode} />
        </aside>
      </section>
    </div>
  );
}
