import type { Comment } from '@/shared/api/comments';

export type CommentNode = {
  comment: Comment;
  replies: Comment[];
};

export type RootIdOfInput = {
  comment: Comment;
  byId: ReadonlyMap<string, Comment>;
};
