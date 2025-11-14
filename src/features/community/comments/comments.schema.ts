/**
 * Unique identifier for a comment.
 */
export type CommentId = string;

/**
 * User-submitted comment in a discussion thread.
 *
 * @property id - Unique identifier
 * @property nickname - Display name chosen by commenter
 * @property content - Comment text (max 500 characters)
 * @property createdAt - ISO 8601 timestamp of creation
 * @property hidden - Whether comment is hidden by moderator
 * @property flagged - Whether comment is flagged for review
 */
export type Comment = {
  id: CommentId;
  nickname: string;
  content: string;
  createdAt: string;
  hidden?: boolean;
  flagged?: boolean;
};

/**
 * Discussion thread containing related comments.
 *
 * @property id - Unique thread identifier
 * @property title - Translation key for thread name
 * @property description - Optional translation key for thread description
 * @property comments - Array of comment IDs in chronological order
 * @property createdAt - ISO 8601 timestamp of thread creation
 */
export type Thread = {
  id: string;
  title: string;
  description?: string;
  comments: CommentId[];
  createdAt: string;
};

/**
 * Input data for creating a new comment.
 *
 * @property nickname - Display name for the comment (required, will be trimmed)
 * @property content - Comment text (required, max 500 chars after trimming)
 * @property threadId - ID of the thread to post in
 */
export type CreateCommentInput = {
  nickname: string;
  content: string;
  threadId: string;
};
