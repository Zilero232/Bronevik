import type { Comment } from '../generated';

export type { Comment, CommentList, CreateComment } from '../generated';

export type CommentTarget = Comment['target'];

export type CommentAuthor = Comment['author'];

export type CommentListInput = {
  target: CommentTarget;
  targetId: string;
  signal?: AbortSignal;
};
