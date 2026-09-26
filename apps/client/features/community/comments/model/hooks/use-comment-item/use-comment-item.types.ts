import type { Comment } from '@/shared/api/comments';

import type { CommentThreadTarget } from '../../../lib/comment-form';

export type UseCommentItemInput = {
  comment: Comment;
  thread: CommentThreadTarget;
  viewerId: string | null;
};
