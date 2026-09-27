import type { CommentFormValues } from '../lib/comment-form';

import { zCreateComment } from '../api';

export const COMMENT_FORM_DEFAULT_VALUES: CommentFormValues = { body: '' };

export const COMMENT_MAX_LENGTH = zCreateComment.shape.body.maxLength ?? undefined;

export const COMMENTS_THREAD = {
  skeletonRows: 3,
  skeletonHeight: 64
} as const;
