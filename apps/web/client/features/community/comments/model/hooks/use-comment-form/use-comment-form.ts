'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/shared/constants';

import type { CommentFormOutput, CommentFormValues } from '../../../lib/comment-form';
import type { UseCommentFormInput } from './use-comment-form.types';

import { createComment } from '../../../api';
import { COMMENT_FORM } from '../../../config';
import { commentFormSchema, toCreateComment } from '../../../lib/comment-form';
import { useCommentsThreadContext } from '../../context';

export const useCommentForm = ({ parentId, onDone }: UseCommentFormInput = {}) => {
  const t = useTranslations('community.comments');
  const queryClient = useQueryClient();
  const { thread } = useCommentsThreadContext();
  const form = useForm<CommentFormValues, unknown, CommentFormOutput>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: COMMENT_FORM.defaultValues
  });

  const body = useWatch({ control: form.control, name: 'body' });

  const create = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      form.reset(COMMENT_FORM.defaultValues);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments(thread) });
      onDone?.();
    },
    onError: () => toast.error(t('failed'))
  });

  const onSubmit = form.handleSubmit((values) => create.mutate(toCreateComment({ ...thread, values, parentId })));

  return {
    form,
    length: body.length,
    maxLength: COMMENT_FORM.maxLength,
    isPending: create.isPending,
    onSubmit
  };
};
