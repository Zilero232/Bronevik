import type { Comment } from '../../../api';

import type { CommentThreadTarget } from '../../../lib/comment-form';

export type CommentItemProps = {
  comment: Comment;
  thread: CommentThreadTarget;
  viewerId: string | null;
  canReply: boolean;
  replies?: Comment[];
};
