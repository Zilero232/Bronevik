'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useAuthSession } from '@/entities/auth/session';
import { getSettingsShare } from '@/entities/streamer/streamer';
import { QUERY_KEYS } from '@/shared/constants';

import { removeSettingsShare, updateSettingsShare } from '../../../api';

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
    query,
    isUpdating: update.isPending,
    isRemoving: remove.isPending,
    onAnonymousChange: (value: boolean) => {
      if (!update.isPending) {
        update.mutate(value);
      }
    },
    onRemove: () => remove.mutate()
  };
};
