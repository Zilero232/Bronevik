import { zCreateComment } from '@/shared/api/comments';

import type { CommentFormValues } from '../lib/comment-form';

export const COMMENT_FORM_DEFAULT_VALUES: CommentFormValues = { body: '' };

export const COMMENT_MAX_LENGTH = zCreateComment.shape.body.maxLength ?? undefined;

export const COMMENTS_THREAD = {
  skeletonRows: [0, 1, 2],
  skeletonHeight: 64
} as const;
