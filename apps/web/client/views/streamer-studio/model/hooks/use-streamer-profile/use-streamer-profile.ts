'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { getMyStreamerProfile, saveStreamerProfile } from '../../../api';

const fetchProfile = async () => {
  try {
    return await getMyStreamerProfile();
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }

    throw error;
  }
};

export const useStreamerProfile = () => useQuery({ queryKey: QUERY_KEYS.me.streamer.profile, queryFn: fetchProfile });

export const useSaveStreamerProfile = () => {
  const t = useTranslations('streamer.studio.toast');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveStreamerProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(QUERY_KEYS.me.streamer.profile, profile);
      toast.success(t('saved'));
    }
  });
};
