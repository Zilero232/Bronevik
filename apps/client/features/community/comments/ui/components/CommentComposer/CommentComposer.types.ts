import type { CommentThreadTarget } from '../../../lib/comment-form';

export type CommentComposerProps = {
  thread: CommentThreadTarget;
  parentId?: string;
  onDone?: () => void;
  onCancel?: () => void;
};
