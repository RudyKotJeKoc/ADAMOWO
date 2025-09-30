import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type {
  Comment,
  CommentId,
  CreateCommentInput,
  Thread
} from './comments.schema';

const FALLBACK_STORAGE: Storage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
  clear: () => undefined,
  key: () => null,
  get length() {
    return 0;
  }
};

const storage = createJSONStorage(() => {
  if (typeof window === 'undefined') {
    return FALLBACK_STORAGE;
  }

  try {
    return window.localStorage;
  } catch (error) {
    console.warn('Unable to access localStorage for comments store', error);
    return FALLBACK_STORAGE;
  }
});

const defaultThreads: Record<string, Thread> = {
  general: {
    id: 'general',
    title: 'community.comments.threads.general',
    description: 'community.comments.threads.generalDescription',
    comments: [],
    createdAt: new Date().toISOString()
  },
  boundaries: {
    id: 'boundaries',
    title: 'community.comments.threads.boundaries',
    description: 'community.comments.threads.boundariesDescription',
    comments: [],
    createdAt: new Date().toISOString()
  },
  victories: {
    id: 'victories',
    title: 'community.comments.threads.victories',
    description: 'community.comments.threads.victoriesDescription',
    comments: [],
    createdAt: new Date().toISOString()
  }
};

export type CommentsState = {
  threads: Record<string, Thread>;
  comments: Record<CommentId, Comment>;
  activeThreadId: string;
  addComment: (input: CreateCommentInput) => Comment | null;
  toggleHidden: (id: CommentId) => void;
  toggleFlagged: (id: CommentId) => void;
  setActiveThread: (threadId: string) => void;
  reset: () => void;
};

const createComment = ({ nickname, content }: CreateCommentInput): Comment => {
  const trimmedContent = content.trim();
  const trimmedNickname = nickname.trim();

  if (!trimmedContent || !trimmedNickname) {
    throw new Error('nickname and content are required');
  }

  if (trimmedContent.length > 500) {
    throw new Error('content must be <= 500 characters');
  }

  return {
    id: typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    nickname: trimmedNickname,
    content: trimmedContent,
    createdAt: new Date().toISOString(),
    hidden: false,
    flagged: false
  };
};

export const useCommentsStore = create<CommentsState>()(
  persist(
    (set, get) => ({
      threads: defaultThreads,
      comments: {},
      activeThreadId: 'general',
      addComment: (input) => {
        const state = get();
        const thread = state.threads[input.threadId];

        if (!thread) {
          console.warn('Unknown thread for comment', input.threadId);
          return null;
        }

        let comment: Comment;
        try {
          comment = createComment(input);
        } catch (error) {
          console.warn('Failed to create comment', error);
          return null;
        }

        set(({ comments, threads }) => ({
          comments: {
            ...comments,
            [comment.id]: comment
          },
          threads: {
            ...threads,
            [thread.id]: {
              ...thread,
              comments: [...thread.comments, comment.id]
            }
          }
        }));

        return comment;
      },
      toggleHidden: (id) =>
        set(({ comments }) => {
          const comment = comments[id];
          if (!comment) {
            return { comments };
          }

          return {
            comments: {
              ...comments,
              [id]: { ...comment, hidden: !comment.hidden }
            }
          };
        }),
      toggleFlagged: (id) =>
        set(({ comments }) => {
          const comment = comments[id];
          if (!comment) {
            return { comments };
          }

          return {
            comments: {
              ...comments,
              [id]: { ...comment, flagged: !comment.flagged }
            }
          };
        }),
      setActiveThread: (threadId) => {
        if (!get().threads[threadId]) {
          return;
        }
        set({ activeThreadId: threadId });
      },
      reset: () =>
        set(() => ({
          threads: Object.fromEntries(
            Object.entries(defaultThreads).map(([id, thread]) => [
              id,
              { ...thread, comments: [] }
            ])
          ),
          comments: {},
          activeThreadId: 'general'
        }))
    }),
    {
      name: 'community-comments',
      storage,
      partialize: (state) => ({
        threads: state.threads,
        comments: state.comments,
        activeThreadId: state.activeThreadId
      })
    }
  )
);
