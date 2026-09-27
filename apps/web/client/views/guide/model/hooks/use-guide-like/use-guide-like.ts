'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import type { Guide } from '@/entities/guide/guide';

import { useAuthSession } from '@/entities/auth/session';
import { QUERY_KEYS } from '@/shared/constants';

import { likeGuide, unlikeGuide } from '../../../api';
import { applyLike } from '../../../lib/guide-like';
import { useGuide } from '../../context';

export const useGuideLike = () => {
  const guide = useGuide();
  const t = useTranslations('guides.detail');
  const queryClient = useQueryClient();
  const { data: session } = useAuthSession();

  const queryKey = QUERY_KEYS.guides.detail({ viewerId: session?.user.id ?? null, slug: guide.slug });

  const mutation = useMutation({
    mutationFn: (liked: boolean) => (liked ? likeGuide(guide.id) : unlikeGuide(guide.id)),
    onMutate: async (liked) => {
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<Guide>(queryKey);

      if (previous) {
        queryClient.setQueryData<Guide>(queryKey, {
          ...previous,
          ...applyLike({ state: { liked: previous.likedByMe, likesCount: previous.likesCount }, liked })
        });
      }

      return { previous };
    },
    onError: (_error, _liked, context) => {
      if (context?.previous) {
        queryClient.setQueryData<Guide>(queryKey, context.previous);
      }

      toast.error(t('likeFailed'));
    },
    onSuccess: ({ liked, likesCount }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.guides.all, refetchType: 'none' });
      queryClient.setQueryData<Guide>(queryKey, (current) => current && { ...current, likedByMe: liked, likesCount });
    }
  });

  return {
    isSignedIn: Boolean(session),
    isLiked: guide.likedByMe,
    likesCount: guide.likesCount,
    isAvailable: guide.status === 'published',
    isPending: mutation.isPending,
    toggle: () => mutation.mutate(!guide.likedByMe)
  };
};
