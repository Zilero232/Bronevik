'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { QUERY_KEYS } from '@/shared/constants';

import type { UseCommentItemInput } from './use-comment-item.types';

import { removeComment } from '../../../api';
import { isDeletedComment } from '../../../lib/comment-tree';
import { useCommentsThreadContext } from '../../context';

export const useCommentItem = ({ comment, isReply = false }: UseCommentItemInput) => {
  const t = useTranslations('community.comments');
  const queryClient = useQueryClient();
  const { thread, viewerId, isSignedIn } = useCommentsThreadContext();
  const [isReplying, toggleReply] = useBoolean(false);

  const remove = useMutation({
    mutationFn: () => removeComment(comment.id),
    onSuccess: () => {
      toast.success(t('removed'));
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.comments(thread) });
    },
    onError: () => toast.error(t('failed'))
  });

  return {
    isOwn: viewerId !== null && viewerId === comment.author.id,
    isDeleted: isDeletedComment(comment),
    canReply: isSignedIn && !isReply,
    isReplying,
    toggleReply: () => toggleReply(),
    closeReply: () => toggleReply(false),
    remove: () => remove.mutate(),
    isRemoving: remove.isPending
  };
};
