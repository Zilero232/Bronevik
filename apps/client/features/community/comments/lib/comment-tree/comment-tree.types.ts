import type { Comment } from '@/shared/api/comments';

export type CommentNode = {
  comment: Comment;
  replies: Comment[];
};
