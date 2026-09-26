'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { createComment } from '@/shared/api/comments';
import { QUERY_KEYS } from '@/shared/constants';

import type { CommentFormOutput, CommentFormValues } from '../../../lib/comment-form';
import type { UseCommentFormInput } from './use-comment-form.types';

import { COMMENT_FORM_DEFAULT_VALUES, COMMENT_MAX_LENGTH } from '../../../config';
import { commentFormSchema, toCreateComment } from '../../../lib/comment-form';

export const useCommentForm = ({ thread, parentId, onDone }: UseCommentFormInput) => {
  const t = useTranslations('community.comments');
  const queryClient = useQueryClient();
  const form = useForm<CommentFormValues, unknown, CommentFormOutput>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: COMMENT_FORM_DEFAULT_VALUES
  });

  const body = useWatch({ control: form.control, name: 'body' });

  const create = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      form.reset(COMMENT_FORM_DEFAULT_VALUES);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments({ target: thread.target, targetId: thread.targetId }) });
      onDone?.();
    },
    onError: () => toast.error(t('failed'))
  });

  const onSubmit = form.handleSubmit((values) => create.mutate(toCreateComment({ ...thread, values, parentId })));

  return {
    form,
    length: body.length,
    maxLength: COMMENT_MAX_LENGTH,
    isPending: create.isPending,
    onSubmit
  };
};
