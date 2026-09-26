import type { Comment } from '../../../api';
import type { CommentThreadTarget } from '../../../lib/comment-form';

export type UseCommentItemInput = {
  comment: Comment;
  thread: CommentThreadTarget;
  viewerId: string | null;
};
