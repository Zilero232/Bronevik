import type { CommentThreadTarget } from '../../../lib/comment-form';

export type UseCommentFormInput = {
  thread: CommentThreadTarget;
  parentId?: string;
  onDone?: () => void;
};
