export type CommentId = string;

export type Comment = {
  id: CommentId;
  nickname: string;
  content: string;
  createdAt: string;
  hidden?: boolean;
  flagged?: boolean;
};

export type Thread = {
  id: string;
  title: string;
  description?: string;
  comments: CommentId[];
  createdAt: string;
};

export type CreateCommentInput = {
  nickname: string;
  content: string;
  threadId: string;
};
