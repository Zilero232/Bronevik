'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { isNotFoundError } from '@/shared/api/source';
import { getMyStreamerSettings, saveMyStreamerSettings } from '@/shared/api/streamers';
import { QUERY_KEYS } from '@/shared/constants';

const fetchSettings = async () => {
  try {
    return await getMyStreamerSettings();
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }

    throw error;
  }
};

export const useMyStreamerSettings = () => useQuery({ queryKey: QUERY_KEYS.me.streamer.settings, queryFn: fetchSettings });

export const useSaveStreamerSettings = () => {
  const t = useTranslations('streamer.studio.toast');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveMyStreamerSettings,
    onSuccess: (view) => {
      queryClient.setQueryData(QUERY_KEYS.me.streamer.settings, view);
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.streamers.settings(view.slug) });
      toast.success(t('settingsSaved'));
    },
    onError: () => toast.error(t('failed'))
  });
};
