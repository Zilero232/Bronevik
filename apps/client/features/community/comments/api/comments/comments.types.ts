import type { Comment } from '@/shared/api/generated';

export type { Comment, CommentList, CreateComment } from '@/shared/api/generated';

export type CommentTarget = Comment['target'];

export type CommentAuthor = Comment['author'];

export type CommentListInput = {
  target: CommentTarget;
  targetId: string;
  signal?: AbortSignal;
};
