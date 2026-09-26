import type { CommentTarget } from '@/shared/api/comments';

export type CommentsThreadProps = {
  target: CommentTarget;
  targetId: string;
  className?: string;
};
