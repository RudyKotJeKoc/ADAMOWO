import clsx from 'clsx';
import type { KeyboardEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { LibraryEntry } from './library.schema';

type LibraryDetailsProps = {
  entry: LibraryEntry;
};

type TabId = 'summary' | 'timeline' | 'resources' | 'tips';

export function LibraryDetails({ entry }: LibraryDetailsProps): JSX.Element {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>('summary');
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    summary: null,
    timeline: null,
    resources: null,
    tips: null
  });

  useEffect(() => {
    setActiveTab('summary');
  }, [entry.id]);

  const tabs = useMemo(
    () =>
      [
        { id: 'summary', label: t('library.tabs.summary') },
        { id: 'timeline', label: t('library.tabs.timeline') },
        { id: 'resources', label: t('library.tabs.resources') },
        { id: 'tips', label: t('library.tabs.tips') }
      ] as Array<{ id: TabId; label: string }>,
    [t]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return;
    }
    event.preventDefault();
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];
    setActiveTab(nextTab.id);
    const nextButton = tabRefs.current[nextTab.id];
    nextButton?.focus();
  };

  const renderSummary = () => (
    <div className="space-y-4">
      {entry.contentKeys.map((contentKey) => (
        <p key={contentKey} className="text-base leading-relaxed text-base-100/90">
          {t(contentKey)}
        </p>
      ))}
    </div>
  );

  const renderTimeline = () => {
    if (!entry.timeline?.length) {
      return <p className="text-base-200">{t('library.empty.timeline')}</p>;
    }

    return (
      <ol className="relative space-y-6 border-l border-accent-500/40 pl-6">
        {entry.timeline.map((item, index) => (
          <li key={`${item.title}-${index}`} className="relative">
            <span className="absolute -left-[1.35rem] top-1.5 flex h-3 w-3 items-center justify-center rounded-full border border-accent-400 bg-base-950">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
            </span>
            <time className="text-xs uppercase tracking-wide text-accent-200">
              {t(item.when)}
            </time>
            <p className="mt-2 text-base font-medium text-base-50">{t(item.title)}</p>
            {item.note ? (
              <p className="mt-1 text-sm text-base-200">{t(item.note)}</p>
            ) : null}
          </li>
        ))}
      </ol>
    );
  };

  const renderResources = () => {
    if (!entry.resources?.length) {
      return <p className="text-base-200">{t('library.empty.resources')}</p>;
    }

    return (
      <ul className="space-y-3">
        {entry.resources.map((resource) => (
          <li key={resource.url}>
            <a
              href={resource.url}
              className="inline-flex items-center gap-2 rounded-full border border-accent-500/40 bg-base-925/70 px-4 py-2 text-sm font-medium text-accent-100 transition motion-safe:hover:border-accent-400 motion-safe:hover:text-accent-50 focus-visible:border-accent-300 focus-visible:shadow-focus"
              download
            >
              <span aria-hidden="true">📄</span>
              <span>{t(resource.label)}</span>
            </a>
          </li>
        ))}
      </ul>
    );
  };

  const renderTips = () => {
    if (!entry.tipsKeys?.length) {
      return <p className="text-base-200">{t('library.empty.tips')}</p>;
    }

    return (
      <ul className="list-disc space-y-3 pl-6 text-base text-base-100/90">
        {entry.tipsKeys.map((tipKey) => (
          <li key={tipKey}>{t(tipKey)}</li>
        ))}
      </ul>
    );
  };

  const panelContent: Record<TabId, JSX.Element> = {
    summary: renderSummary(),
    timeline: renderTimeline(),
    resources: renderResources(),
    tips: renderTips()
  };

  return (
    <section
      className="flex flex-col rounded-3xl border border-base-800 bg-gradient-to-br from-base-925/90 via-base-900/70 to-base-950/90 p-8 shadow-[0_0_48px_rgba(14,18,42,0.55)]"
      aria-labelledby={`${entry.id}-details-title`}
      role="region"
    >
      <header className="flex flex-col gap-2 border-b border-base-850 pb-4">
        <div className="flex items-center justify-between gap-3">
          <h3 id={`${entry.id}-details-title`} className="font-display text-2xl font-semibold text-base-50">
            {t(entry.titleKey)}
          </h3>
          <span className="text-xs uppercase tracking-[0.3em] text-accent-200">{t('library.details')}</span>
        </div>
        <p className="max-w-2xl text-sm text-base-200">{t(entry.summaryKey)}</p>
      </header>

      <div
        className="mt-6 flex flex-col gap-4"
        role="tablist"
        aria-label={t('library.tabs.label')}
        onKeyDown={handleKeyDown}
      >
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[tab.id] = element;
              }}
              type="button"
              id={`library-tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`library-panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:shadow-focus',
                activeTab === tab.id
                  ? 'border-accent-400 bg-accent-500 text-base-950'
                  : 'border-transparent bg-base-900/60 text-base-200 hover:border-accent-500/40 hover:text-accent-100'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div
          id={`library-panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`library-tab-${activeTab}`}
          className="rounded-3xl border border-base-850/80 bg-base-925/60 p-6 text-base-100 shadow-inner"
        >
          {panelContent[activeTab]}
        </div>
      </div>
    </section>
  );
}
