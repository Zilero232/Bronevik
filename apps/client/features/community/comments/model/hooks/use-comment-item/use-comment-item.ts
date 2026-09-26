'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { removeComment } from '@/shared/api/comments';
import { QUERY_KEYS } from '@/shared/constants';

import type { UseCommentItemInput } from './use-comment-item.types';

import { isDeletedComment } from '../../../lib/comment-tree';

export const useCommentItem = ({ comment, thread, viewerId }: UseCommentItemInput) => {
  const t = useTranslations('community.comments');
  const queryClient = useQueryClient();
  const [isReplying, toggleReply] = useBoolean(false);

  const remove = useMutation({
    mutationFn: () => removeComment(comment.id),
    onSuccess: () => {
      toast.success(t('removed'));
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments({ target: thread.target, targetId: thread.targetId }) });
    },
    onError: () => toast.error(t('failed'))
  });

  return {
    isOwn: viewerId !== null && viewerId === comment.author.id,
    isDeleted: isDeletedComment(comment),
    isReplying,
    toggleReply: () => toggleReply(),
    closeReply: () => toggleReply(false),
    remove: () => remove.mutate(),
    isRemoving: remove.isPending
  };
};
