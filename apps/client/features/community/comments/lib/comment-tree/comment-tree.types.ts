import type { Comment } from '../../api';

export type CommentNode = {
  comment: Comment;
  replies: Comment[];
};

export type RootIdOfInput = {
  comment: Comment;
  byId: ReadonlyMap<string, Comment>;
};
