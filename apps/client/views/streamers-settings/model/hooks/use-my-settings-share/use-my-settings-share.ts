'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useAuthSession } from '@/entities/auth/session';
import { getSettingsShare, removeSettingsShare, updateSettingsShare } from '@/shared/api/streamers';
import { QUERY_KEYS } from '@/shared/constants';

export const useMySettingsShare = () => {
  const t = useTranslations('streamerSettings.share');
  const queryClient = useQueryClient();
  const { data: session, isPending: isSessionPending } = useAuthSession();
  const isSignedIn = Boolean(session);
  const query = useQuery({ queryKey: QUERY_KEYS.me.streamer.settingsShare, queryFn: getSettingsShare, enabled: isSignedIn });

  const update = useMutation({
    mutationFn: updateSettingsShare,
    onSuccess: (share) => {
      queryClient.setQueryData(QUERY_KEYS.me.streamer.settingsShare, share);
      toast.success(t('saved'));
    },
    onError: () => toast.error(t('failed'))
  });

  const remove = useMutation({
    mutationFn: removeSettingsShare,
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEYS.me.streamer.settingsShare, null);
      toast.success(t('removed'));
    },
    onError: () => toast.error(t('failed'))
  });

  return {
    isSignedIn,
    isSessionPending,
    share: query.data ?? null,
    isPending: isSignedIn && query.isPending,
    isError: query.isError,
    isRetrying: query.isRefetching,
    isUpdating: update.isPending,
    isRemoving: remove.isPending,
    retry: () => void query.refetch(),
    onAnonymousChange: (value: boolean) => {
      if (!update.isPending) {
        update.mutate(value);
      }
    },
    onRemove: () => remove.mutate()
  };
};
