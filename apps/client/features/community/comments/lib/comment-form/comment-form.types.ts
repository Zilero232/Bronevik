import type { z } from 'zod';

import type { CommentTarget } from '@/shared/api/comments';

import type { commentFormSchema } from './comment-form.schemas';

export type CommentFormValues = z.input<typeof commentFormSchema>;

export type CommentFormOutput = z.output<typeof commentFormSchema>;

export type CommentThreadTarget = {
  target: CommentTarget;
  targetId: string;
};

export type ToCreateCommentInput = CommentThreadTarget & {
  values: CommentFormOutput;
  parentId?: string;
};
