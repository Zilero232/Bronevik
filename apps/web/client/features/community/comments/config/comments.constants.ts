import type { CommentFormValues } from '../lib/comment-form';

import { zCreateComment } from '../api';

export const COMMENT_FORM = {
  defaultValues: { body: '' } satisfies CommentFormValues,
  maxLength: zCreateComment.shape.body.maxLength ?? undefined
} as const;

export const COMMENTS_THREAD = {
  skeletonRows: 3,
  skeletonHeight: 64
} as const;
