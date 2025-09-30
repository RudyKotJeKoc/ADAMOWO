import { useTranslation } from 'react-i18next';
import type { JSX } from 'react';

import { TabNav } from '../../../components/TabNav';
import { CommentForm } from './CommentForm';
import { ModerationPanel } from './ModerationPanel';
import { useCommentsStore } from './comments.store';

const formatDate = (value: string, locale: string) => {
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(value));
  } catch (error) {
    console.warn('Failed to format comment date', error);
    return value;
  }
};

export function CommentsBoard(): JSX.Element {
  const { t, i18n } = useTranslation();
  const threads = useCommentsStore((state) => state.threads);
  const comments = useCommentsStore((state) => state.comments);
  const activeThreadId = useCommentsStore((state) => state.activeThreadId);
  const setActiveThread = useCommentsStore((state) => state.setActiveThread);

  const activeThread = threads[activeThreadId];

  const tabItems = Object.values(threads).map((thread) => ({
    id: thread.id,
    label: t(thread.title),
    panelId: `${thread.id}-panel`
  }));

  return (
    <section
      role="region"
      aria-labelledby="community-voices-title"
      className="space-y-8"
    >
      <header className="space-y-3">
        <h2 id="community-voices-title" className="text-2xl font-bold text-base-50">
          {t('community.tabs.voices')}
        </h2>
        <p className="text-sm text-base-200">{t('comments.info.localOnly')}</p>
      </header>
      <TabNav
        tabs={tabItems}
        activeTab={activeThreadId}
        onChange={setActiveThread}
        ariaLabel={t('comments.threads.ariaLabel')}
      />
      <div
        id={`${activeThreadId}-panel`}
        role="tabpanel"
        aria-labelledby={`${activeThreadId}-tab`}
        className="grid gap-8 lg:grid-cols-[2fr_1fr]"
      >
        <div className="space-y-4">
          {activeThread && activeThread.comments.length > 0 ? (
            <ul className="space-y-4" aria-live="polite">
              {activeThread.comments
                .map((commentId) => comments[commentId])
                .filter(Boolean)
                .map((comment) => (
                  <li key={comment!.id}>
                    <article
                      className="rounded-xl border border-base-800 bg-base-900/70 p-5 shadow-sm"
                      aria-label={t('comments.card.label', { nickname: comment!.nickname })}
                    >
                      <header className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-semibold text-base-100">
                          {comment!.nickname}
                        </span>
                        <span className="text-xs text-base-300">
                          {formatDate(comment!.createdAt, i18n.language)}
                        </span>
                        <span
                          className="inline-flex items-center rounded-full bg-base-800 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-base-200"
                        >
                          {comment!.hidden
                            ? t('comments.status.hidden')
                            : t('comments.status.visible')}
                        </span>
                        {comment!.flagged ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent-500/10 px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-accent-400">
                            <span aria-hidden>⚠</span>
                            {t('comments.status.flagged')}
                          </span>
                        ) : null}
                      </header>
                      <p className="mt-3 whitespace-pre-line text-sm text-base-100">
                        {comment!.hidden ? t('comments.hiddenMessage') : comment!.content}
                      </p>
                      <ModerationPanel
                        commentId={comment!.id}
                        hidden={comment!.hidden}
                        flagged={comment!.flagged}
                      />
                    </article>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="rounded-lg border border-dashed border-base-800 p-6 text-sm text-base-300">
              {t('comments.empty')}
            </p>
          )}
        </div>
        <div>
          <CommentForm />
        </div>
      </div>
      <div className="rounded-lg border border-base-800 bg-base-900/40 p-4 text-xs text-base-300">
        <p className="font-semibold text-base-100">{t('comments.safety.title')}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>{t('comments.safety.anonymity')}</li>
          <li>{t('comments.safety.noNames')}</li>
          <li>{t('comments.safety.emergency')}</li>
        </ul>
      </div>
    </section>
  );
}
