import type { CreateComment } from '../../api';
import type { ToCreateCommentInput } from './comment-form.types';

export const toCreateComment = ({ values, target, targetId, parentId }: ToCreateCommentInput): CreateComment => ({
  target,
  targetId,
  body: values.body,
  ...(parentId ? { parentId } : {})
});
