import { useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { useCommentsStore } from './comments.store';

type ModerationPanelProps = {
  commentId: string;
  hidden?: boolean;
  flagged?: boolean;
};

export function ModerationPanel({ commentId, hidden, flagged }: ModerationPanelProps): JSX.Element {
  const { t } = useTranslation();
  const toggleHidden = useCommentsStore((state) => state.toggleHidden);
  const toggleFlagged = useCommentsStore((state) => state.toggleFlagged);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleHideClick = () => {
    if (hidden) {
      toggleHidden(commentId);
      return;
    }
    setDialogOpen(true);
  };

  const handleConfirmHide = () => {
    toggleHidden(commentId);
    setDialogOpen(false);
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2" aria-label={t('comments.moderation.label')}>
      <button
        type="button"
        className="rounded-md border border-base-700 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-base-100 transition-colors hover:bg-base-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
        onClick={handleHideClick}
        aria-pressed={hidden}
        aria-label={hidden ? t('comments.moderation.unhide') : t('comments.moderation.hide')}
      >
        {hidden ? t('comments.moderation.unhide') : t('comments.moderation.hide')}
      </button>
      <button
        type="button"
        className="rounded-md border border-accent-500 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-accent-400 transition-colors hover:bg-accent-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
        onClick={() => toggleFlagged(commentId)}
        aria-pressed={flagged}
      >
        {flagged ? t('comments.moderation.unflag') : t('comments.moderation.flag')}
      </button>
      <ConfirmDialog
        open={dialogOpen}
        title={t('comments.moderation.hideConfirmTitle')}
        description={t('comments.moderation.hideConfirmDescription')}
        confirmLabel={t('comments.moderation.hide')}
        cancelLabel={t('comments.moderation.cancel')}
        onConfirm={handleConfirmHide}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
}
