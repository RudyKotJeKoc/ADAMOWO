import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type {
  Comment,
  CommentId,
  CreateCommentInput,
  Thread
} from './comments.schema';

/**
 * No-op storage implementation for SSR environments.
 *
 * @internal
 */
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

/**
 * Safe localStorage accessor with SSR fallback.
 *
 * Returns FALLBACK_STORAGE during server-side rendering or if
 * localStorage is unavailable.
 *
 * @internal
 */
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

/**
 * Initial thread configuration for the community.
 *
 * Defines three default discussion threads:
 * - general: Open discussion for all topics
 * - boundaries: Setting and maintaining healthy limits
 * - victories: Celebrating progress and wins
 *
 * @internal
 */
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

/**
 * State shape and actions for the comments store.
 *
 * @property threads - Map of thread ID to thread data
 * @property comments - Map of comment ID to comment data
 * @property activeThreadId - Currently selected thread
 * @property addComment - Create and add a new comment to a thread
 * @property toggleHidden - Toggle comment visibility (moderation)
 * @property toggleFlagged - Toggle comment flagged status (moderation)
 * @property setActiveThread - Change the active thread
 * @property reset - Clear all comments and reset to default state
 */
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

/**
 * Creates a validated comment object.
 *
 * Trims input, validates lengths, and generates a unique ID.
 * Throws if validation fails.
 *
 * @param input - Comment creation data
 * @returns Fully formed comment object
 * @throws Error if nickname or content are empty or content exceeds 500 chars
 *
 * @internal
 */
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

/**
 * Zustand store for community comments feature.
 *
 * Manages discussion threads, comments, and moderation state with
 * automatic persistence to localStorage. Provides CRUD operations
 * for comments and moderation controls.
 *
 * State is partitioned to persist only threads, comments, and
 * activeThreadId. Persisted data survives page reloads.
 *
 * @example
 * ```tsx
 * function CommentForm() {
 *   const addComment = useCommentsStore(state => state.addComment);
 *   const activeThreadId = useCommentsStore(state => state.activeThreadId);
 *
 *   const handleSubmit = (e) => {
 *     e.preventDefault();
 *     const comment = addComment({
 *       nickname: 'User123',
 *       content: 'This is helpful!',
 *       threadId: activeThreadId
 *     });
 *
 *     if (comment) {
 *       console.log('Comment created:', comment.id);
 *     }
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
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
