'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { unfollowStreamer } from '@/shared/api/streamers';
import { QUERY_KEYS } from '@/shared/constants';

import { useFollowsQuery } from '../use-follows-query';

export const useMyFollows = () => {
  const t = useTranslations('streamersDirectory.follows');
  const queryClient = useQueryClient();
  const { isSignedIn, follows } = useFollowsQuery();
  const unfollow = useMutation({
    mutationFn: unfollowStreamer,
    onSuccess: async (_, slug) => {
      toast.success(t('unfollowed'));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me.streamer.follows }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.streamers.profile(slug) })
      ]);
    },
    onError: () => void toast.error(t('failed'))
  });

  return {
    isVisible: isSignedIn && follows.length > 0,
    follows,
    pendingSlug: unfollow.isPending ? unfollow.variables : null,
    onUnfollow: (slug: string) => unfollow.mutate(slug)
  };
};
