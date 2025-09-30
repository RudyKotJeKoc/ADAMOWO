import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { useCommentsStore } from './comments.store';

const STORAGE_KEY = 'community-comments';

const resetStore = () => {
  useCommentsStore.getState().reset();
  localStorage.removeItem(STORAGE_KEY);
};

describe('comments store', () => {
  beforeEach(() => {
    resetStore();
  });

  afterEach(() => {
    resetStore();
  });

  it('adds a comment to the active thread', () => {
    const state = useCommentsStore.getState();
    const created = state.addComment({
      nickname: 'Ala',
      content: 'Pierwszy wpis',
      threadId: state.activeThreadId
    });

    expect(created).not.toBeNull();
    const updated = useCommentsStore.getState();
    expect(updated.threads[updated.activeThreadId]?.comments).toContain(created?.id);
    expect(updated.comments[created!.id]?.content).toBe('Pierwszy wpis');
  });

  it('rejects comments above the length limit', () => {
    const { addComment, activeThreadId } = useCommentsStore.getState();
    const longContent = 'x'.repeat(501);
    const created = addComment({ nickname: 'TooLong', content: longContent, threadId: activeThreadId });

    expect(created).toBeNull();
    const updated = useCommentsStore.getState();
    expect(Object.values(updated.comments)).toHaveLength(0);
  });

  it('toggles hidden status locally', () => {
    const { addComment, activeThreadId, toggleHidden } = useCommentsStore.getState();
    const created = addComment({ nickname: 'Basia', content: 'Ukryj mnie', threadId: activeThreadId });
    expect(created).not.toBeNull();

    toggleHidden(created!.id);
    expect(useCommentsStore.getState().comments[created!.id]?.hidden).toBe(true);

    toggleHidden(created!.id);
    expect(useCommentsStore.getState().comments[created!.id]?.hidden).toBe(false);
  });

  it('persists entries to localStorage', () => {
    const { addComment, activeThreadId } = useCommentsStore.getState();
    const created = addComment({ nickname: 'Mira', content: 'Test persistencji', threadId: activeThreadId });
    expect(created).not.toBeNull();

    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeTruthy();
    expect(stored).toContain('Test persistencji');
  });
});
