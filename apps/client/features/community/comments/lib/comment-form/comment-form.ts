import type { CreateComment } from '@/shared/api/comments';

import type { ToCreateCommentInput } from './comment-form.types';

export const toCreateComment = ({ values, target, targetId, parentId }: ToCreateCommentInput): CreateComment => ({
  target,
  targetId,
  body: values.body,
  ...(parentId ? { parentId } : {})
});
