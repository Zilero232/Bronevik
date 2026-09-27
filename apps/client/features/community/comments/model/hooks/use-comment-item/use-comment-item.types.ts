import type { Comment } from '../../../api';

export type UseCommentItemInput = {
  comment: Comment;
  isReply?: boolean;
};
