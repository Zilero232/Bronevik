'use client';

import type { NotificationSettings } from '@otmetki/schemas';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { getNotificationSettings, updateNotificationSettings } from '@/features/notifications/notification-settings';
import { QUERY_KEYS } from '@/shared/constants';

const SETTINGS_KEY = QUERY_KEYS.me.section('notifications');

export const useNotificationSettings = () => {
  const t = useTranslations('notifications.settings');
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: SETTINGS_KEY, queryFn: getNotificationSettings });

  const save = useMutation({
    mutationFn: updateNotificationSettings,
    onMutate: async (patch: Partial<NotificationSettings>) => {
      await queryClient.cancelQueries({ queryKey: SETTINGS_KEY });

      const previous = queryClient.getQueryData<NotificationSettings>(SETTINGS_KEY);

      queryClient.setQueryData<NotificationSettings>(SETTINGS_KEY, (current) => current && { ...current, ...patch });

      return { previous };
    },
    onSuccess: (next) => queryClient.setQueryData(SETTINGS_KEY, next),
    onError: (_error, _patch, context) => {
      queryClient.setQueryData(SETTINGS_KEY, context?.previous);
      toast.error(t('failed'));
    }
  });

  return { query, save };
};
