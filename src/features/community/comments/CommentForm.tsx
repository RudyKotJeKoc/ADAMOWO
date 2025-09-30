import { FormEvent, useState, type JSX } from 'react';
import { useTranslation } from 'react-i18next';

import { useCommentsStore } from './comments.store';

const MAX_LENGTH = 500;
const MIN_NICKNAME = 2;

export function CommentForm(): JSX.Element {
  const { t } = useTranslation();
  const addComment = useCommentsStore((state) => state.addComment);
  const activeThreadId = useCommentsStore((state) => state.activeThreadId);
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('idle');

    const trimmedNickname = nickname.trim();
    const trimmedContent = content.trim();

    if (trimmedNickname.length < MIN_NICKNAME) {
      setError(t('comments.form.nicknameError'));
      return;
    }

    if (!trimmedContent) {
      setError(t('comments.form.contentError'));
      return;
    }

    if (trimmedContent.length > MAX_LENGTH) {
      setError(t('comments.form.lengthError'));
      return;
    }

    const created = addComment({
      nickname: trimmedNickname,
      content: trimmedContent,
      threadId: activeThreadId
    });

    if (!created) {
      setError(t('comments.form.submitError'));
      return;
    }

    setError(null);
    setStatus('success');
    setNickname('');
    setContent('');
  };

  return (
    <form
      aria-labelledby="add-comment-title"
      aria-describedby="comment-limit"
      className="space-y-4 rounded-xl border border-base-800 bg-base-900/70 p-6"
      onSubmit={handleSubmit}
    >
      <div className="flex items-center justify-between">
        <h3 id="add-comment-title" className="text-lg font-semibold text-base-50">
          {t('comments.add.title')}
        </h3>
        {status === 'success' ? (
          <span className="text-sm text-accent-400" role="status">
            {t('comments.form.success')}
          </span>
        ) : null}
      </div>
      <p id="comment-limit" className="text-sm text-base-200">
        {t('comments.form.limit', { max: MAX_LENGTH })}
      </p>
      <div className="space-y-2">
        <label htmlFor="comment-nickname" className="block text-sm font-medium text-base-100">
          {t('comments.form.nickname')}
        </label>
        <input
          id="comment-nickname"
          name="nickname"
          type="text"
          required
          minLength={MIN_NICKNAME}
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          className="w-full rounded-md border border-base-700 bg-base-900 px-3 py-2 text-base-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
          aria-describedby="comment-limit"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="comment-content" className="block text-sm font-medium text-base-100">
          {t('comments.form.content')}
        </label>
        <textarea
          id="comment-content"
          name="content"
          required
          maxLength={MAX_LENGTH}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="h-32 w-full resize-y rounded-md border border-base-700 bg-base-900 px-3 py-2 text-base-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
          aria-describedby="comment-limit"
        />
        <div className="flex justify-between text-xs text-base-300" aria-live="polite">
          <span>{t('comments.form.remaining', { count: MAX_LENGTH - content.length })}</span>
          {error ? (
            <span className="text-accent-400" role="alert">
              {error}
            </span>
          ) : null}
        </div>
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-accent-500 px-4 py-2 text-sm font-semibold text-base-950 transition-colors hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300 focus-visible:ring-offset-2 focus-visible:ring-offset-base-950"
      >
        {t('comments.form.submit')}
      </button>
    </form>
  );
}
