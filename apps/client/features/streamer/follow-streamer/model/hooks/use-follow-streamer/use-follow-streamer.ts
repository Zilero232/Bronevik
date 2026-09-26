'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { followStreamer, unfollowStreamer } from '@/shared/api/streamers';
import { QUERY_KEYS } from '@/shared/constants';

import type { FollowState } from './use-follow-streamer.types';

import { FOLLOW_STREAMER } from '../../../config';
import { followErrorKey } from '../../../lib/follow-error';
import { useFollowsQuery } from '../use-follows-query';

export const useFollowStreamer = (slug: string) => {
  const t = useTranslations('streamersDirectory.follow');
  const queryClient = useQueryClient();
  const { isSignedIn, follows, isPending } = useFollowsQuery();

  const current = follows.find((entry) => entry.slug === slug) ?? null;

  const refresh = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me.streamer.follows }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.streamers.profile(slug) })
    ]);

  const onError = (error: Error) => void toast.error(t(followErrorKey(error), { limit: FOLLOW_STREAMER.freeLimit }));

  const save = useMutation({
    mutationFn: (tankId: number | null) => followStreamer({ slug, tankId }),
    onSuccess: async (next) => {
      toast.success(current ? t('tankSaved') : t('followed'));
      queryClient.setQueryData(QUERY_KEYS.me.streamer.follows, next);
      await refresh();
    },
    onError
  });

  const remove = useMutation({
    mutationFn: () => unfollowStreamer(slug),
    onSuccess: async () => {
      toast.success(t('unfollowed'));
      await refresh();
    },
    onError
  });

  const state: FollowState = {
    isFollowing: current !== null,
    tankId: current?.tankId ?? null,
    followsCount: follows.length,
    isSaving: save.isPending,
    onTankChange: (tankId) => save.mutate(tankId)
  };

  return {
    isSignedIn,
    state,
    isBusy: isPending || save.isPending || remove.isPending,
    onToggle: () => (current ? remove.mutate() : save.mutate(null))
  };
};
