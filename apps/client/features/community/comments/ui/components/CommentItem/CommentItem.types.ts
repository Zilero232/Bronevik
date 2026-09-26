import type { Comment } from '@/shared/api/comments';

import type { CommentThreadTarget } from '../../../lib/comment-form';

export type CommentItemProps = {
  comment: Comment;
  thread: CommentThreadTarget;
  viewerId: string | null;
  canReply: boolean;
  replies?: Comment[];
};
